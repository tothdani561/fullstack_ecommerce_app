import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleOauthConfig from "../config/google-oauth.config";
import { ConfigType } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(googleOauthConfig.KEY) private googleConfiguration: ConfigType<typeof googleOauthConfig>, private authService: AuthService) {
        super({
            clientID: googleConfiguration.clientId,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL: googleConfiguration.callbackUrl,
            scope:["email", "profile"],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        //console.log({profile})
        const familyName = profile.name?.familyName || "";
        const givenName = profile.name?.givenName || "";

        const user = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            password: "",
            firstname: givenName,
            lastname: familyName,
        })

        done(null, user);
    }
}