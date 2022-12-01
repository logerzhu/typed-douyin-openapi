import { OpenapiBase } from './openapi_base'

export abstract class OpenapiNotification extends OpenapiBase {
  /**
   * 发送订阅消息
   */
  async sendNotification(data: {
    /* 模板的 id */
    tpl_id: string
    /* 接收消息目标用户的 open_id */
    open_id: string
    /* 模板内容，格式形如 { "key1": "value1", "key2": "value2" } */
    data: { [key: string]: any }
    /* 跳转的页面 */
    page?: string
  }): Promise<void> {
    await this.request({
      url: 'api/apps/subscribe_notification/developer/v1/notify',
      method: 'post',
      data: {
        access_token: await this.ensureAccessToken(),
        app_id: this.appid,
        tpl_id: data.tpl_id,
        open_id: data.open_id,
        data: data.data,
        page: data.page
      }
    })
  }
}
