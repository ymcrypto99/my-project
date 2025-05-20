import { Module } from '@nestjs/common';
import { PlatformConfigService } from './platform-config.service';
import { PlatformConfigController } from './platform-config.controller';
import { LoggerModule } from '../logger/logger.module';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [LoggerModule, ExchangeModule],
  controllers: [PlatformConfigController],
  providers: [PlatformConfigService],
  exports: [PlatformConfigService],
})
export class PlatformConfigModule {}
