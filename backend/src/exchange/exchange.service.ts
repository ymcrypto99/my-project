import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { BinanceService } from './binance.service';
import { KrakenService } from './kraken.service';
import { BitforexService } from './bitforex.service';
import { CoinbaseService } from './coinbase.service';

export enum ExchangePlatform {
  BINANCE = 'binance',
  KRAKEN = 'kraken',
  BITFOREX = 'bitforex',
  COINBASE = 'coinbase',
}

export interface MarketData {
  symbol: string;
  price: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  change24h: number;
  changePercent24h: number;
  timestamp: number;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][]; // [price, quantity]
  asks: [number, number][]; // [price, quantity]
  timestamp: number;
}

export interface ApiCredentials {
  apiKey: string;
  apiSecret: string;
  isValid?: boolean;
}

@Injectable()
export class ExchangeService {
  private exchangeServices: Map<ExchangePlatform, any> = new Map();
  private apiCredentials: Map<ExchangePlatform, ApiCredentials> = new Map();
  private simulationMode = true;

  constructor(
    private logger: LoggerService,
    private binanceService: BinanceService,
    private krakenService: KrakenService,
    private bitforexService: BitforexService,
    private coinbaseService: CoinbaseService,
  ) {
    this.logger.setContext('ExchangeService');
    
    // Register exchange services
    this.exchangeServices.set(ExchangePlatform.BINANCE, binanceService);
    this.exchangeServices.set(ExchangePlatform.KRAKEN, krakenService);
    this.exchangeServices.set(ExchangePlatform.BITFOREX, bitforexService);
    this.exchangeServices.set(ExchangePlatform.COINBASE, coinbaseService);
    
    this.logger.log('Exchange service initialized');
  }

  setApiCredentials(platform: ExchangePlatform, apiKey: string, apiSecret: string): void {
    this.logger.log(`Setting API credentials for ${platform}`);
    this.apiCredentials.set(platform, { apiKey, apiSecret });
    
    // Initialize the exchange service with the new credentials
    const service = this.exchangeServices.get(platform);
    if (service) {
      service.setCredentials(apiKey, apiSecret);
    }
  }

  async validateApiCredentials(platform: ExchangePlatform): Promise<boolean> {
    this.logger.log(`Validating API credentials for ${platform}`);
    
    const credentials = this.apiCredentials.get(platform);
    if (!credentials) {
      this.logger.warn(`No API credentials found for ${platform}`);
      return false;
    }
    
    const service = this.exchangeServices.get(platform);
    if (!service) {
      this.logger.error(`Exchange service not found for ${platform}`);
      return false;
    }
    
    try {
      const isValid = await service.validateCredentials();
      
      // Update credentials validity
      this.apiCredentials.set(platform, {
        ...credentials,
        isValid,
      });
      
      return isValid;
    } catch (error) {
      this.logger.error(`Error validating credentials for ${platform}`, error);
      return false;
    }
  }

  setSimulationMode(enabled: boolean): void {
    this.logger.log(`Setting simulation mode to ${enabled}`);
    this.simulationMode = enabled;
    
    // Update simulation mode for all exchange services
    for (const service of this.exchangeServices.values()) {
      service.setSimulationMode(enabled);
    }
  }

  isSimulationMode(): boolean {
    return this.simulationMode;
  }

  async getMarketData(platform: ExchangePlatform, symbol: string): Promise<MarketData> {
    this.logger.debug(`Getting market data for ${symbol} from ${platform}`);
    
    const service = this.exchangeServices.get(platform);
    if (!service) {
      this.logger.error(`Exchange service not found for ${platform}`);
      throw new Error(`Exchange service not found for ${platform}`);
    }
    
    try {
      return await service.getMarketData(symbol);
    } catch (error) {
      this.logger.error(`Error getting market data for ${symbol} from ${platform}`, error);
      throw error;
    }
  }

  async getOrderBook(platform: ExchangePlatform, symbol: string): Promise<OrderBook> {
    this.logger.debug(`Getting order book for ${symbol} from ${platform}`);
    
    const service = this.exchangeServices.get(platform);
    if (!service) {
      this.logger.error(`Exchange service not found for ${platform}`);
      throw new Error(`Exchange service not found for ${platform}`);
    }
    
    try {
      return await service.getOrderBook(symbol);
    } catch (error) {
      this.logger.error(`Error getting order book for ${symbol} from ${platform}`, error);
      throw error;
    }
  }

