import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name'] as const),
) {}
