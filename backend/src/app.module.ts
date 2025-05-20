import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { ExchangeModule } from './exchange/exchange.module';
import { PlatformConfigModule } from './platform-config/platform-config.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    AuthModule,
    ExchangeModule,
    PlatformConfigModule,
    EventsModule,
  ],
})
export class AppModule {}
