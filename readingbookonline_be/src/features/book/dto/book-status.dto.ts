import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookStatusDto {
  @ApiProperty({
    description: 'ID của trạng thái truy cập (access status) cho sách',
    example: 1,
  })
  @IsNumber()
  accessStatusId: number;

  @ApiProperty({
    description: 'ID của trạng thái tiến trình (progress status) cho sách',
    example: 2,
  })
  @IsNumber()
  progressStatusId: number;
}
