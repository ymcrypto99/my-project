import { LoggerService } from '../logger/logger.service';
import { MarketData, OrderBook } from './exchange.service';
export declare class BinanceService {
    private logger;
    private client;
    private apiKey;
    private apiSecret;
    private simulationMode;
    constructor(logger: LoggerService);
    setCredentials(apiKey: string, apiSecret: string): void;
    setSimulationMode(enabled: boolean): void;
    validateCredentials(): Promise<boolean>;
    getMarketData(symbol: string): Promise<MarketData>;
    getOrderBook(symbol: string): Promise<OrderBook>;
    placeOrder(symbol: string, side: 'buy' | 'sell', type: 'market' | 'limit', quantity: number, price?: number): Promise<any>;
    private simulateOrder;
    getBalance(): Promise<any>;
    private simulateBalance;
    getOpenOrders(): Promise<any[]>;
    private simulateOpenOrders;
    cancelOrder(orderId: string): Promise<boolean>;
    private formatSymbol;
    private normalizeSymbol;
}
