import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

class RoleDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;
}

class StatusDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;
}

export class UserResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  email: string;

  @Exclude()
  @IsString()
  password?: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  avatar?: string;

  @Expose()
  @IsOptional()
  @IsString()
  birthDate?: Date;

  @Expose()
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto;

  @Expose()
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  @Expose()
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Exclude()
  @IsOptional()
  @IsDate()
  updateAt?: Date;
}

export class GetUsersFilterDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({ example: 'admin@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID của trạng thái người dùng',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID của vai trò' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  role?: number;
}
