import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderCleanupService } from './orderCleanup.service';
import { OrderCleanupCron } from './orderCleanup.corn';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderCleanupService, OrderCleanupCron],
})
export class OrderModule {}
