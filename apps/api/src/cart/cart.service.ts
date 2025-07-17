import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
    constructor(private readonly prismaService: PrismaService, private readonly productService: ProductService) {}

    async addToCart(userId: number, productId: number) {
        try {
            return this.prismaService.cart.upsert({
                where: {
                    userId_productId: { userId, productId },
                },
                update: {},
                create: {
                    userId,
                    productId,
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Invalid userId or productId');
            }
            throw error;
        }
    }

    async getCart(userId: number) {
        const cartItems = await this.prismaService.cart.findMany({
            where: { userId },
        });
    
        const products = await Promise.all(
            cartItems.map(async (item) => {
                const product = await this.productService.findOne(item.productId);
                return {
                    ...product,
                    addedAt: item.addedAt,
                };
            }),
        );
    
        return products;
    }

    async removeItem(userId: number, productId: number) {
        return this.prismaService.cart.delete({
            where: {
                userId_productId: { userId, productId },
            },
        });
    }

    async clearCart(userId: number) {
        return this.prismaService.cart.deleteMany({
            where: { userId },
        });
    }
}
