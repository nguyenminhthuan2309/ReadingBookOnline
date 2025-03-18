import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig } from '@core/config/global';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  providers: [JwtStrategy],
  exports: [NestJwtModule, PassportModule],
})
export class JwtModule {}
