import { Exclude, Expose, Type } from 'class-transformer';
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
