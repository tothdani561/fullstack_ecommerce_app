import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        
        if(!user) {
            throw new ForbiddenException('No user found in request');
        }

        if(user.admin !== true) {
            throw new ForbiddenException('User is not an admin');
        }

        return true;
    }
}