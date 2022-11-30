import { OpenapiBase } from './openapi_base'

export abstract class OpenapiLogin extends OpenapiBase {
  /**
   * 获取用户登录的 session_key 和 openId。
   */
  async jscode2session(
    code: string
  ): Promise<{
    session_key: string
    openid: string
    unionid: string
  }> {
    const result = await this.request({
      url: 'api/apps/v2/jscode2session',
      method: 'post',
      data: {
        appid: this.appid,
        secret: this.secret,
        code: code
      }
    })
    return result.data
  }

  /**
   * 获取用户登录的 session_key 和 openId。
   */
  async jscode2session_anonymous(
    anonymous_code: string
  ): Promise<{
    session_key: string
    anonymous_openid: string
  }> {
    const result = await this.request({
      url: 'api/apps/v2/jscode2session',
      method: 'post',
      data: {
        appid: this.appid,
        secret: this.secret,
        anonymous_code: anonymous_code
      }
    })
    return result.data
  }
}
