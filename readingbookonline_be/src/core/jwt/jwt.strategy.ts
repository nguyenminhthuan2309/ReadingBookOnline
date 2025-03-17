import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConfig } from '@core/config/global';
import { UserResponseDto } from '@features/user/dto/get-user-response.dto';
import { LoginResponseDto } from '@features/user/dto/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(jwtConfig.secret),
        });
    }

    async validate(payload): Promise<any> {
        return payload;

    }
}
