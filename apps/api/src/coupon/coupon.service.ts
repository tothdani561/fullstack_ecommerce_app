import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { addDays, endOfDay } from 'date-fns';

@Injectable()
export class CouponService {
    constructor(private readonly prisma: PrismaService) {}

    async createCoupon(code: string, discount: number, type: string) {
        if (!['GENERAL', 'SINGLE_USE'].includes(type)) {
            throw new Error('Invalid coupon type. Use "GENERAL" or "SINGLE_USE".');
        }

        if (discount <= 0 || discount > 100) {
            throw new BadRequestException('Discount must be between 1 and 100.');
        }
    
        const expiration = endOfDay(addDays(new Date(), 30));
    
        return this.prisma.coupon.create({
            data: {
                code,
                discount,
                type,
                expiration,
            },
        });
    }
}