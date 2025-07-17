import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { AdminModule } from './admin/admin.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ConfigModule } from '@nestjs/config';
import { BarionModule } from './barion/barion.module';
import { OrderModule } from './order/order.module';
import { CouponModule } from './coupon/coupon.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot() , ScheduleModule.forRoot(), AuthModule, PrismaModule, UserModule, ProductModule, CartModule, AdminModule, NewsletterModule, BarionModule, OrderModule, CouponModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    },
  ],
})
export class AppModule {}
