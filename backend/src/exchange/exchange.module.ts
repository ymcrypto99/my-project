import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { BinanceService } from './binance.service';
import { KrakenService } from './kraken.service';
import { BitforexService } from './bitforex.service';
import { CoinbaseService } from './coinbase.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    ExchangeService,
    BinanceService,
    KrakenService,
    BitforexService,
    CoinbaseService,
  ],
  exports: [ExchangeService],
})
export class ExchangeModule {}
