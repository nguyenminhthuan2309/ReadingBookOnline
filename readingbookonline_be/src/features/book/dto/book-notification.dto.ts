import { Expose, Transform } from 'class-transformer';
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

  @Expose()
  @Transform(({ obj }) => {
    return {
      id: obj.book?.id,
    };
  })
  book: { id: number };

  @IsNotEmpty()
  @Expose()
  createdAt: Date;
}
