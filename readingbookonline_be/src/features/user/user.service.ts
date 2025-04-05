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
import { CreateManagerDto, CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '@core/database/database.service';
import { plainToInstance } from 'class-transformer';
import {
  GetUsersFilterDto,
  UserResponseDto,
} from './dto/get-user-response.dto';
import { jwtConfig, userConfig } from '@core/config/global';
import { LoggerService } from '@core/logger/logger.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CacheService } from '@core/cache/cache.service';
import { VerifyResetPasswordDto } from './dto/verify-reset-password-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { JwtService } from '@nestjs/jwt';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';

@Injectable()
export class UserService {
  private readonly roleUserId = userConfig.roleUserId;
  private readonly statusUserId = userConfig.statusUserId;
  private readonly redisTtlResetPassword = userConfig.redisTtlResetPassword;
  private readonly jwtSecret = jwtConfig.secret;
  private readonly jwtExpiresInVerify = jwtConfig.expiresInVerify;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataBaseService: DatabaseService,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
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
      const { email, password, name, birth_date } = body;

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
          birthDate: birth_date ? new Date(birth_date) : undefined,
          role: { id: this.roleUserId },
          status: { id: this.statusUserId },
        },
      );

      this.loggerService.info('User created', 'UserService.register');

      const verificationPayload = { id: newUser.id };
      const verificationToken = await this.jwtService.signAsync(
        verificationPayload,
        {
          secret: this.jwtSecret,
          expiresIn: this.jwtExpiresInVerify,
        },
      );

      await this.cacheService.set(
        `verify:${newUser.id}`,
        verificationToken,
        this.redisTtlResetPassword,
      );

      const verificationUrl = `http://localhost:3001/account/sign_in?token=${verificationToken}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Xác thực tài khoản của bạn',
        text: `Vui lòng xác thực tài khoản của bạn bằng cách truy cập đường dẫn sau: ${verificationUrl}. Link chỉ có hiệu lực trong 5 phút.`,
        html: `<h3>Xin chào ${name},</h3>
               <p>Vui lòng <a href="${verificationUrl}">click vào đây</a> để xác thực tài khoản của bạn. Lưu ý: Link chỉ có hiệu lực trong 5 phút.</p>`,
      });

      this.loggerService.info(
        'Verification email sent',
        'UserService.register',
      );

      return plainToInstance(UserResponseDto, newUser);
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.register');
      throw error;
    }
  }

  async verify(token: string): Promise<Boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });

      const storedToken = await this.cacheService.get(`verify:${payload.id}`);
      if (!storedToken || storedToken !== token) {
        throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
      }

      const user = await this.dataBaseService.findOne<User>(
        this.userRepository,
        {
          where: { id: payload.id },
        },
      );
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }

      await this.dataBaseService.update<User>(this.userRepository, user.id, {
        status: { id: 1 },
      });

      await this.cacheService.delete(`verify:${user.id}`);

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Chào mừng bạn tham gia!',
        text: `Xin chào ${user.name}, chào mừng bạn đến với ứng dụng của chúng tôi!`,
        html: `<h3>Xin chào ${user.name},</h3>
               <p>Chào mừng bạn đến với ứng dụng của chúng tôi!</p>`,
      });

      this.loggerService.info('Welcome email sent', 'UserService.verify');

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.verify');
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
  ): Promise<boolean> {
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

      const newPassword = generatePassword(8);

      const user = await this.dataBaseService.findOne<User>(
        this.userRepository,
        { where: { email } },
      );
      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      await this.dataBaseService.update<User>(this.userRepository, user.id, {
        password: await bcrypt.hash(newPassword, 10),
      });

      await this.mailerService.sendMail({
        to: email,
        subject: 'Mật khẩu mới của bạn',
        text: `Mật khẩu mới của bạn là: ${newPassword}. Vui lòng đăng nhập và thay đổi mật khẩu sau khi đăng nhập.`,
        html: `<p>Mật khẩu mới của bạn là: <strong>${newPassword}</strong></p>
               <p>Vui lòng đăng nhập và thay đổi mật khẩu sau khi đăng nhập.</p>`,
      });

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

      const user: User | null = await this.dataBaseService.findOne<User>(
        this.userRepository,
        {
          where: { id: userId },
          relations: ['role', 'status'],
        },
      );

      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      if (body.name) user.name = body.name;
      if (body.avatar) user.avatar = body.avatar;
      if (body.birthDate) user.birthDate = body.birthDate;

      await this.dataBaseService.update<User>(this.userRepository, userId, {
        ...body,
      });

      this.loggerService.info('User updated', 'UserService.updateUser');

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

  async getUsers(
    user: UserResponseDto,
    filter: GetUsersFilterDto,
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    try {
      const userInfo = user;
      const { limit = 10, page = 1 } = pagination;
      const { id, email, name, status, role } = filter;

      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.status', 'status')
        .orderBy('user.id', 'ASC');

      if (userInfo && userInfo?.role?.id !== 1) {
        query.andWhere('role.id != :adminRoleId', { adminRoleId: 1 });
      }

      if (id) {
        query.andWhere('user.id = :id', { id });
      }

      if (email) {
        query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
      }

      if (name) {
        query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
      }

      if (status) {
        query.andWhere('status.id = :status', { status });
      }

      if (role) {
        query.andWhere('role.id = :role', { role });
      }

      const [data, totalItems] = await query
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      return {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data: plainToInstance(UserResponseDto, data, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.getUsers');
      throw error;
    }
  }

  async createManagerAccount(createDto: CreateManagerDto): Promise<User> {
    try {
      const { email, password, name } = createDto;

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('Email đã được sử dụng');
      }

      const newUser = this.userRepository.create({
        email,
        password,
        name,
        role: { id: 2 },
        status: { id: 1 },
      });

      return this.userRepository.save(newUser);
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.createManagerAccount');
      throw error;
    }
  }

  async updateUserStatus(userId: number, statusId: number): Promise<Boolean> {
    try {
      const user = await this.dataBaseService.findOne(this.userRepository, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.dataBaseService.update(this.userRepository, userId, {
        status: { id: statusId },
      });

      this.loggerService.info(
        `Updated status of user ${userId} to statusId ${statusId}`,
        'UserService.updateUserStatus',
      );

      return true;
    } catch (error) {
      this.loggerService.err(error.message, 'UserService.updateUserStatus');
      throw error;
    }
  }
}

const generatePassword = (length) => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};
