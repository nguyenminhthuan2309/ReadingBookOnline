import { jwtConfig } from '@core/config/global';
import { UserResponseDto } from '@features/user/dto/get-user-response.dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadDto } from '@shared/dto/jwt/jwt.dto';
import { plainToInstance } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret || 'your_secret_key',
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserResponseDto> {
    return plainToInstance(UserResponseDto, payload, {
      excludeExtraneousValues: true,
    });
  }
}
