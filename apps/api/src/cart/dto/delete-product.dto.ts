import { IsInt, IsPositive, IsString } from 'class-validator';

export class deleteCartDto {
    @IsString({ message: 'The userId must be an integer.' })
    userId: number;

    @IsString({ message: 'The productId must be an integer.' })
    productId: number;
}
