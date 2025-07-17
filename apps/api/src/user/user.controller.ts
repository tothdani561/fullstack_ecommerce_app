import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @HttpCode(HttpStatus.OK)
    @Get(':email')
    getUserByEmail(@Param('email') email: string) {
        const user = this.userService.findByEmail(email);
        if (!user) { throw new NotFoundException(`User ${email} not found`); }
        return user;
    }
}