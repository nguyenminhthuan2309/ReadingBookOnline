import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Adventure' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'A thrilling adventure of ...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  @IsNotEmpty()
  @IsString()
  cover: string;

  @ApiProperty({ example: 12, description: 'Độ tuổi phù hợp' })
  @IsNotEmpty()
  @IsInt()
  ageRating: number;

  @ApiProperty({ example: 1, description: 'ID của Access Status' })
  @IsNotEmpty()
  @IsInt()
  accessStatusId: number;

  @ApiProperty({ example: 2, description: 'ID của Progress Status' })
  @IsNotEmpty()
  @IsInt()
  progressStatusId: number;

  @ApiProperty({
    example: [1, 3, 5],
    description: 'Danh sách các ID của thể loại',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(
    ({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]),
    { toClassOnly: true },
  )
  categoryIds: number[];
}
