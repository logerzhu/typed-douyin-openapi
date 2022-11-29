import { TokenStorage } from '../../storage'
import { applyMixins } from '../../utils'
import { DouyinBase } from './douyin_base'

export interface DouyinApi extends DouyinBase {}

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

applyMixins(DouyinApi, [])
