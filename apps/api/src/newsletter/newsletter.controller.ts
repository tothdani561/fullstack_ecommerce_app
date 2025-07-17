import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './dto/newsletter.dto';
import { Public } from 'src/common/decorators';
import { NewsletterMailService } from './newsletterMail.service';
import { Admin } from 'src/common/decorators/admin.decorator';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService, private readonly newsletterMailService: NewsletterMailService) {}

  @Post('subscribe')
  @Public()
  async subscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.subscribe(dto.email);
  }

  @Post('unsubscribe')
  @Public()
  async unsubscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.unsubscribe(dto.email);
  }

  @Post("send")
  @Admin()
  async sendNewsletter(@Body() body: { html: string; subject: string }) {
      const { html, subject } = body;

      if (!html || !subject) {
          throw new Error("Hiányzik az e-mail tartalma vagy a tárgy (subject).");
      }

      const subscribers = await this.newsletterService.getAllSubscribers();
      if (!subscribers.length) {
          throw new Error("Nincsenek feliratkozott felhasználók.");
      }

      const emails = subscribers.map((subscriber) => subscriber.email);
      
      const result = await this.newsletterMailService.sendNewsletterEmails(emails, subject, html);
      return { message: "Hírlevél sikeresen elküldve!", result };
  }
}