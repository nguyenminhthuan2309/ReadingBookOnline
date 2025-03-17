import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationRequestDto {
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    limit?: number = 10;

    @IsOptional()
    @IsInt()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    page?: number = 1;
}
