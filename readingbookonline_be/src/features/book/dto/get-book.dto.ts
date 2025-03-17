import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GetBookChapterDto } from './get-book-chapter.dto';
import { GetBookStatusDto } from './get-book-status.dto';
import { GetBookCategoryDto } from './get-book-category.dto';

class AuthorDto {
    @Expose()
    id: number;

    @Expose()
    name: string;
}

class BookReview {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @Type(() => AuthorDto)
    user: AuthorDto;

    @Expose()
    @IsNumber()
    rating: number;

    @Expose()
    @IsOptional()
    @IsString()
    comment?: string;

    @Expose()
    createdAt: Date;
}

export class GetBookDto {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Expose()
    @IsString()
    @IsOptional()
    description?: string;

    @Expose()
    @IsString()
    @IsOptional()
    cover?: string;

    @Expose()
    @Type(() => GetBookStatusDto)
    status: GetBookStatusDto;

    @Expose()
    @Type(() => AuthorDto)
    author: AuthorDto;

    @Expose()
    @Transform(({ obj }) =>
        obj.bookCategoryRelations?.map((relation: any) => ({
            id: relation.category?.id,
            name: relation.category?.name,
        })) || []
    )
    @Type(() => GetBookCategoryDto)
    @IsArray()
    categories: GetBookCategoryDto[];

    @Expose()
    @Type(() => GetBookChapterDto)
    @IsOptional()
    chapters?: GetBookChapterDto[];

    @Expose()
    @Type(() => BookReview)
    @IsOptional()
    reviews?: BookReview[];

    @Expose()
    createdAt: Date;
}
