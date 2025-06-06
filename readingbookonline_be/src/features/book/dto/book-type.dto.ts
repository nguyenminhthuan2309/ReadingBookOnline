import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetBookTypeDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
