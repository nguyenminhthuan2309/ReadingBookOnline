import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({
    example: 'BOT_00001',
    description: 'Transaction ID',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 10000,
    description: 'Số tiền người dùng đã nạp (VND)',
  })
  @Expose()
  amount: number;

  @ApiProperty({
    example: 10000,
    description: 'Số điểm tương ứng với số tiền đã nạp',
  })
  @Expose()
  points: number;

  @ApiProperty({
    example: 'SUCCESS',
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    description: 'Trạng thái giao dịch',
  })
  @Expose()
  status: string;

  @ApiProperty({
    example: '2025-04-04T12:00:00.000Z',
    description: 'Thời gian tạo giao dịch',
    type: String,
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-04T12:05:00.000Z',
    description: 'Thời gian cập nhật giao dịch gần nhất',
    type: String,
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
