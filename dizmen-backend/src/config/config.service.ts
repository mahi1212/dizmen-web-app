import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Configuration } from './configuration';

@Injectable()
export class ConfigService {
  constructor(
    private readonly configService: NestConfigService<Configuration>,
  ) {}

  get port(): number {
    return this.configService.get('port', { infer: true })!;
  }

  get app() {
    return {
      port: this.configService.get('app.port', { infer: true })!,
    };
  }

  get appName(): string | undefined {
    return this.configService.get('appName', { infer: true });
  }

  get nodeEnv(): string {
    return this.configService.get('nodeEnv', { infer: true })!;
  }

  get database() {
    return {
      url: this.configService.get('database.url', { infer: true })!,
    };
  }

  get jwt() {
    return {
      accessSecret: this.configService.get('jwt.accessSecret', {
        infer: true,
      })!,

      refreshSecret: this.configService.get('jwt.refreshSecret', {
        infer: true,
      })!,

      accessExpiresIn: this.configService.get('jwt.accessExpiresIn', {
        infer: true,
      })!,

      refreshExpiresIn: this.configService.get('jwt.refreshExpiresIn', {
        infer: true,
      })!,
    };
  }

  get s3() {
    return {
      bucketName: this.configService.get('AWS_S3_BUCKET_NAME') || this.configService.get('S3_BUCKET_NAME') || '',
      region: this.configService.get('AWS_REGION') || this.configService.get('S3_REGION') || 'us-east-1',
      accessKey: this.configService.get('AWS_ACCESS_KEY_ID') || this.configService.get('S3_ACCESS_KEY') || '',
      secretKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || this.configService.get('S3_SECRET_KEY') || '',
      bucketUrl: this.configService.get('AWS_S3_BUCKET_URL') || this.configService.get('S3_BUCKET_URL') || '',
    };
  }

  get smtp() {
    return {
      email: this.configService.get('smtp.email', { infer: true })!,
      password: this.configService.get('smtp.password', { infer: true })!,
    };
  }

  get bcrypt() {
    return {
      saltRounds: this.configService.get('bcrypt.saltRounds', { infer: true })!,
    };
  }

  get invitationRedirectUrl(): string | undefined {
    return this.configService.get('invitationRedirectUrl', { infer: true });
  }
}
