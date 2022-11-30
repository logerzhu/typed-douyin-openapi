import { TokenStorage } from '../../api/storage'
import { applyMixins } from '../../utils'
import { OpenapiBase } from './openapi_base'
import { OpenapiLogin } from './openapi_login'
import { OpenapiUrlLink } from './openapi_url_link'
import { OpenapiCustomer } from './openapi_customer'
import { OpenapiQRCode } from './openapi_qrcode'

export interface DouyinOpenapi
  extends OpenapiBase,
    OpenapiLogin,
    OpenapiUrlLink,
    OpenapiCustomer,
    OpenapiQRCode {}

export class DouyinOpenapi extends OpenapiBase {
  constructor(
    config: {
      appid: string
      secret: string
      sandbox?: boolean
    },
    tokenStorage?: TokenStorage
  ) {
    super(config, tokenStorage)
  }
}

applyMixins(DouyinOpenapi, [
  OpenapiLogin,
  OpenapiUrlLink,
  OpenapiCustomer,
  OpenapiQRCode
])
