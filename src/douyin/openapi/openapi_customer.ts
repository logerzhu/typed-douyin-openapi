import { OpenapiBase } from './openapi_base'

export abstract class OpenapiCustomer extends OpenapiBase {
  /**
   * 获取官方平台客服链接
   */
  async customerServiceUrl(data: {
    openid: string
    /*来源，抖音传 1128，抖音极速版传 2329*/
    type: '1128' | '2329'
    order_id?: string
    im_type?: 'group_buy'
  }): Promise<{
    log_id: string
    url: string
  }> {
    const result = await this.request({
      url: 'https://developer.toutiao.com/api/apps/chat/customer_service_url',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': await this.ensureAccessToken()
      },
      params: {
        appid: this.appid,
        openid: data.openid,
        type: data.type,
        scene: '1',
        order_id: data.order_id,
        im_type: data.im_type || 'group_buy'
      }
    })
    return {
      log_id: result.data.log_id,
      url: result.data.data.url
    }
  }
}
