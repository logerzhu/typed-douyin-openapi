import { PayBase } from './pay_base'

export abstract class PayOrder extends PayBase {
  /**
   * 预下单
   */
  async createOrder(data: {
    /* 开发者侧的订单号。 只能是数字、大小写字母_-*且在同一个app_id下唯一 */
    out_order_no: string
    /* 支付价格。 单位为[分] */
    total_amount: number
    /* 商品描述。 长度限制不超过 128 字节且不超过 42 字符 */
    subject: string
    /* 商品详情 长度限制不超过 128 字节且不超过 42 字符 */
    body: string
    /* 订单过期时间(秒)。最小5分钟，最大2天，小于5分钟会被置为5分钟，大于2天会被置为2天 */
    valid_time: number
    /*开发者自定义字段，回调原样回传。最大长度2048, 超过最大长度会被截断*/
    cp_extra?: string
    /* 商户自定义回调地址，必须以 https 开头，支持 443 端口。 指定时，支付成功后抖音会请求该地址通知开发者 */
    notify_url?: string
    /* 第三方平台服务商 id，非服务商模式留空 */
    thirdparty_id?: string
    /* 可用此字段指定本单使用的收款商户号（目前为灰度功能，需要联系平台运营添加白名单；未在白名单的小程序，该字段不生效）*/
    store_uid?: string
    /*是否屏蔽支付完成后推送用户抖音消息，1-屏蔽 0-非屏蔽，默认为0。 特别注意： 若接入POI, 请传1。因为POI订单体系会发消息，所以不用再接收一次担保支付推送消息，*/
    disable_msg?: 1 | 0
    /* 支付完成后推送给用户的抖音消息跳转页面，开发者需要传入在app.json中定义的链接，如果不传则跳转首页。 */
    msg_page?: string
  }): Promise<{
    order_id: string
    order_token: string
  }> {
    const postData = {
      app_id: this.appid,
      out_order_no: data.out_order_no,
      total_amount: Math.round(data.total_amount),
      subject: data.subject,
      body: data.body,
      valid_time: data.valid_time,
      cp_extra: data.cp_extra,
      notify_url: data.notify_url,
      store_uid: data.store_uid,
      disable_msg: data.disable_msg,
      msg_page: data.msg_page,
      thirdparty_id: data.thirdparty_id
    }
    const result = await this.request({
      url: 'api/apps/ecpay/v1/create_order',
      method: 'post',
      data: this.signAndGet(postData)
    })
    return result.data
  }

  async queryOrder(data: {
    /* 开发者侧的订单号。 只能是数字、大小写字母_-*且在同一个app_id下唯一 */
    out_order_no: string
    /* 第三方平台服务商 id，非服务商模式留空 */
    thirdparty_id?: string
  }): Promise<{
    order_id: string
    payment_info: {
      /* 支付金额，单位为分 */
      total_fee: number
      /* 支付状态枚举值：SUCCESS：成功 TIMEOUT：超时未支付 PROCESSING：处理中 FAIL：失败*/
      order_status: 'SUCCESS' | 'TIMEOUT' | 'PROCESSING' | 'FAIL'
      /* 支付时间， 格式为"yyyy-MM-dd hh:mm:ss" */
      pay_time: string
      /* 支付渠道， 1-微信支付，2-支付宝支付，10-抖音支付 */
      way: 1 | 2 | 10
      /* 支付渠道侧的支付单号 */
      channel_no: string
      /* 该笔交易卖家商户号 */
      seller_uid: string
      /* 订单来源视频对应视频 id */
      item_id: string
      /* 开发者自定义字段 */
      cp_extra?: string
      cps_info?: {
        /* 达人分佣金额，单位为分。后续商户在进行分账时需要注意可分账金额应扣除达人分佣金额。注意：由于订单归因与佣金计算存在延迟，支付成功后立即查询可能未计算完成，建议开发者在支付成功后分账前再进行查询。 */
        share_amount: string
        /* 达人抖音号 */
        douyin_id: string
        /* 达人昵称 */
        nickname: string
      }
    }
  }> {
    const postData = {
      app_id: this.appid,
      out_order_no: data.out_order_no,
      thirdparty_id: data.thirdparty_id
    }
    const result = await this.request({
      url: 'api/apps/ecpay/v1/query_order',
      method: 'post',
      data: this.signAndGet(postData)
    })
    return result
  }

  /**
   * 发起退款
   * @param data
   */
  async createRefund(data: {
    /* 商户分配支付单号，标识进行退款的订单 */
    out_order_no: string
    /* 商户分配退款号，保证在商户中唯一 */
    out_refund_no: string
    /* 退款原因 */
    reason: string
    /*退款金额，单位分*/
    refund_amount: number
    /*开发者自定义字段，回调原样回传。最大长度2048, 超过最大长度会被截断*/
    cp_extra?: string
    /* 商户自定义回调地址，必须以 https 开头，支持 443 端口。 指定时，支付成功后抖音会请求该地址通知开发者 */
    notify_url?: string
    /* 第三方平台服务商 id，非服务商模式留空 */
    thirdparty_id?: string
    /* 可用此字段指定本单使用的收款商户号（目前为灰度功能，需要联系平台运营添加白名单；未在白名单的小程序，该字段不生效）*/
    store_uid?: string
    /*是否屏蔽支付完成后推送用户抖音消息，1-屏蔽 0-非屏蔽，默认为0。 特别注意： 若接入POI, 请传1。因为POI订单体系会发消息，所以不用再接收一次担保支付推送消息，*/
    disable_msg?: 1 | 0
    /* 支付完成后推送给用户的抖音消息跳转页面，开发者需要传入在app.json中定义的链接，如果不传则跳转首页。 */
    msg_page?: string
  }): Promise<{
    refund_no: string
  }> {
    const postData = {
      app_id: this.appid,
      out_order_no: data.out_order_no,
      out_refund_no: data.out_refund_no,
      reason: data.reason,
      refund_amount: data.refund_amount,
      cp_extra: data.cp_extra,
      notify_url: data.notify_url,
      store_uid: data.store_uid,
      disable_msg: data.disable_msg,
      msg_page: data.msg_page,
      thirdparty_id: data.thirdparty_id
    }
    const result = await this.request({
      url: 'api/apps/ecpay/v1/create_refund',
      method: 'post',
      data: this.signAndGet(postData)
    })
    return result
  }
}
