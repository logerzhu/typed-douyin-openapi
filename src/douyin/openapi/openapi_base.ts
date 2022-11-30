import { AccessToken, TokenStorage } from '../../api/storage'
import { ApiBase } from '../../api/api_base'

export abstract class OpenapiBase extends ApiBase {
  readonly appid: string
  readonly secret: string
  readonly sandbox: boolean

  protected constructor(
    config: {
      appid: string
      secret: string
      sandbox?: boolean
    },
    tokenStorage?: TokenStorage
  ) {
    super(
      config.sandbox === true
        ? 'https://open-sandbox.douyin.com/'
        : 'https://developer.toutiao.com/',
      tokenStorage
    )
    this.appid = config.appid
    this.secret = config.secret
    this.sandbox = config.sandbox || false
  }

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
      return token.accessToken
    }
    return (await this.getAccessToken()).accessToken
  }

  async resolveAccessToken() {
    const result = (
      await this.request({
        method: 'post',
        url: 'api/apps/v2/token',
        data: {
          grant_type: 'client_credential',
          appid: this.appid,
          secret: this.secret
        }
      })
    ).data
    return { access_token: result.access_token, expires_in: result.expires_in }
  }
}
