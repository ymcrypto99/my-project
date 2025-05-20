import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/ws-jwt-auth.guard';
import { ExchangeService, ExchangePlatform, MarketData, OrderBook } from '../exchange/exchange.service';
import { LoggerService } from '../logger/logger.service';

interface SubscriptionInfo {
  symbol: string;
  platform: ExchangePlatform;
  type: 'marketData' | 'orderBook';
  interval: number;
  timerId: NodeJS.Timeout;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  private clientSubscriptions: Map<string, SubscriptionInfo[]> = new Map();

  constructor(
    private exchangeService: ExchangeService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('EventsGateway');
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Initialize empty subscriptions array for new client
    this.clientSubscriptions.set(client.id, []);
    
    // Send connection status to client
    client.emit('connection_status', { connected: true });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Clean up subscriptions for disconnected client
    this.cleanupClientSubscriptions(client.id);
    
    // Remove client from subscriptions map
    this.clientSubscriptions.delete(client.id);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('subscribe_market_data')
  handleSubscribeMarketData(client: Socket, payload: { symbol: string; platform: ExchangePlatform; interval?: number }) {
    try {
      this.logger.log(`Client ${client.id} subscribing to market data for ${payload.symbol} on ${payload.platform}`);
      
      const { symbol, platform, interval = 5000 } = payload;
      
      // Create subscription
      const subscription: SubscriptionInfo = {
        symbol,
        platform,
        type: 'marketData',
        interval,
        timerId: null,
      };
      
      // Set up interval to send market data
      subscription.timerId = setInterval(async () => {
        try {
          const marketData = await this.exchangeService.getMarketData(platform, symbol);
          client.emit('market_data', marketData);
        } catch (error) {
          this.logger.error(`Error fetching market data for ${symbol} on ${platform}`, error);
          client.emit('error', { message: `Error fetching market data: ${error.message}` });
        }
      }, interval);
      
      // Add subscription to client's subscriptions
      const clientSubs = this.clientSubscriptions.get(client.id) || [];
      clientSubs.push(subscription);
      this.clientSubscriptions.set(client.id, clientSubs);
      
      // Send initial market data
      this.exchangeService.getMarketData(platform, symbol)
        .then(marketData => client.emit('market_data', marketData))
        .catch(error => {
          this.logger.error(`Error fetching initial market data for ${symbol} on ${platform}`, error);
          client.emit('error', { message: `Error fetching initial market data: ${error.message}` });
        });
      
      return { success: true, message: `Subscribed to market data for ${symbol} on ${platform}` };
    } catch (error) {
      this.logger.error(`Error subscribing to market data`, error);
      throw new WsException(`Error subscribing to market data: ${error.message}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('subscribe_order_book')
  handleSubscribeOrderBook(client: Socket, payload: { symbol: string; platform: ExchangePlatform; interval?: number }) {
    try {
      this.logger.log(`Client ${client.id} subscribing to order book for ${payload.symbol} on ${payload.platform}`);
      
      const { symbol, platform, interval = 5000 } = payload;
      
      // Create subscription
      const subscription: SubscriptionInfo = {
        symbol,
        platform,
        type: 'orderBook',
        interval,
        timerId: null,
      };
      
      // Set up interval to send order book data
      subscription.timerId = setInterval(async () => {
        try {
          const orderBook = await this.exchangeService.getOrderBook(platform, symbol);
          client.emit('order_book', orderBook);
        } catch (error) {
          this.logger.error(`Error fetching order book for ${symbol} on ${platform}`, error);
          client.emit('error', { message: `Error fetching order book: ${error.message}` });
        }
      }, interval);
      
      // Add subscription to client's subscriptions
      const clientSubs = this.clientSubscriptions.get(client.id) || [];
      clientSubs.push(subscription);
      this.clientSubscriptions.set(client.id, clientSubs);
      
      // Send initial order book data
      this.exchangeService.getOrderBook(platform, symbol)
        .then(orderBook => client.emit('order_book', orderBook))
        .catch(error => {
          this.logger.error(`Error fetching initial order book for ${symbol} on ${platform}`, error);
          client.emit('error', { message: `Error fetching initial order book: ${error.message}` });
        });
      
      return { success: true, message: `Subscribed to order book for ${symbol} on ${platform}` };
    } catch (error) {
      this.logger.error(`Error subscribing to order book`, error);
      throw new WsException(`Error subscribing to order book: ${error.message}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { symbol: string; platform: ExchangePlatform; type: 'marketData' | 'orderBook' }) {
    try {
      this.logger.log(`Client ${client.id} unsubscribing from ${payload.type} for ${payload.symbol} on ${payload.platform}`);
      
      const { symbol, platform, type } = payload;
      
      // Get client's subscriptions
      const clientSubs = this.clientSubscriptions.get(client.id) || [];
      
      // Find subscription to remove
      const subIndex = clientSubs.findIndex(sub => 
        sub.symbol === symbol && 
        sub.platform === platform && 
        sub.type === type
      );
      
      if (subIndex !== -1) {
        // Clear interval
        clearInterval(clientSubs[subIndex].timerId);
        
        // Remove subscription
        clientSubs.splice(subIndex, 1);
        this.clientSubscriptions.set(client.id, clientSubs);
        
        return { success: true, message: `Unsubscribed from ${type} for ${symbol} on ${platform}` };
      } else {
        return { success: false, message: `Subscription not found` };
      }
    } catch (error) {
      this.logger.error(`Error unsubscribing`, error);
      throw new WsException(`Error unsubscribing: ${error.message}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('place_order')
  async handlePlaceOrder(client: Socket, payload: { 
    symbol: string; 
    platform: ExchangePlatform; 
    side: 'buy' | 'sell'; 
    type: 'market' | 'limit'; 
    quantity: number; 
    price?: number;
  }) {
    try {
      this.logger.log(`Client ${client.id} placing ${payload.side} ${payload.type} order for ${payload.quantity} ${payload.symbol} on ${payload.platform}`);
      
      const { symbol, platform, side, type, quantity, price } = payload;
      
      // Place order
      const order = await this.exchangeService.placeOrder(platform, symbol, side, type, quantity, price);
      
      // Emit order update to client
      client.emit('order_update', order);
      
      return { success: true, order };
    } catch (error) {
      this.logger.error(`Error placing order`, error);
      throw new WsException(`Error placing order: ${error.message}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('cancel_order')
  async handleCancelOrder(client: Socket, payload: { orderId: string; platform: ExchangePlatform }) {
    try {
      this.logger.log(`Client ${client.id} cancelling order ${payload.orderId} on ${payload.platform}`);
      
      const { orderId, platform } = payload;
      
      // Cancel order
      const success = await this.exchangeService.cancelOrder(platform, orderId);
      
      return { success, message: success ? 'Order cancelled successfully' : 'Failed to cancel order' };
    } catch (error) {
      this.logger.error(`Error cancelling order`, error);
      throw new WsException(`Error cancelling order: ${error.message}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('get_balance')
  async handleGetBalance(client: Socket, payload: { platform: ExchangePlatform }) {
    try {
      this.logger.log(`Client ${client.id} requesting balance for ${payload.platform}`);
      
      const { platform } = payload;
      
      // Get balance
      const balance = await this.exchangeService.getBalance(platform);
      
      return { success: true, balance };
    } catch (error) {
      this.logger.error(`Error getting balance`, error);
      throw new WsException(`Error getting balance: ${error.message}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('get_open_orders')
  async handleGetOpenOrders(client: Socket, payload: { platform: ExchangePlatform }) {
    try {
      this.logger.log(`Client ${client.id} requesting open orders for ${payload.platform}`);
      
      const { platform } = payload;
      
      // Get open orders
      const orders = await this.exchangeService.getOpenOrders(platform);
      
      return { success: true, orders };
    } catch (error) {
      this.logger.error(`Error getting open orders`, error);
      throw new WsException(`Error getting open orders: ${error.message}`);
    }
  }

  private cleanupClientSubscriptions(clientId: string) {
    this.logger.log(`Cleaning up subscriptions for client ${clientId}`);
    
    const clientSubs = this.clientSubscriptions.get(clientId) || [];
    
    // Clear all intervals
    for (const sub of clientSubs) {
      clearInterval(sub.timerId);
    }
  }
}
