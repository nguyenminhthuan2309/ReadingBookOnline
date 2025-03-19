import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'iiiimanhiiii007@gmail.com', type: String })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', type: String })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Nguyễn Minh Thuận', type: String })
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://google.com.vn', type: String })
  @IsString({ message: 'Ảnh đại diện phỉa là chuỗi' })
  @IsOptional()
  avatar?: string;

  @IsNumber()
  roleId: number = 3;

  @IsNumber()
  statusId: number = 2;
}
