import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBookChapterDto {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsNumber()
    chapter: string;

    @Expose()
    @IsOptional()
    @IsString()
    cover?: string;

    @Expose()
    @IsBoolean()
    isLocked: boolean;

    @Expose()
    @IsNumber()
    price: number;

    @Expose()
    createdAt: Date;
}
