import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './dto/newsletter.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class NewsletterService {
    constructor(private prisma: PrismaService, private readonly configService: ConfigService) {}

    async subscribe(email: string) {
        const existingSubscriber = await this.prisma.subscriber.findUnique({
            where: { email },
        });
    
        if (existingSubscriber) {
            throw new BadRequestException('Email already subscribed');
        }
    
        return this.prisma.subscriber.create({
            data: {
                email
            },
        });
    }

    async unsubscribe(email: string) {
        return this.prisma.subscriber.update({
            where: { email },
            data: { isActive: false },
        });
    }

    async getAllSubscribers() {
        return await this.prisma.subscriber.findMany({
            select: { email: true },
            where: { isActive: true },
        });
    }
}
