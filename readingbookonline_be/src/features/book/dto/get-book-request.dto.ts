import { PaginationRequestDto } from "@shared/dto/common.dto/pagination-request.dto";
import { PaginationResponseDto } from "@shared/dto/common.dto/pagination-response.dto";
import { GetBookDto } from "./get-book.dto";
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class GetBookRequestDto extends PaginationRequestDto {
    @ApiPropertyOptional({ type: Number })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    userId?: number;

    @ApiPropertyOptional({ type: Number, description: 'Lọc sách theo trạng thái (status_id)' })
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    statusId?: number;

    @ApiPropertyOptional({ type: [Number], description: 'Lọc sách theo danh mục (categoryId)' })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]), { toClassOnly: true })
    categoryId?: number[];
}

export class GetBookResponseDto extends PaginationResponseDto<GetBookDto> { }