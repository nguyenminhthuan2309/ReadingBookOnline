import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name'] as const),
) {
  @ApiProperty({
    description: 'Tên mới của người dùng',
    example: 'Mạnh1234',
    required: false,
  })
  name?: string;
}
