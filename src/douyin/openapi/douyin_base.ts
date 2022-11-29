import { Api } from '../../api/api'
import { TokenStorage } from '../../storage'

export abstract class DouyinBase extends Api {
  readonly appid: string
  readonly secret: string

  protected constructor(
    config: {
      appid: string
      secret: string
      sandbox?: boolean
    },
    tokenStorage?: TokenStorage
  ) {
    super(
      {
        baseURL:
          config.sandbox === true
            ? 'https://open-sandbox.douyin.com/'
            : 'https://developer.toutiao.com/'
      },
      tokenStorage
    )
    this.appid = config.appid
    this.secret = config.secret
  }

  async resolveAccessToken() {
    const result = await this.request({
      method: 'post',
      url: 'api/apps/v2/token',
      data: {
        grant_type: 'client_credential',
        appid: this.appid,
        secret: this.secret
      },
      ignoreAccessToken: true
    })
    return { access_token: result.access_token, expires_in: result.expires_in }
  }
}
