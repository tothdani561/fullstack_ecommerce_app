import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Req() req, @Body() body: { isBusiness?: boolean; paymentMethod?: string; couponCode?: string}) {
    const userId = req.user.id;
    const isBusiness = body.isBusiness ?? false;
    const paymentMethod = body.paymentMethod ?? 'cash';
    const couponCode = body.couponCode ?? null;

    return this.orderService.createOrder(userId, isBusiness, paymentMethod, couponCode);
  }

  @Get(':orderId')
  async getOrder(@Param('orderId', ParseIntPipe) orderId: number, @Req() req) {
    const userEmail = req.user.email;
    return this.orderService.getOrder(orderId, userEmail);
  }

  @Post(':orderId/shipping')
  async createShippingAddress(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() shippingData: any
  ) {
    return this.orderService.createShippingAddress(orderId, shippingData);
  }

  @Post(':orderId/billing')
  async createBillingAddress(@Param('orderId', ParseIntPipe) orderId: number, @Body() billingData: any) {
    console.log("Kapott billingData:", billingData);
    return this.orderService.createBillingAddress(orderId, billingData);
  }

  @Post("pending")
  async getPendingOrder(@Req() req) {
    const userId = req.user?.id;
    return this.orderService.getPendingOrder(userId);
  }

  @Put('complete/:orderId')
  async completeOrder(@Param('orderId', ParseIntPipe) orderId: number, @Req() req) {
      const userEmail = req.user.email;
      return this.orderService.completeOrder(orderId, userEmail);
  }

  @Put('update-business/:orderId')
  async updateOrderBusiness(
      @Param('orderId', ParseIntPipe) orderId: number,
      @Body('isBusiness') isBusiness: boolean,
      @Req() req
  ) {
      const userEmail = req.user.email;
      return this.orderService.updateOrderBusiness(orderId, userEmail, isBusiness);
  }

  @Put('update-payment/:orderId')
  async updateOrderPaymentMethod(
      @Param('orderId', ParseIntPipe) orderId: number,
      @Body('paymentMethod') paymentMethod: string,
      @Req() req
  ) {
      const userEmail = req.user.email;
      return this.orderService.updateOrderPaymentMethod(orderId, userEmail, paymentMethod);
  }

  @Post('completed')
  async getCompletedOrders(@Req() req) {
    const userEmail = req.user.email;
    return this.orderService.findCompletedOrders(userEmail);
  }
}