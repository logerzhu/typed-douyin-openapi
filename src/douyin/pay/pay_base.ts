import { TokenStorage } from '../../api/storage'
import { ApiBase } from '../../api/api_base'
import md5 from 'md5'

export abstract class PayBase extends ApiBase {
  readonly appid: string
  readonly salt: string
  readonly sandbox: boolean

  protected constructor(
    config: {
      appid: string
      salt: string
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
    this.salt = config.salt
    this.sandbox = config.sandbox || false
  }

  signAndGet(params: { [key: string]: any }) {
    // params 代表请求内容
    const skip_arr = ['thirdparty_id', 'app_id', 'sign']
    const paramArray = []
    const signParams: { [key: string]: any } = {}
    for (const k in params) {
      if (params[k] == '' || params[k] === undefined) {
        continue
      }
      signParams[k] = params[k]
      if (skip_arr.indexOf(k) != -1) {
        continue
      }
      paramArray.push(params[k])
    }
    paramArray.push(this.salt)
    paramArray.sort()

    signParams['sign'] = md5(paramArray.join('&'))
    console.log(JSON.stringify(signParams), this.salt)
    return signParams
  }
}
