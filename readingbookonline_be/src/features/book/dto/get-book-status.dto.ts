import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetBookStatusDto {
    @Expose()
    @IsNumber()
    id: number;

    @Expose()
    @IsString()
    name: string;
}
