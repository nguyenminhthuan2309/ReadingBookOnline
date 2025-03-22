import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { AuthorDto } from './get-author.dto';
import { Expose, Transform } from 'class-transformer';

export class CreateBookChapterCommentDto {
  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Chương này hay quá!',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class UpdateBookChapterCommentDto {
  @ApiProperty({
    description: 'Nội dung mới của bình luận',
    example: 'Cập nhật: chương này siêu hay!',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class BookChapterCommentResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Cập nhật: chương này siêu hay!' })
  @Expose()
  comment: string;

  @ApiProperty({ example: '2025-03-21T17:32:33.692Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: AuthorDto })
  @Expose()
  @Transform(({ obj }) => ({
    id: obj.user.id,
    email: obj.user.email,
    name: obj.user.name,
  }))
  user: AuthorDto;
}
