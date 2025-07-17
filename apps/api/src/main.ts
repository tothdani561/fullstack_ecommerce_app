import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication } from "@nestjs/platform-express"
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Statikus fájlok kiszolgálása a serve-static csomaggal
  app.use('/api/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.setGlobalPrefix('api');
  app.set('trust proxy', 1);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Ez szükséges a @Transform működéséhez
      whitelist: true, // Nem várt mezők eltávolítása
      forbidNonWhitelisted: true, // Hiba dobása, ha nem várt mező érkezik
    }),
  );

  app.enableCors({
    origin: ['http://localhost:5173', 'www.drotvarazs.hu', 'drotvarazs.hu', 'http://drotvarazs.hu', 'https://drotvarazs.hu', 'https://www.drotvarazs.hu'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3333, '0.0.0.0');
}
bootstrap();
