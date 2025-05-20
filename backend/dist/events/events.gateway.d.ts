import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExchangeService, ExchangePlatform } from '../exchange/exchange.service';
import { LoggerService } from '../logger/logger.service';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private exchangeService;
    private logger;
    server: Server;
    private clientSubscriptions;
    constructor(exchangeService: ExchangeService, logger: LoggerService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribeMarketData(client: Socket, payload: {
        symbol: string;
        platform: ExchangePlatform;
        interval?: number;
    }): {
        success: boolean;
        message: string;
    };
    handleSubscribeOrderBook(client: Socket, payload: {
        symbol: string;
        platform: ExchangePlatform;
        interval?: number;
    }): {
        success: boolean;
        message: string;
    };
    handleUnsubscribe(client: Socket, payload: {
        symbol: string;
        platform: ExchangePlatform;
        type: 'marketData' | 'orderBook';
    }): {
        success: boolean;
        message: string;
    };
    handlePlaceOrder(client: Socket, payload: {
        symbol: string;
        platform: ExchangePlatform;
        side: 'buy' | 'sell';
        type: 'market' | 'limit';
        quantity: number;
        price?: number;
    }): Promise<{
        success: boolean;
        order: any;
    }>;
    handleCancelOrder(client: Socket, payload: {
        orderId: string;
        platform: ExchangePlatform;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    handleGetBalance(client: Socket, payload: {
        platform: ExchangePlatform;
    }): Promise<{
        success: boolean;
        balance: any;
    }>;
    handleGetOpenOrders(client: Socket, payload: {
        platform: ExchangePlatform;
    }): Promise<{
        success: boolean;
        orders: any[];
    }>;
    private cleanupClientSubscriptions;
}
