import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

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
}
