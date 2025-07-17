import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Admin } from 'src/common/decorators/admin.decorator';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Admin()
  async createCoupon(@Body() dto: { code: string; discount: number; type: string }) {
    return this.couponService.createCoupon(dto.code, dto.discount, dto.type);
  }
}