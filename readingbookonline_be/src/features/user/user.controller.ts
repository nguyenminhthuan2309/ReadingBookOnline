import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Put,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateManagerDto, CreateUserDto } from './dto/create-user.dto';
import {
  GetUsersFilterDto,
  UserResponseDto,
} from './dto/get-user-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetPasswordDto } from './dto/verify-reset-password-dto';
import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { AdminGuard } from '@core/auth/admin.guard';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Tạo tài khoản' })
  @Post('/register')
  async register(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.register(body);
  }

  @ApiOperation({ summary: 'Xác thực tài khoản' })
  @Get('/verify')
  async verify(@Query('token') token: string): Promise<Boolean> {
    return await this.userService.verify(token);
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
  @Put()
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Admin lấy danh sách người dùng' })
  @Get()
  async getUsers(
    @Req() req: any,
    @Query() filter: GetUsersFilterDto,
    @Query() pagination: PaginationRequestDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    const user = req.user;
    return this.userService.getUsers(user, filter, pagination);
  }

  @Post('create-manager')
  @ApiOperation({ summary: 'Tạo tài khoản Manager (chỉ Super Admin)' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createManager(@Body() createDto: CreateManagerDto) {
    return this.userService.createManagerAccount(createDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Cập nhật trạng thái người dùng' })
  @Patch('status/:id')
  async updateUserStatus(
    @Param('id') id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<Boolean> {
    return await this.userService.updateUserStatus(
      id,
      updateUserStatusDto.statusId,
    );
  }
}
