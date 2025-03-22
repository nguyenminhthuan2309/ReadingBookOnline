import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
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
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Minh Thuận', type: String })
  @IsOptional()
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  name?: string;

  @ApiPropertyOptional({ example: 'https://google.com.vn', type: String })
  @IsOptional()
  @IsString({ message: 'Ảnh đại diện phỉa là chuỗi' })
  avatar?: string;

  @ApiPropertyOptional({ example: '1990-01-01', type: String })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Ngày sinh không hợp lệ, định dạng ISO (YYYY-MM-DD)' },
  )
  birth_date?: string;

  @IsNumber()
  roleId: number = 3;

  @IsNumber()
  statusId: number = 1;
}

export class CreateManagerDto {
  @ApiProperty({
    example: 'manager@example.com',
    description: 'Email của Manager',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Manager Name', description: 'Tên của Manager' })
  @IsNotEmpty()
  name: string;
}
