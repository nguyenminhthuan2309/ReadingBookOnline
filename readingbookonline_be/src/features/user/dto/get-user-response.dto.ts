import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  email: string;

  @Exclude()
  @IsString()
  password: string;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  avatar?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  statusId?: number;

  @Expose()
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Exclude()
  @IsOptional()
  @IsDate()
  updateAt?: Date;
}
