import { Injectable } from '@nestjs/common';
import * as Binance from 'binance-api-node';
import { LoggerService } from '../logger/logger.service';
import { MarketData, OrderBook } from './exchange.service';

@Injectable()
export class BinanceService {
  private client: any;
  private apiKey: string;
  private apiSecret: string;
  private simulationMode = true;

  constructor(private logger: LoggerService) {
    this.logger.setContext('BinanceService');
    this.client = Binance.default();
    this.logger.log('Binance service initialized');
  }

  setCredentials(apiKey: string, apiSecret: string): void {
    this.logger.log('Setting Binance API credentials');
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    
    // Initialize client with credentials
    this.client = Binance.default({
      apiKey,
      apiSecret,
    });
  }

  setSimulationMode(enabled: boolean): void {
    this.logger.log(`Setting simulation mode to ${enabled}`);
    this.simulationMode = enabled;
  }

  async validateCredentials(): Promise<boolean> {
    this.logger.log('Validating Binance API credentials');
    
    if (!this.apiKey || !this.apiSecret) {
      this.logger.warn('No API credentials provided');
      return false;
    }
    
    try {
      // Try to access account information to validate credentials
      await this.client.accountInfo();
      this.logger.log('Binance API credentials are valid');
      return true;
    } catch (error) {
      this.logger.error('Binance API credentials validation failed', error);
      return false;
    }
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    this.logger.debug(`Getting market data for ${symbol}`);
    
    try {
      // Normalize symbol format (e.g., BTC/USDT -> BTCUSDT)
      const formattedSymbol = this.formatSymbol(symbol);
      
      // Get ticker data
      const ticker = await this.client.dailyStats({ symbol: formattedSymbol });
      
      // Get 24h price data
      const trades = await this.client.trades({ symbol: formattedSymbol, limit: 1 });
      const latestPrice = parseFloat(trades[0].price);
      
      return {
        symbol,
        price: latestPrice,
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        volume24h: parseFloat(ticker.volume),
        change24h: parseFloat(ticker.priceChange),
        changePercent24h: parseFloat(ticker.priceChangePercent),
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
      const depth = await this.client.book({ symbol: formattedSymbol, limit: 10 });
      
      return {
        symbol,
        bids: depth.bids.map(bid => [parseFloat(bid.price), parseFloat(bid.quantity)]),
        asks: depth.asks.map(ask => [parseFloat(ask.price), parseFloat(ask.quantity)]),
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
        symbol: formattedSymbol,
        side: side.toUpperCase(),
        type: type.toUpperCase(),
        quantity: quantity.toString(),
      };
      
      // Add price for limit orders
      if (type === 'limit' && price) {
        orderParams.price = price.toString();
      }
      
      // Place order
      const order = await this.client.order(orderParams);
      
      return {
        id: order.orderId,
        symbol,
        side,
        type,
        quantity,
        price: parseFloat(order.price) || 0,
        status: order.status,
        timestamp: order.transactTime,
      };
    } catch (error) {
      this.logger.error(`Error placing order on Binance`, error);
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
    this.logger.log('Getting balance from Binance');
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, balance will be simulated');
      return this.simulateBalance();
    }
    
    try {
      const account = await this.client.accountInfo();
      
      // Transform balances to a more usable format
      const balances = {};
      account.balances.forEach(balance => {
        const free = parseFloat(balance.free);
        const locked = parseFloat(balance.locked);
        
        if (free > 0 || locked > 0) {
          balances[balance.asset] = {
            free,
            locked,
            total: free + locked,
          };
        }
      });
      
      return balances;
    } catch (error) {
      this.logger.error('Error getting balance from Binance', error);
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
    this.logger.log('Getting open orders from Binance');
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, open orders will be simulated');
      return this.simulateOpenOrders();
    }
    
    try {
      const openOrders = await this.client.openOrders();
      
      return openOrders.map(order => ({
        id: order.orderId,
        symbol: this.normalizeSymbol(order.symbol),
        side: order.side.toLowerCase(),
        type: order.type.toLowerCase(),
        quantity: parseFloat(order.origQty),
        price: parseFloat(order.price),
        status: order.status,
        timestamp: order.time,
      }));
    } catch (error) {
      this.logger.error('Error getting open orders from Binance', error);
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
    this.logger.log(`Cancelling order ${orderId} on Binance`);
    
    if (this.simulationMode) {
      this.logger.log('Simulation mode is enabled, order cancellation will be simulated');
      return true;
    }
    
    try {
      await this.client.cancelOrder({ orderId });
      return true;
    } catch (error) {
      this.logger.error(`Error cancelling order ${orderId} on Binance`, error);
      throw error;
    }
  }

  // Helper methods for symbol formatting
  private formatSymbol(symbol: string): string {
    // Convert BTC/USDT to BTCUSDT
    return symbol.replace('/', '');
  }

  private normalizeSymbol(symbol: string): string {
    // Convert BTCUSDT to BTC/USDT
    // This is a simplified version, in a real app we would need more complex logic
    if (symbol.endsWith('USDT')) {
      return symbol.replace('USDT', '/USDT');
    }
    return symbol;
  }
}
