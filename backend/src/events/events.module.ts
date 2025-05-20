import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { LoggerModule } from '../logger/logger.module';
import { ExchangeModule } from '../exchange/exchange.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LoggerModule, ExchangeModule, AuthModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
