import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name', 'avatar'] as const),
) {
  @ApiPropertyOptional({
    description: 'Tên mới của người dùng',
    example: 'Mạnh1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Anh đại diện của người dùng',
    example: 'Mạnh1234',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Ngày sinh của người dùng',
    example: '2000-02-14',
    required: false,
  })
  @IsString()
  @IsOptional()
  birthDate?: Date;
}

export class UpdateUserStatusDto {
  @ApiProperty({ example: 2, description: 'ID của trạng thái mới' })
  @IsNotEmpty()
  @IsNumber()
  statusId: number;
}
