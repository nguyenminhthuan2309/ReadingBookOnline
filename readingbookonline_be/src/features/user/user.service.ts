import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '@core/database/database.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/get-user-response.dto';
import { userConfig } from '@core/config/global';
import { LoggerService } from '@core/logger/logger.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CacheService } from '@core/cache/cache.service';
import { VerifyResetPasswordDto } from './dto/verify-reset-password-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';

@Injectable()
export class UserService {
  private readonly roleUserId = userConfig.roleUserId;
  private readonly statusUserId = userConfig.statusUserId;
  private readonly redisTtlResetPassword = userConfig.redisTtlResetPassword;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataBaseService: DatabaseService,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
    private readonly cacheService: CacheService,
  ) {}

  private generateOTP(): string {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  private async renderTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): Promise<string> {
    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'shared',
        'templates',
        `${templateName}.hbs`,
      );

      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = Handlebars.compile(templateContent);

      return compiledTemplate(variables);
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.resetPassword');
      throw error;
    }
  }

  async register(body: CreateUserDto): Promise<UserResponseDto> {
    try {
      const { email, password, name } = body;

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

      await this.mailerService.sendMail({
        to: email,
        subject: 'Chào mừng bạn đến với ứng dụng!',
        text: `Xin chào ${name}, cảm ơn bạn đã đăng ký!`,
        html: `<h3>Xin chào ${name},</h3><p>Cảm ơn bạn đã đăng ký tài khoản. Chúc bạn có trải nghiệm tuyệt vời!</p>`,
      });

      this.loggerService.info('Email sent', 'UserService.register');

      return plainToInstance(UserResponseDto, newUser);
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.register');

      throw error;
    }
  }

  async resetPassword(body: ResetPasswordDto): Promise<Boolean> {
    try {
      const otp = this.generateOTP();
      const emailContent = await this.renderTemplate('reset-password', {
        token: otp,
      });
      const email = body.email;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Mã OTP đặt lại mật khẩu',
        html: emailContent,
      });

      this.loggerService.info('OTP sent', 'UserService.resetPassword');

      const cachedKey = `reset-password:${email}`;

      await this.cacheService.set(cachedKey, otp, this.redisTtlResetPassword);

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.resetPassword');
      throw error;
    }
  }

  async verifyResetPasswordCode(
    body: VerifyResetPasswordDto,
  ): Promise<Boolean> {
    try {
      const email = body.email;
      const cachedKey = `reset-password:${email}`;
      const failCountKey = `reset-password:fail-count:${email}`;
      const storedOtp = await this.cacheService.get(cachedKey);

      if (!storedOtp) {
        throw new BadRequestException('Mã code không tồn tại hoặc đã hết hạn.');
      }

      const failCount = Number(await this.cacheService.get(failCountKey)) ?? 0;

      if (storedOtp !== body.otp) {
        const newFailCount = failCount + 1;

        if (newFailCount >= 3) {
          await this.cacheService.delete(cachedKey);
          await this.cacheService.delete(failCountKey);
          throw new BadRequestException('Bạn đã nhập sai quá số lần cho phép.');
        }

        await this.cacheService.set(
          failCountKey,
          newFailCount.toString(),
          this.redisTtlResetPassword,
        );
        throw new BadRequestException('Mã OTP không đúng.');
      }

      await this.cacheService.delete(cachedKey);
      await this.cacheService.delete(failCountKey);

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.resetPassword');
      throw error;
    }
  }

  async getProfile(req: Request): Promise<UserResponseDto> {
    try {
      const id = (req as any).user?.id;

      const infoUser: User | null = await this.dataBaseService.findOne<User>(
        this.userRepository,
        { relations: ['role', 'status'], where: { id } },
      );

      const user = plainToInstance(UserResponseDto, infoUser, {
        excludeExtraneousValues: true,
      });

      return user;
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.getProfile');
      throw error;
    }
  }

  async updateUser(
    req: Request,
    body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new BadRequestException('Không thể xác thực người dùng');
      }

      const user = await this.dataBaseService.findOne<User>(
        this.userRepository,
        {
          where: { id: userId },
        },
      );

      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      if (body.name) user.name = body.name;
      // if (updateUserDto.avatar) user.avatar = updateUserDto.avatar;

      await this.userRepository.save(user);

      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.updateUser');
      throw error;
    }
  }

  async updatePassword(
    req: Request,
    body: UpdatePasswordDto,
  ): Promise<Boolean> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new BadRequestException('Không thể xác thực người dùng');
      }

      const user = await this.dataBaseService.findOne(this.userRepository, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const isMatch = await bcrypt.compare(body.oldPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Mật khẩu cũ không đúng');
      }

      await this.dataBaseService.update<User>(this.userRepository, userId, {
        password: await bcrypt.hash(body.newPassword, 10),
      });

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.updatePassword');
      throw error;
    }
  }
}
