import { MemoryTokenStorage, TokenStorage } from './storage'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { DouyinAPIError } from '../errors'

export type Logger = (message: any, ...args: any[]) => void

export abstract class ApiBase {
  readonly baseURL: string
  protected tokenStorage: TokenStorage
  private axiosInstance: AxiosInstance

  logger: Logger = () => {}

  protected constructor(baseURL: string, tokenStorage?: TokenStorage) {
    this.tokenStorage = tokenStorage || new MemoryTokenStorage()

    this.axiosInstance = Axios.create({
      baseURL: baseURL,
      timeout: 12000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async request(opts: AxiosRequestConfig, retry = 3): Promise<any> {
    opts.method = opts.method || 'get'
    try {
      const res = await this.axiosInstance.request(opts)
      this.logger('DouyinRequest', opts, res.data)
      if (res.status < 200 || res.status > 204) {
        throw new DouyinAPIError(
          `url: ${opts.url}, status code: ${res.status}`,
          -1
        )
      }
      const { err_no, err_msg, err_tips } = res.data
      if (!err_no) {
        return res.data
      }

      if ([12024, 12025].indexOf(err_no) != -1 && retry > 0) {
        // Token错误/过期, 重新获取
        await this.tokenStorage.save(null)
        return this.request(opts, retry - 1)
      } else {
        throw new DouyinAPIError(err_tips || err_msg, err_no)
      }
    } catch (error) {
      console.error('ErrorRequest:', opts.url, new Date())
      if (error instanceof DouyinAPIError) {
        throw error
      } else if (error.response) {
        console.error('ErrorRequest', opts, new Date())
        throw new DouyinAPIError(
          error.response.data?.err_tips ||
            error.response.data?.err_msg ||
            '服务器内部错误',
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
}
