import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductService } from 'src/product/product.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CartService, ProductService, PrismaService],
  controllers: [CartController]
})
export class CartModule {}
