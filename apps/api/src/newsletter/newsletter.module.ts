import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { ConfigService } from '@nestjs/config';
import { NewsletterMailService } from './newsletterMail.service';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService, ConfigService, NewsletterMailService],
})
export class NewsletterModule {}
