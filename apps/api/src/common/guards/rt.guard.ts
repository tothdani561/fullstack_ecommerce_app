import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RtGuard extends AuthGuard("jwt-refresh") {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return super.canActivate(context);
    }
}