import { AccessToken, MemoryTokenStorage, TokenStorage } from '../storage'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { DouyinAPIError } from '../errors'

export type APIConfig = {
  baseURL: string
  accessTokenKey?: string
}

export type Logger = (message: any, ...args: any[]) => void

export abstract class ApiBase {
  readonly config: Required<APIConfig>
  private tokenStorage: TokenStorage
  private axiosInstance: AxiosInstance

  logger: Logger = () => {}

  protected constructor(config: APIConfig, tokenStorage?: TokenStorage) {
    this.config = {
      ...config,
      baseURL: config.baseURL,
      accessTokenKey: config.accessTokenKey || 'access_token'
    }
    this.tokenStorage = tokenStorage || new MemoryTokenStorage()

    this.axiosInstance = Axios.create({
      baseURL: this.config.baseURL,
      timeout: 12000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async request(
    opts: AxiosRequestConfig & { ignoreAccessToken?: boolean },
    retry = 3
  ): Promise<any> {
    opts.method = opts.method || 'get'
    if (!opts.ignoreAccessToken) {
      const token = await this.ensureAccessToken()
      opts.params = opts.params || {}
      opts.params[this.config.accessTokenKey] = token.accessToken
    }

    try {
      const res = await this.axiosInstance.request(opts)
      this.logger('DouyinRequest', opts, res.data)
      if (res.status < 200 || res.status > 204) {
        throw new DouyinAPIError(
          `url: ${opts.url}, status code: ${res.status}`,
          -1
        )
      }

      const { err_no, err_tips, data } = res.data
      if (!err_no && data) {
        return data
      }

      if ([12024, 12025].indexOf(err_no) != -1 && retry > 0) {
        // Token错误/过期, 重新获取
        await this.tokenStorage.save(null)
        return this.request(opts, retry - 1)
      } else {
        throw new DouyinAPIError(err_tips, err_no)
      }
    } catch (error) {
      console.error('ErrorRequest:', opts.url)
      if (error instanceof DouyinAPIError) {
        throw error
      } else if (error.response) {
        console.error('ErrorRequest', opts)
        throw new DouyinAPIError(
          error.response.data?.err_tips || '服务器内部错误',
          error.response.data?.err_no || error.response.status
        )
      } else if (error.request) {
        throw new DouyinAPIError('请求超时，请检查网络', -406)
      } else if (typeof error.err_no === 'undefined') {
        throw new DouyinAPIError('请求失败，请稍后再试', -400)
      } else {
        throw new DouyinAPIError('未知错误', -500)
      }
    }
  }

  abstract resolveAccessToken(): Promise<{
    access_token: string
    expires_in: number
  }>

  async getAccessToken() {
    const { expires_in, access_token } = await this.resolveAccessToken()
    // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
    const expireTime = new Date().getTime() + (expires_in - 10) * 1000
    const token = new AccessToken(access_token, expireTime)

    await this.tokenStorage.save(token)
    return token
  }

  async ensureAccessToken() {
    const token = await this.tokenStorage.load()
    if (token?.isValid()) {
      return token
    }
    return this.getAccessToken()
  }
}
