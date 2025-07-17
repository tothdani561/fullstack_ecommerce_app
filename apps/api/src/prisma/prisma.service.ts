import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            datasources: {
                db: { url: 'mysql://dani:dani123@localhost:3306/dani' }
            }
        });
    }
    async onModuleDestroy() {
        await this.$connect();
    }
    async onModuleInit() {
        await this.$disconnect();
    }

    async clearDatabase() {
        await this.cart.deleteMany(); console.log('Cart data has been cleared!');
        await this.product.deleteMany(); console.log('Product data has been cleared!');
    }
}
