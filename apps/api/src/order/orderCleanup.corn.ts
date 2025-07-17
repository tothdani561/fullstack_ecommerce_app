import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderCleanupService } from './orderCleanup.service';

@Injectable()
export class OrderCleanupCron {
    constructor(private readonly orderCleanupService: OrderCleanupService) {}

    @Cron('*/60 * * * *')
    async handleCleanup() {
        console.log("🚀 Cron job futtatása: PENDING rendelések törlése...");
        await this.orderCleanupService.cancelOldPendingOrders();
    }
}