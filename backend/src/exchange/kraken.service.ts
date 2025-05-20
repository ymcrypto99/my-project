import { Injectable } from '@nestjs/common';
import * as KrakenClient from 'kraken-api';
import { LoggerService } from '../logger/logger.service';
import { MarketData, OrderBook } from './exchange.service';

@Injectable()
export class KrakenService {
  private client: any;
  private apiKey: string;
  private apiSecret: string;
  private simulationMode = true;

  constructor(private logger: LoggerService) {
    this.logger.setContext('KrakenService');
    this.client = new KrakenClient('', '');
    this.logger.log('Kraken service initialized');
  }

  setCredentials(apiKey: string, apiSecret: string): void {
    this.logger.log('Setting Kraken API credentials');
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    
    // Initialize client with credentials
    this.client = new KrakenClient(apiKey, apiSecret);
  }

  setSimulationMode(enabled: boolean): void {
    this.logger.log(`Setting simulation mode to ${enabled}`);
    this.simulationMode = enabled;
  }

  async validateCredentials(): Promise<boolean> {
    this.logger.log('Validating Kraken API credentials');
    
    if (!this.apiKey || !this.apiSecret) {
      this.logger.warn('No API credentials provided');
      return false;
    }
    
    try {
      // Try to access account balance to validate credentials
      await this.client.api('Balance');
      this.logger.log('Kraken API credentials are valid');
      return true;
    } catch (error) {
      this.logger.error('Kraken API credentials validation failed', error);
      return false;
    }
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    this.logger.debug(`Getting market data for ${symbol}`);
    
    try {
      // Normalize symbol format (e.g., BTC/USDT -> XBTUSDT)
      const formattedSymbol = this.formatSymbol(symbol);
      
      // Get ticker data
      const response = await this.client.api('Ticker', { pair: formattedSymbol });
      const ticker = response.result[formattedSymbol];
      
      // Calculate 24h change
      const open = parseFloat(ticker.o);
      const last = parseFloat(ticker.c[0]);
      const change24h = last - open;
      const changePercent24h = (change24h / open) * 100;
      
      return {
        symbol,
        price: last,
        high24h: parseFloat(ticker.h[1]),
        low24h: parseFloat(ticker.l[1]),
        volume24h: parseFloat(ticker.v[1]),
        change24h,
        changePercent24h,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(`Error getting market data for ${symbol}`, error);
      throw error;
    }
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    this.logger.debug(`Getting order book for ${symbol}`);
    
    try {
      // Normalize symbol format
      const formattedSymbol = this.formatSymbol(symbol);
      
      // Get order book data
      const response = await this.client.api('Depth', { pair: formattedSymbol, count: 10 });
      const depth = response.result[formattedSymbol];
      
      return {
        symbol,
        bids: depth.bids.map(bid => [parseFloat(bid[0]), parseFloat(bid[1])]),
        asks: depth.asks.map(ask => [parseFloat(ask[0]), parseFloat(ask[1])]),
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(`Error getting order book for ${symbol}`, error);
      throw error;
    }
  }

  async placeOrder(
    symbol: string,
    side: 'buy' | 'sell',
    type: 'market' | 'limit',
    quantity: number,
    price?: number,
  ): Promise<any> {
    this.logger.log(`Placing ${side} ${type} order for ${quantity} ${symbol}`);
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, order will be simulated');
      return this.simulateOrder(symbol, side, type, quantity, price);
    }
    
    try {
      // Normalize symbol format
      const formattedSymbol = this.formatSymbol(symbol);
      
      // Prepare order parameters
      const orderParams: any = {
        pair: formattedSymbol,
        type: side,
        ordertype: type,
        volume: quantity.toString(),
      };
      
      // Add price for limit orders
      if (type === 'limit' && price) {
        orderParams.price = price.toString();
      }
      
      // Place order
      const response = await this.client.api('AddOrder', orderParams);
      const orderId = response.result.txid[0];
      
      return {
        id: orderId,
        symbol,
        side,
        type,
        quantity,
        price: price || 0,
        status: 'OPEN',
        timestamp: Date.now(),
      };
    } catch (error) {
      this.logger.error(`Error placing order on Kraken`, error);
      throw error;
    }
  }

  private simulateOrder(
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
      simulated: true,
    };
  }

  async getBalance(): Promise<any> {
    this.logger.log('Getting balance from Kraken');
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, balance will be simulated');
      return this.simulateBalance();
    }
    
    try {
      const response = await this.client.api('Balance');
      
      // Transform balances to a more usable format
      const balances = {};
      Object.entries(response.result).forEach(([asset, balance]) => {
        const amount = parseFloat(balance as string);
        
        if (amount > 0) {
          // Convert Kraken asset codes to standard symbols
          const symbol = this.normalizeAsset(asset);
          
          balances[symbol] = {
            free: amount,
            locked: 0, // Kraken doesn't provide locked amounts in the Balance endpoint
            total: amount,
          };
        }
      });
      
      return balances;
    } catch (error) {
      this.logger.error('Error getting balance from Kraken', error);
      throw error;
    }
  }

  private simulateBalance(): any {
    // Generate simulated balance data
    return {
      BTC: { free: 0.5, locked: 0.1, total: 0.6 },
      ETH: { free: 5.0, locked: 1.0, total: 6.0 },
      USDT: { free: 10000, locked: 5000, total: 15000 },
      simulated: true,
    };
  }

  async getOpenOrders(): Promise<any[]> {
    this.logger.log('Getting open orders from Kraken');
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, open orders will be simulated');
      return this.simulateOpenOrders();
    }
    
    try {
      const response = await this.client.api('OpenOrders');
      const orders = response.result.open;
      
      return Object.entries(orders).map(([orderId, orderData]) => {
        const order = orderData as any;
        return {
          id: orderId,
          symbol: this.normalizeSymbol(order.descr.pair),
          side: order.descr.type,
          type: order.descr.ordertype,
          quantity: parseFloat(order.vol),
          price: parseFloat(order.descr.price),
          status: 'OPEN',
          timestamp: order.opentm * 1000, // Convert to milliseconds
        };
      });
    } catch (error) {
      this.logger.error('Error getting open orders from Kraken', error);
      throw error;
    }
  }

  private simulateOpenOrders(): any[] {
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
        simulated: true,
      },
    ];
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    this.logger.log(`Cancelling order ${orderId} on Kraken`);
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, order cancellation will be simulated');
      return true;
    }
    
    try {
      await this.client.api('CancelOrder', { txid: orderId });
      return true;
    } catch (error) {
      this.logger.error(`Error cancelling order ${orderId} on Kraken`, error);
      throw error;
    }
  }

  // Helper methods for symbol formatting
  private formatSymbol(symbol: string): string {
    // Convert BTC/USDT to XBTUSDT for Kraken
    return symbol
      .replace('/', '')
      .replace('BTC', 'XBT'); // Kraken uses XBT instead of BTC
  }

  private normalizeSymbol(symbol: string): string {
    // Convert XBTUSDT to BTC/USDT
    return symbol
      .replace('XBT', 'BTC')
      .replace('USDT', '/USDT');
  }

  private normalizeAsset(asset: string): string {
    // Convert Kraken asset codes to standard symbols
    // For example, XXBT to BTC
    const assetMap = {
      'XXBT': 'BTC',
      'XETH': 'ETH',
      'ZUSD': 'USD',
      'USDT': 'USDT',
    };
    
    return assetMap[asset] || asset;
  }
}
