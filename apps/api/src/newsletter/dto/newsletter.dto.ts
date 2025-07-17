import { IsEmail, IsNotEmpty } from "class-validator";
import { Address } from "nodemailer/lib/mailer"

export class SubscribeDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email megadása kötelező!' })
    email: string;
}

export type sendEmailDto = {
    from?: Address;
    recipients: Address[];
    subject: string;
    html: string;
    text?: string;
    placeholderReplacements?: Record<string, string>;
}