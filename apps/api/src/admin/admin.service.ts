import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    async getTotalProducts(): Promise<number> {
        return await this.prisma.product.count();
    }

    async getTotalOrders() {
        return await this.prisma.order.count();
    }

    async getTotalUsers() {
        return await this.prisma.user.count();
    }

    async getTotalOrdersThisMonth(): Promise<number> {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

        return await this.prisma.order.count({
            where: {
                status: "COMPLETED",
                createdAt: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            }
        });
    }

    async getSalesData() {
        const currentYear = new Date().getFullYear();
    
        const monthNames = ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szep.", "okt.", "nov.", "dec."];

        const salesData = monthNames.map((month, i) => ({
            month,
            UNIQUE_FLOWER_ARRANGEMENTS: 0,
            DRY_PLANT_MOSS_ART: 0,
            UNIQUE_WIRE_JEWELRY: 0
        }));
    
        const orders = await this.prisma.orderItem.findMany({
            where: {
                order: {
                    status: "COMPLETED",
                    createdAt: {
                        gte: new Date(Date.UTC(currentYear, 0, 1)),
                        lte: new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59, 999)),
                    }
                }
            },
            select: {
                order: {
                    select: {
                        createdAt: true
                    }
                },
                product: {
                    select: {
                        category: true
                    }
                }
            }
        });
    
        for (const orderItem of orders) {
            const orderMonth = new Date(orderItem.order.createdAt).getUTCMonth();
            salesData[orderMonth][orderItem.product.category] += 1;
        }
    
        return { salesData };
    }

    async getRecentOrders(): Promise<any[]> {
        return this.prisma.order.findMany({
            orderBy: {
                createdAt: "desc",  // Legfrissebb rendelések először
            },
            take: 100,
            select: {
                id: true,
                userEmail: true,
                totalAmount: true,
                status: true,
                createdAt: true,
            },
        });
    }

    async searchByName(name: string) {
        return this.prisma.product.findMany({
            where: { name: { contains: name } },
            select: { id: true, name: true }
        });
    }

    async getProductList() {
        return this.prisma.product.findMany({
            select: { id: true, name: true }
        });
    }
}