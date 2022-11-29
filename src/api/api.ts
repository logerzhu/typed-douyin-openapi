import { TokenStorage } from '../storage'
import { applyMixins } from '../utils'
import { ApiBase, APIConfig } from './api_base'

export interface Api {}

export abstract class Api extends ApiBase {
  protected constructor(config: APIConfig, tokenStorage?: TokenStorage) {
    super(config, tokenStorage)
  }
}

applyMixins(Api, [])
