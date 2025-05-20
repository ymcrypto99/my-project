import { LoggerService } from '../logger/logger.service';
import { MarketData, OrderBook } from './exchange.service';
export declare class BitforexService {
    private logger;
    private apiKey;
    private apiSecret;
    private simulationMode;
    private baseUrl;
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
    private simulatePrice;
}
