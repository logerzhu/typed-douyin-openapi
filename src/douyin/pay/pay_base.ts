import { TokenStorage } from '../../api/storage'
import { ApiBase } from '../../api/api_base'
import md5 from 'md5'
import { DouyinAPIError } from '../../errors'

export abstract class PayBase extends ApiBase {
  readonly appid: string
  readonly salt: string
  readonly token: string
  readonly sandbox: boolean

  protected constructor(
    config: {
      appid: string
      salt: string
      token: string
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
    this.token = config.token
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

  verifyAndGetMsg(query: {
    msg_signature: string
    timestamp: number
    msg: string
    nonce: string
  }) {
    const { msg_signature, timestamp, msg, nonce } = query
    const strArr = [this.token, timestamp, nonce, msg].sort()
    const str = strArr.join('')
    const _signature = require('crypto')
      .createHash('sha1')
      .update(str)
      .digest('hex')
    if (msg_signature == _signature) {
      return JSON.parse(msg)
    } else {
      throw new DouyinAPIError('Invalid signature', -2)
    }
  }
}
