import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Public } from 'src/common/decorators';
import { AddCartDto } from './dto/create-cart.dto';
import { deleteCartDto } from './dto/delete-product.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post()
    @Public()
    async addCart(@Body() body: AddCartDto) {
        return this.cartService.addToCart(body.userId, body.productId);
    }

    @Get(':userId')
    async getCart(@Param('userId') userId: string) {
        return this.cartService.getCart(parseInt(userId, 10));
    }

    @Delete(':userId/:productId')
    async removeItem(@Param() params: deleteCartDto) {
        const { userId, productId } = params;
        return this.cartService.removeItem(Number(userId), Number(productId));
    }

    @Delete(':userId')
    async clear(@Param('userId') userId: string) {
        return this.cartService.clearCart(parseInt(userId, 10));
    }
}
