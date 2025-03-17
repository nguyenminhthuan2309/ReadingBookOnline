import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', type: String })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '0707757839', type: String })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value.startsWith('+84')) {
        return '0' + value.slice(3);
      } else if (value.startsWith('84')) {
        return '0' + value.slice(2);
      }
      return value;
    }
    return value;
  })
  @Matches(/^\d{10}$/, {
    message: 'Số điện thoại không hợp lệ, sau chuyển đổi phải có 10 chữ số',
  })
  phone: string;

  @ApiProperty({ example: '123456', type: String })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Minh Thuận', type: String })
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  name: string;

  roleId: number = 3;

  statusId: number = 2;
}
