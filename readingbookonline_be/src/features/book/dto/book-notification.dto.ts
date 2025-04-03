import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class BookNotificationResponseDto {
  @IsNotEmpty()
  @Expose()
  id: number;

  @IsNotEmpty()
  @Expose()
  title: string;

  @IsNotEmpty()
  @Expose()
  message: string;

  @IsNotEmpty()
  @Expose()
  isRead: boolean;

  @IsNotEmpty()
  @Expose()
  createdAt: Date;
}
