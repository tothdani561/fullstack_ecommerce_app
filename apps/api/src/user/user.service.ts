import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            }
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            createdAt: user.createdAt,
            updatedAt: user.updateAt
        };
    }
}