import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig } from '@core/config/global';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(jwtConfig.secret),
        signOptions: {
          expiresIn: configService.get<string>(jwtConfig.expiresIn),
        },
      }),
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
