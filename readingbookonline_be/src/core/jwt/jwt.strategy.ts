import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConfig } from '@core/config/global';
import { DatabaseService } from '@core/database/database.service';
import { User } from '@features/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from '@features/user/dto/get-user-response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    protected readonly configService: ConfigService,
    private readonly dataBaseService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(jwtConfig.secret),
    });
  }

  async validate(payload: { user_id }): Promise<any> {
    const user: UserResponseDto | null =
      await this.dataBaseService.findOne<User>(this.userRepository, {
        where: { id: payload.user_id },
      });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
