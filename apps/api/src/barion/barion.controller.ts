import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { BarionService } from './barion.service';
import { Public } from 'src/common/decorators';

@Controller('payment')
export class BarionController {
  constructor(private readonly barionService: BarionService) {}

  @Get('start')
  @Public()
  async startPayment(@Query('orderId') orderId: string) {
    console.log(orderId);
    const response = await this.barionService.startPayment(Number(orderId));
    return {
      message: 'Payment initialized successfully',
      data: response,
    };
  }

  @Get('status')
  @Public()
  async getPaymentState(@Query('paymentId') paymentId: string) {
    console.log("Received paymentId:", paymentId);
    if (!paymentId) {
        throw new BadRequestException('PaymentId is required');
    }

    const response = await this.barionService.getPaymentState(paymentId);
    return {
        message: 'Payment state fetched successfully',
        data: response,
    };
  }
}
