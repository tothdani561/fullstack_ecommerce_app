import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategy/google.strategy';
import { MailService } from './services/mail.service';

@Module({
  imports: [JwtModule.register({}), ConfigModule.forFeature(googleOauthConfig)],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, GoogleStrategy, MailService, ConfigService]
})
export class AuthModule {}
