import { TokenStorage } from '../../storage'
import { applyMixins } from '../../utils'
import { DouyinBase } from './douyin_base'
import { DouyinLogin } from './douyin_login'
import { DouyinUrlLink } from './douyin_url_link'
import { DouyinCustomer } from './douyin_customer'

export interface DouyinApi
  extends DouyinBase,
    DouyinLogin,
    DouyinUrlLink,
    DouyinCustomer {}

export class DouyinApi extends DouyinBase {
  readonly appid: string
  readonly secret: string

  constructor(
    config: {
      appid: string
      secret: string
      sandbox?: boolean
    },
    tokenStorage?: TokenStorage
  ) {
    super(config, tokenStorage)
    this.appid = config.appid
    this.secret = config.secret
  }
}

applyMixins(DouyinApi, [DouyinLogin, DouyinUrlLink, DouyinCustomer])
