import { OpenapiBase } from './openapi_base'

export abstract class OpenapiUrlLink extends OpenapiBase {
  /**
   * 成能够直接跳转到端内小程序的 url link。
   */
  async generateUrlLink(data: {
    app_name?: 'douyin' | 'douyinlite'
    /*通过URL Link进入的小程序页面路径，必须是已经发布的小程序存在的页面，不可携带 query。path 为空时会跳转小程序主页。*/
    path?: string
    /*
    通过URL Link进入小程序时的 query（json形式），若无请填{}。最大1024个字符，只支持数字，大小写英文以及部分特殊字符：`{}!#$&'()*+,/:;=?@-._~%``。
     */
    query?: string | '{}'
    /* 到期失效的URL Link的失效时间。为 Unix 时间戳，实际失效时间为距离当前时间小时数，向上取整。最长间隔天数为180天。*/
    expire_time?: number
  }): Promise<string> {
    const result = await this.request({
      url: 'https://developer.toutiao.com/api/apps/url_link/generate',
      method: 'post',
      data: {
        access_token: await this.ensureAccessToken(),
        ma_app_id: this.appid,
        app_name: data.app_name || 'douyin',
        path: data.path,
        query: data.query || '{}',
        expire_time:
          data.expire_time || Math.floor(Date.now() / 1000 + 180 * 24 * 60 * 60)
      }
    })
    return result.url_link
  }

  /**
   * 查询已经生成的 link 的信息，过期的 url_link 返回"url_link 不存在"。
   * @param url_link
   */
  async queryUrlLinkInfo(
    url_link: string
  ): Promise<{
    app_name: string
    ma_app_id: string
    path: string
    query: string
    create_time: number
    expire_time: number
  }> {
    const result = await this.request({
      url: 'https://developer.toutiao.com/api/apps/url_link/query_info',
      method: 'post',
      data: {
        access_token: await this.ensureAccessToken(),
        ma_app_id: this.appid,
        url_link: url_link
      }
    })
    return result.url_link_info
  }

  async queryUrlLinkQuota(): Promise<{
    url_link_used: number
    url_link_limit: number
  }> {
    const result = await this.request({
      url: 'https://developer.toutiao.com/api/apps/url_link/query_quota',
      method: 'post',
      data: {
        access_token: await this.ensureAccessToken(),
        ma_app_id: this.appid
      }
    })
    return result.url_link_quota
  }
}
