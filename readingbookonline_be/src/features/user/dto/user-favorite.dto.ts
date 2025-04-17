import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class AddFavoriteCategoriesDto {
  @ApiProperty({
    type: [Number],
    description: 'Danh sách ID thể loại sách người dùng yêu thích',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  categoryIds: number[];
}
