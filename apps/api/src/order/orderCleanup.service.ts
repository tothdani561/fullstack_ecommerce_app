import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderCleanupService {
    constructor(private readonly prisma: PrismaService) {}

    async cancelOldPendingOrders() {
        const EXPIRATION_TIME = 1 * 60 * 1000; // 1 perc (60 másodperc)
        const expirationDate = new Date(Date.now() - EXPIRATION_TIME);
    
        const oldOrders = await this.prisma.order.findMany({
            where: {
                status: "PENDING",
                createdAt: { lt: expirationDate },
            },
        });
    
        if (oldOrders.length === 0) {
            console.log("Nincs lejárt PENDING rendelés.");
            return;
        }
    
        console.log(`Frissítünk ${oldOrders.length} PENDING rendelést FAILED-re...`);
    
        for (const order of oldOrders) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: "FAILED" }, // Állapot módosítása
            });
            console.log(`Állapot frissítve: Order ID ${order.id} -> FAILED`);
        }
    }    
}