export interface Configuration {
  port: number
  app: {
    port: number
  }
  appName?: string
  nodeEnv: string
  database: {
    url: string
  }
  jwt: {
    accessSecret: string
    refreshSecret: string
    accessExpiresIn: string
    refreshExpiresIn: string
  }
  s3: {
    bucketName: string
    region: string
    accessKey: string
    secretKey: string
    bucketUrl: string
  }
  smtp: {
    email: string
    password: string
  }
  bcrypt: {
    saltRounds: number
  }
  invitationRedirectUrl?: string
}

