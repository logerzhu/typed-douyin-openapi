import { TokenStorage } from '../../api/storage'
import { applyMixins } from '../../utils'
import { PayBase } from './pay_base'
import { PayOrder } from './pay_order'

export interface DouyinPay extends PayBase, PayOrder {}

export class DouyinPay extends PayBase {
  constructor(
    config: {
      appid: string
      salt: string
      sandbox?: boolean
    },
    tokenStorage?: TokenStorage
  ) {
    super(config, tokenStorage)
  }
}

applyMixins(DouyinPay, [PayOrder])
