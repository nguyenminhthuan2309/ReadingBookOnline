import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/get-user-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Thông tin đăng nhập sai' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto | Boolean> {
    return this.userService.login(loginDto);
  }

  @Post("/register")
  @ApiResponse({ status: 200, description: 'Tạo tài khoản thành công' })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto | Boolean> {
    return await this.userService.register(createUserDto);
  }
}
