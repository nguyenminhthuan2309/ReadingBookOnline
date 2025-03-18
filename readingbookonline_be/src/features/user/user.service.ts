import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '@core/database/database.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/get-user-response.dto';
import { jwtConfig, userConfig } from '@core/config/global';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class UserService {
  private readonly roleUserId = userConfig.roleUserId;
  private readonly statusUserId = userConfig.statusUserId;
  private secretJWT = jwtConfig.secret;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataBaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const { email, password, name } = createUserDto;

      const emailExists = await this.dataBaseService.findOne<User>(
        this.userRepository,
        { where: { email } },
      );

      if (emailExists) {
        throw new BadRequestException('Email đã được sử dụng');
      }

      const newUser: User = await this.dataBaseService.create<User>(
        this.userRepository,
        {
          email,
          password,
          name,
          role: { id: this.roleUserId },
          status: { id: this.statusUserId },
        },
      );

      this.loggerService.info('User created', 'UserService.register');

      return plainToInstance(UserResponseDto, newUser);
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.register');

      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const { email, password } = loginDto;
      const user: User | null = await this.dataBaseService.findOne<User>(
        this.userRepository,
        {
          where: { email },
          relations: ['role', 'status'],
        },
      );

      if (!user) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }

      const payload = plainToInstance(
        UserResponseDto,
        { ...user, roleId: user.role.id, statusId: user.status.id },
        { excludeExtraneousValues: true },
      );

      const accessToken = await this.jwtService.signAsync(
        instanceToPlain(payload),
        { secret: this.secretJWT },
      );

      this.loggerService.info('User logged in', 'UserService.login');

      return { accessToken };
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.register');

      throw error;
    }
  }
}
