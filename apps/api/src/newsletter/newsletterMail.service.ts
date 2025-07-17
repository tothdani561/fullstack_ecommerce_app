import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class NewsletterMailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: this.configService.get<boolean>('MAIL_SECURE'),
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            }
        });
    }

    async sendNewsletterEmails(recipients: string[], subject: string, htmlContent: string) {
        const mailOptions = {
            from: {
                name: this.configService.get<string>('MAIL_FROM_NAME'),
                address: this.configService.get<string>('MAIL_FROM_ADDRESS'),
            },
            to: subject,
            bcc: recipients,
            subject: subject,
            html: htmlContent,
        };
    
        try {
            const result = await this.transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            console.error("Hiba történt az e-mail küldés során:", error);
            throw new Error("Nem sikerült elküldeni a hírlevelet.");
        }
    }    
}