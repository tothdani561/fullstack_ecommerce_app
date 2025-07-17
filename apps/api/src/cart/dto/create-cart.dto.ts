import { IsInt, IsPositive } from 'class-validator';

export class AddCartDto {
    @IsInt({ message: 'The userId must be an integer.' })
    @IsPositive({ message: 'The userId must be a positive number.' })
    userId: number;

    @IsInt({ message: 'The productId must be an integer.' })
    @IsPositive({ message: 'The productId must be a positive number.' })
    productId: number;
}