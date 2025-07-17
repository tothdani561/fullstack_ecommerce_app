import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { MailService } from './services/mail.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private mailService: MailService) {}

    async signupLocal(dto: AuthDto): Promise<Tokens> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
    
        if (existingUser) {
            throw new BadRequestException("A megadott email címmel már regisztráltak!");
        }
        
        const hash = await this.hashData(dto.password);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
                firstname: dto.firstname,
                lastname: dto.lastname,
            }
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signinLocal(dto: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if (!user) {
            throw new ForbiddenException('Access Denied');
        }

        const passwordMatches = await bcrypt.compare(dto.password, user.hash);

        if (!passwordMatches) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null,
                },
            },
            data: {
                hashedRt: null,
            }
        });
    }
    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (!user) throw new ForbiddenException('Access Denied');

        const rtMatches = await bcrypt.compare(rt, user.hashedRt);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refreshToken);
        return tokens;
    }
    
    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, email: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { admin: true },
        });
    
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    admin: user.admin,
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60 * 30,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: 60 * 240,
                },
            ),
        ]);
        return { accessToken: at, refreshToken: rt };
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRt: hash,
            },
        });
    }

    //GOOGLE LOGIN
    async signinWithGoogle(email: string): Promise<Tokens> {
        let user = await this.prisma.user.findUnique({
            where: { email },
        });
    
        const defaultPassword = nanoid(32);
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    hash: hashedPassword,
                    hashedRt: null,
                    admin: false,
                    carts: {},
                },
            });
        }
    
        const tokens = await this.getTokens(user.id, user.email);
    
        await this.updateRtHash(user.id, tokens.refreshToken);
    
        return tokens;
    }

    async validateGoogleUser(googleUser: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: googleUser.email,
            },
        });

        if (user) {
            return user;
        }

        const defaultPassword = nanoid(32);
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        return await this.prisma.user.create({
            data: {
                email: googleUser.email,
                hash: hashedPassword,
                firstname: googleUser.firstname,
                lastname: googleUser.lastname,
                hashedRt: null,
                admin: false,
                carts: {},
            },
        });
    }

    //CHANGE PASSWORD
    async changePassword(newPassword: string, oldPassword: string, email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
    
        if (!user) {
            throw new Error('User not found');
        }
    
        const passwordMatches = await bcrypt.compare(oldPassword, user.hash);
        if (!passwordMatches) {
            throw new Error('Old password is incorrect');
        }
    
        const newHashedPassword = await this.hashData(newPassword);
    
        await this.prisma.user.update({
            where: { email },
            data: { hash: newHashedPassword },
        });
    
        console.log('Password updated successfully');
        return { message: 'Password updated successfully' };
    }

    //FORGOT PASSWORD
    //HA FELHASZNÁLJUK, AKKOR ÚJRA NE LEGYEN ÉRVÉNYES
    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if(user) {
            const expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 1);

            const resetToken = nanoid(64);
            await this.prisma.resetToken.create({
                data: {
                    userId: user.id,
                    token: resetToken,
                    expiryDate: expireDate,
                }
            })
            
            this.mailService.sendPasswordResetEmail(email, resetToken)
        }

        return {"message": "If this user exists, an email will be sent to reset the password"};
    }

    //RESET PASSWORD
    async resetPassword(newPassword: string, resetToken: string) {
        const token = await this.prisma.resetToken.findFirst({
            where: {
                token: resetToken,
                expiryDate: { gte: new Date() },
            }
        });
        console.log(token);

        if(!token) {
            throw new Error('Invalid or expired token');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: token.userId }
        });
        
        if(!user) {
            throw new Error('User not found');
        }

        user.hash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { hash: user.hash }
        });
    }
}
