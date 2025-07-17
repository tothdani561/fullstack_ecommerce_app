import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) {}

    async createOrder(userId: number, isBusiness: boolean, paymentMethod: string, couponCode?: string) {
        const SHIPPING_COST = 1500;
    
        const cartItems = await this.prisma.cart.findMany({
            where: { userId },
            include: { product: true },
        });
    
        if (!cartItems.length) {
            throw new Error("Cart is empty");
        }
    
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
    
        if (!user) {
            throw new Error("User not found");
        }
    
        const soldProducts: string[] = [];
        const pendingProducts: string[] = [];
    
        for (const item of cartItems) {
            const existingOrderItem = await this.prisma.orderItem.findFirst({
                where: { productId: item.productId },
                include: { order: true },
            });
    
            if (existingOrderItem && existingOrderItem.order.status === "COMPLETED") {
                soldProducts.push(item.product.name);
            } else if (existingOrderItem && existingOrderItem.order.status === "PENDING") {
                pendingProducts.push(item.product.name);
            }
        }
    
        if (soldProducts.length > 0 || pendingProducts.length > 0) {
            throw new Error(
                JSON.stringify({
                    message: "Egyes termékek már nem elérhetők.",
                    soldProducts,
                    pendingProducts,
                })
            );
        }
    
        let productTotal = cartItems.reduce(
            (sum, item) => sum + (item.product.discountPrice ?? item.product.price),
            0
        );
    
        let discountAmount = 0;
        let appliedCoupon = null;
    
        if (couponCode) {
            console.log("Kapott kuponkód:", couponCode);
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: couponCode },
            });
    
            console.log("Kupon adat:", coupon);
    
            if (!coupon) {
                throw new BadRequestException("Invalid coupon code.");
            }
    
            const now = new Date();
            if (coupon.expiration && coupon.expiration < now) {
                throw new BadRequestException("Coupon has expired.");
            }
    
            if (coupon.type === "SINGLE_USE") {
                const usedInCompletedOrder = await this.prisma.order.findFirst({
                    where: {
                        couponId: coupon.id,
                        status: "COMPLETED",
                    },
                });
    
                if (usedInCompletedOrder) {
                    throw new BadRequestException("This coupon has already been used.");
                }
    
                const usedInPendingOrder = await this.prisma.order.findFirst({
                    where: {
                        couponId: coupon.id,
                        status: "PENDING",
                    },
                });
    
                if (usedInPendingOrder) {
                    throw new BadRequestException("This coupon is currently being used in another pending order.");
                }
            }
    
            if (coupon.type === "GENERAL") {
                const usedByUser = await this.prisma.order.findFirst({
                    where: {
                        userEmail: user.email,
                        couponId: coupon.id,
                        status: { in: ["PENDING", "COMPLETED"] },
                    },
                });
    
                if (usedByUser) {
                    throw new BadRequestException("You have already used this coupon.");
                }
    
                const failedOrder = await this.prisma.order.findFirst({
                    where: {
                        userEmail: user.email,
                        couponId: coupon.id,
                        status: "FAILED",
                    },
                });
    
                if (!failedOrder) {
                    await this.prisma.couponUsage.create({
                        data: {
                            userId: userId,
                            couponId: coupon.id,
                        },
                    });
    
                    console.log("Kupon mentve a CouponUsage táblába");
                }
            }
    
            // Javított kedvezmény számítás: most már a teljes összegből von le X%-ot
            const totalBeforeDiscount = productTotal + SHIPPING_COST;
            discountAmount = Math.floor((totalBeforeDiscount * coupon.discount) / 100);
            
            appliedCoupon = coupon;
        }
    
        const totalAmount = productTotal + SHIPPING_COST - discountAmount;
    
        const existingOrder = await this.prisma.order.findFirst({
            where: {
                userEmail: user.email,
                status: "PENDING",
            },
        });
    
        if (existingOrder) {
            await this.prisma.shippingAddress.deleteMany({
                where: { orderId: existingOrder.id },
            });
    
            await this.prisma.billingAddress.deleteMany({
                where: { orderId: existingOrder.id },
            });
    
            const updatedOrder = await this.prisma.order.update({
                where: { id: existingOrder.id },
                data: {
                    totalAmount,
                    isBusiness,
                    paymentMethod,
                    updatedAt: new Date(),
                    couponId: appliedCoupon ? appliedCoupon.id : null,
                    items: {
                        deleteMany: {},
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            price: item.product.discountPrice ?? item.product.price,
                        })),
                    },
                },
            });
    
            await this.prisma.cart.deleteMany({ where: { userId } });
    
            return updatedOrder;
        } else {
            const newOrder = await this.prisma.order.create({
                data: {
                    userEmail: user.email,
                    totalAmount,
                    isBusiness,
                    paymentMethod,
                    couponId: appliedCoupon ? appliedCoupon.id : null,
                    status: "PENDING",
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            price: item.product.discountPrice ?? item.product.price,
                        })),
                    },
                },
            });
    
            await this.prisma.cart.deleteMany({ where: { userId } });
    
            return newOrder;
        }
    }
       

    async getOrder(orderId: number, userEmail: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId, userEmail },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new Error("Rendelés nem található vagy nincs jogosultságod hozzá!");
        }

        return order;
    }

    async createShippingAddress(orderId: number, shippingData: any) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new Error(`Order with ID ${orderId} not found`);
        }

        return this.prisma.shippingAddress.create({
            data: {
                orderId,
                firstName: shippingData.firstName,
                lastName: shippingData.lastName,
                phone: shippingData.phone,
                email: shippingData.email,
                zipCode: shippingData.zipCode,
                city: shippingData.city,
                street: shippingData.street,
                streetType: shippingData.streetType,
                houseNumber: shippingData.houseNumber,
                extra: shippingData.extra,
            },
        });
    }

    async createBillingAddress(orderId: number, billingData: any) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new Error(`Order with ID ${orderId} not found`);
        }

        return this.prisma.billingAddress.create({
            data: {
                orderId,
                firstName: billingData.firstName,
                lastName: billingData.lastName,
                phone: billingData.phone,
                zipCode: billingData.zipCode,
                city: billingData.city,
                street: billingData.street,
                streetType: billingData.streetType,
                houseNumber: billingData.houseNumber,
                extra: billingData.extra,
                companyName: billingData.companyName || null,
                taxNumber: billingData.taxNumber || null,
            },
        });
    }

    async getPendingOrder(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }
        
        const order = await this.prisma.order.findFirst({
            where: {
                userEmail: user.email,
                status: "PENDING",
            },
        });
    
        if (!order) {
            throw new Error("No pending order found");
        }
    
        return order;
    }

    async completeOrder(orderId: number, userEmail: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userEmail },
        });
    
        if (!order) {
            throw new Error("Order not found or you don't have permission to modify it.");
        }
    
        if (order.status === "COMPLETED") {
            throw new Error("This order has already been completed.");
        }
    
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: "COMPLETED", updatedAt: new Date() },
        });
    
        return updatedOrder;
    }

    async updateOrderBusiness(orderId: number, userEmail: string, isBusiness: boolean) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userEmail },
        });
    
        if (!order) {
            throw new Error("Order not found or you don't have permission to modify it.");
        }
    
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { isBusiness, updatedAt: new Date() },
        });
    
        return updatedOrder;
    }
    
    async updateOrderPaymentMethod(orderId: number, userEmail: string, paymentMethod: string) {
        if (!["cash", "barion"].includes(paymentMethod)) {
            throw new Error("Invalid payment method. Use 'cash' or 'barion'.");
        }
    
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userEmail },
        });
    
        if (!order) {
            throw new Error("Order not found or you don't have permission to modify it.");
        }
    
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { paymentMethod, updatedAt: new Date() },
        });
    
        return updatedOrder;
    }

    async findCompletedOrders(userEmail: string) {
        return await this.prisma.order.findMany({
            where: {
                userEmail: userEmail,
                status: "COMPLETED", // Csak a sikeres rendelések
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: true, // A termékekhez tartozó képek lekérése
                            },
                        },
                    },
                },
                shippingAddress: true,
                billingAddress: true,
                coupon: true,
            },
        });
    }
}