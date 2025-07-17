import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BarionService {
  private readonly BARION_API_URL: string;
  private readonly BARION_POS_KEY: string;

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
    this.BARION_API_URL = this.configService.get<string>('BARION_API_URL');
    this.BARION_POS_KEY = this.configService.get<string>('BARION_POS_KEY');
  }

  private readonly redirectUrls = {
    redirect: 'https://drotvarazs.hu/shipping-status'
  };

  async startPayment(orderId: number) {
    console.log("START");
    const SHIPPING_COST = 1500;
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      throw new Error('Order not found');
    }
    console.log("ORDER MEGTALÁLVA");

    const payload = {
      POSKey: this.BARION_POS_KEY,
      PaymentType: 'Immediate',
      GuestCheckOut: true,
      FundingSources: ['All'],
      Locale: 'hu-HU',
      Currency: 'HUF',
      Transactions: [
        {
          POSTransactionId: order.id.toString(),
          Payee: 'tothdani561@gmail.com',
          Total: order.totalAmount,
          Items: order.items.map((item) => ({
            Name: item.product.name,
            Description: item.product.description || 'No description',
            Quantity: 1,
            Unit: 'darab',
            UnitPrice: item.price,
            ItemTotal: item.price,
          })),
        },
      ],
      RedirectUrl: this.redirectUrls.redirect,
      CallbackUrl: `${this.redirectUrls.redirect}/callback`,
      PayerHint: order.userEmail,
    };

    payload.Transactions[0].Items.push({
        Name: "Szállítási díj",
        Description: "Házhozszállítás",
        Quantity: 1,
        Unit: "darab",
        UnitPrice: SHIPPING_COST,
        ItemTotal: SHIPPING_COST,
    });

    console.log("PAYLOAD létrehozva");

    try {
      const response = await axios.post(`${this.BARION_API_URL}/payment/start`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Barion payment:', error.response?.data || error.message);
      throw new Error('Payment creation failed');
    }
  }

  async getPaymentState(paymentId: string) {
    try {
        const response = await axios.get(`${this.BARION_API_URL}/Payment/GetPaymentState`, {
            params: {
                POSKey: this.BARION_POS_KEY,
                paymentId,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching payment state:', error.response?.data || error.message);
        throw new Error('Payment state fetch failed');
    }
  }
}