export class AccessToken {
  readonly accessToken: string
  readonly expireTime: number

  constructor(accessToken: string, expireTime: number) {
    this.accessToken = accessToken
    this.expireTime = expireTime
  }

  isValid() {
    return !!this.accessToken && Date.now() < this.expireTime
  }

  toJSON() {
    return { accessToken: this.accessToken, expireTime: this.expireTime }
  }

  static fromJSON(value: any) {
    if (value?.accessToken && value?.expireTime) {
      return new AccessToken(value.accessToken, value.expireTime)
    } else {
      return null
    }
  }
}

export interface TokenStorage {
  load(): Promise<AccessToken | null>

  save(token: AccessToken | null): Promise<void>
}

export class MemoryTokenStorage implements TokenStorage {
  private token: AccessToken | null = null

  async load() {
    return this.token
  }

  async save(token: AccessToken | null) {
    this.token = token
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        "Don't save token in memory, when cluster or multi-computer!"
      )
    }
  }
}