  async placeOrder(
    platform: ExchangePlatform,
    symbol: string,
    side: 'buy' | 'sell',
    type: 'market' | 'limit',
    quantity: number,
    price?: number,
  ): Promise<any> {
    this.logger.log(`Placing ${side} ${type} order for ${quantity} ${symbol} on ${platform}`);
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, order will be simulated');
      return this.simulateOrder(platform, symbol, side, type, quantity, price);
    }
    
    const service = this.exchangeServices.get(platform);
    if (!service) {
      this.logger.error(`Exchange service not found for ${platform}`);
      throw new Error(`Exchange service not found for ${platform}`);
    }
    
    try {
      return await service.placeOrder(symbol, side, type, quantity, price);
    } catch (error) {
      this.logger.error(`Error placing order on ${platform}`, error);
      throw error;
    }
  }

  private simulateOrder(
    platform: ExchangePlatform,
    symbol: string,
    side: 'buy' | 'sell',
    type: 'market' | 'limit',
    quantity: number,
    price?: number,
  ): any {
    // Generate a simulated order response
    const orderId = Math.floor(Math.random() * 1000000).toString();
    const timestamp = Date.now();
    
    return {
      id: orderId,
      symbol,
      side,
      type,
      quantity,
      price: price || 0,
      status: 'FILLED',
      timestamp,
      platform,
      simulated: true,
    };
  }

  async getBalance(platform: ExchangePlatform): Promise<any> {
    this.logger.log(`Getting balance from ${platform}`);
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, balance will be simulated');
      return this.simulateBalance(platform);
    }
    
    const service = this.exchangeServices.get(platform);
    if (!service) {
      this.logger.error(`Exchange service not found for ${platform}`);
      throw new Error(`Exchange service not found for ${platform}`);
    }
    
    try {
      return await service.getBalance();
    } catch (error) {
      this.logger.error(`Error getting balance from ${platform}`, error);
      throw error;
    }
  }

  private simulateBalance(platform: ExchangePlatform): any {
    // Generate simulated balance data
    return {
      BTC: { free: 0.5, locked: 0.1, total: 0.6 },
      ETH: { free: 5.0, locked: 1.0, total: 6.0 },
      USDT: { free: 10000, locked: 5000, total: 15000 },
      platform,
      simulated: true,
    };
  }

  async getOpenOrders(platform: ExchangePlatform): Promise<any[]> {
    this.logger.log(`Getting open orders from ${platform}`);
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, open orders will be simulated');
      return this.simulateOpenOrders(platform);
    }
    
    const service = this.exchangeServices.get(platform);
    if (!service) {
      this.logger.error(`Exchange service not found for ${platform}`);
      throw new Error(`Exchange service not found for ${platform}`);
    }
    
    try {
      return await service.getOpenOrders();
    } catch (error) {
      this.logger.error(`Error getting open orders from ${platform}`, error);
      throw error;
    }
  }

  private simulateOpenOrders(platform: ExchangePlatform): any[] {
    // Generate simulated open orders
    return [
      {
        id: '12345',
        symbol: 'BTC/USDT',
        side: 'buy',
        type: 'limit',
        quantity: 0.1,
        price: 30000,
        status: 'OPEN',
        timestamp: Date.now() - 3600000, // 1 hour ago
        platform,
        simulated: true,
      },
      {
        id: '12346',
        symbol: 'ETH/USDT',
        side: 'sell',
        type: 'limit',
        quantity: 2.0,
        price: 2000,
        status: 'OPEN',
        timestamp: Date.now() - 7200000, // 2 hours ago
        platform,
        simulated: true,
      },
    ];
  }

  async cancelOrder(platform: ExchangePlatform, orderId: string): Promise<boolean> {
    this.logger.log(`Cancelling order ${orderId} on ${platform}`);
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, order cancellation will be simulated');
      return true;
    }
    
    const service = this.exchangeServices.get(platform);
    if (!service) {
      this.logger.error(`Exchange service not found for ${platform}`);
      throw new Error(`Exchange service not found for ${platform}`);
    }
    
    try {
      return await service.cancelOrder(orderId);
    } catch (error) {
      this.logger.error(`Error cancelling order ${orderId} on ${platform}`, error);
      throw error;
    }
  }
}
