import { Module } from '@nestjs/common';
import { BarionService } from './barion.service';
import { BarionController } from './barion.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [BarionController],
  providers: [BarionService, ConfigService],
})
export class BarionModule {}
