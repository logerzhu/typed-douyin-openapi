export class DouyinAPIError extends Error {
  readonly errCode: number

  constructor(message: string, errCode: number) {
    super(message + ':' + errCode)
    this.errCode = errCode
  }
}
