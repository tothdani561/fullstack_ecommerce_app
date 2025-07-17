import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prismaService.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    const soldProductIds = await this.prismaService.orderItem.findMany({
        where: {
            order: {
                status: { in: ["COMPLETED", "PENDING"] },
            },
        },
        select: {
            productId: true,
        },
    });

    const soldProductIdList = soldProductIds.map(item => item.productId);

    return this.prismaService.product.findMany({
        where: {
            id: { notIn: soldProductIdList },
            stock: true,
        },
        include: { images: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: { images: true },
    });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.prismaService.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async toggleStock(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: { stock: !product.stock },
    });

    return updatedProduct;
  }

  async remove(id: number) {
    try {
      return await this.prismaService.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  async addImagesToProduct(productId: number, imageUrls: string[]) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Képek mentése az adatbázisban
    const images = imageUrls.map(url => ({ url, productId }));
    await this.prismaService.image.createMany({ data: images });

    return { message: 'Images uploaded successfully!', urls: imageUrls };
  }

  async getLatestProducts() {
    const soldProductIds = await this.prismaService.orderItem.findMany({
        where: {
            order: {
                status: { in: ["COMPLETED", "PENDING"] },
            },
        },
        select: {
            productId: true,
        },
    });

    const soldProductIdList = soldProductIds.map(item => item.productId);

    return this.prismaService.product.findMany({
        where: {
            id: { notIn: soldProductIdList },
            stock: true,
        },
        orderBy: { createdAt: "desc" },
        take: 16,
        include: { images: true },
    });
  }
}
