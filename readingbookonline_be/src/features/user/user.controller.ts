import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/get-user-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetPasswordDto } from './dto/verify-reset-password-dto';
import { JwtAuthGuard } from '@core/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Tạo tài khoản' })
  @Post('/register')
  async register(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.register(body);
  }

  @ApiOperation({ summary: 'Quên mật khẩu' })
  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<Boolean> {
    return await this.userService.resetPassword(body);
  }

  @ApiOperation({ summary: 'Xác thực otp' })
  @Post('/verify-reset-password')
  async verifyResetPasswordCode(
    @Body() body: VerifyResetPasswordDto,
  ): Promise<Boolean> {
    return await this.userService.verifyResetPasswordCode(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  @Get('/detail')
  async getProfile(@Req() req: Request): Promise<UserResponseDto> {
    return await this.userService.getProfile(req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @Put('')
  async updateUser(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateUser(req, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @Put('update-password')
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    return this.userService.updatePassword(req, body);
  }
}
