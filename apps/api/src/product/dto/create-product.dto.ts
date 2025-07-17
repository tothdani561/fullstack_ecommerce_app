import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value)) // Stringből szám konvertálás
    price: number;

    @IsBoolean()
    stock: boolean;

    @IsEnum(['UNIQUE_FLOWER_ARRANGEMENTS', 'DRY_PLANT_MOSS_ART', 'UNIQUE_WIRE_JEWELRY'])
    category: 'UNIQUE_FLOWER_ARRANGEMENTS' | 'DRY_PLANT_MOSS_ART' | 'UNIQUE_WIRE_JEWELRY';

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    discountPrice?: number;
}
