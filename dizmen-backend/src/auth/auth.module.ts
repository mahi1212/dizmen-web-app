import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.jwt;
        return {
          secret: jwtConfig.accessSecret,
          signOptions: { 
            expiresIn: jwtConfig.accessExpiresIn,
          } as any,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
