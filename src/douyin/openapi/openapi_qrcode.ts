import { OpenapiBase } from './openapi_base'

export abstract class OpenapiQRCode extends OpenapiBase {
  /**
   * 获取小程序/小游戏的二维码
   */
  async createQRCode(data: {
    appname?:
      | 'toutiao'
      | 'toutiao_lite'
      | 'douyin'
      | 'douyin_lite'
      | 'pipixia'
      | 'huoshan'
      | 'xigua'
    /*小程序/小游戏启动参数，小程序则格式为 encode({path}?{query})，小游戏则格式为 JSON 字符串，默认为空*/
    path?: string
    /*二维码宽度，单位 px，最小 280px，最大 1280px，默认为 430px*/
    width?: number
    /*二维码线条颜色，默认为黑色: {"r":0,"g":0,"b":0} */
    line_color?: string
    /*二维码背景颜色，默认为白色*/
    background?: string
    /*是否展示小程序/小游戏 icon，默认不展示*/
    set_icon?: boolean
  }): Promise<Buffer> {
    const result = await this.request({
      url: 'api/apps/qrcode',
      method: 'post',
      responseType: 'arraybuffer',
      headers: {},
      data: {
        access_token: await this.ensureAccessToken(),
        appname: data.appname || 'toutiao',
        width: data.width,
        line_color: data.line_color,
        background: data.background,
        set_icon: data.set_icon || false
      }
    })
    return result
  }
}
