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
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateManagerDto, CreateUserDto } from './dto/create-user.dto';
import {
  GetUsersFilterDto,
  UserProfileResponseDto,
  UserResponseDto,
} from './dto/get-user-response.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetPasswordDto } from './dto/verify-reset-password-dto';
import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { AdminGuard } from '@core/auth/admin.guard';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';
import { AddFavoriteCategoriesDto } from './dto/user-favorite.dto';
import { UpdateSettingsDto } from './dto/user-setting.dto';
import { UserProfileDto } from './dto/user-profile.dto';

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
  @Get('/me')
  async getProfile(@Req() req: Request): Promise<UserProfileResponseDto> {
    return await this.userService.getProfile(req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @Patch()
  async updateUser(
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateUser(req, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @Patch('update-password')
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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Thêm thể loại sách với người dùng' })
  @ApiBody({ type: AddFavoriteCategoriesDto })
  @Post('favorite/categories')
  async addFavorites(
    @Req() req: Request,
    @Body() body: { categoryIds: number[] },
  ) {
    const userId = (req as any).user?.id;
    return this.userService.addFavorite(userId, body.categoryIds);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Chỉnh sửa thể loại sách yêu thích của người dùng' })
  @ApiBody({ type: AddFavoriteCategoriesDto })
  @Patch('favorite/categories')
  async updateFavorite(
    @Req() req: Request,
    @Body() body: AddFavoriteCategoriesDto,
  ) {
    const userId = (req as any).user?.id;
    return this.userService.updateFavorite(userId, body.categoryIds);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách thể loại sách yêu thích của người dùng',
  })
  @Get('favorite/categories')
  async getFavoriteCategories(@Req() req: Request) {
    const userId = (req as any).user?.id;
    return this.userService.getFavoriteCategories(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy setting của người dùng',
  })
  @Get('settings')
  async getSettings(@Req() req: Request) {
    const userId = (req as any).user?.id;
    return this.userService.getSettings(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Cập nhật setting của người dùng',
  })
  @Patch('settings')
  async updateSettings(
    @Req() req: Request,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    const userId = (req as any).user?.id;
    return this.userService.updateSettings(userId, updateSettingsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  async getUserProfile(@Param('id') id: number): Promise<UserProfileDto> {
    return await this.userService.getUserProfileById(id);
  }
}
