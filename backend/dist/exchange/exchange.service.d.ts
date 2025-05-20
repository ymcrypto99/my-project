import { LoggerService } from '../logger/logger.service';
import { BinanceService } from './binance.service';
import { KrakenService } from './kraken.service';
import { BitforexService } from './bitforex.service';
import { CoinbaseService } from './coinbase.service';
export declare enum ExchangePlatform {
    BINANCE = "binance",
    KRAKEN = "kraken",
    BITFOREX = "bitforex",
    COINBASE = "coinbase"
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
    bids: [number, number][];
    asks: [number, number][];
    timestamp: number;
}
export interface ApiCredentials {
    apiKey: string;
    apiSecret: string;
    isValid?: boolean;
}
export declare class ExchangeService {
    private logger;
    private binanceService;
    private krakenService;
    private bitforexService;
    private coinbaseService;
    private exchangeServices;
    private apiCredentials;
    private simulationMode;
    constructor(logger: LoggerService, binanceService: BinanceService, krakenService: KrakenService, bitforexService: BitforexService, coinbaseService: CoinbaseService);
    setApiCredentials(platform: ExchangePlatform, apiKey: string, apiSecret: string): void;
    validateApiCredentials(platform: ExchangePlatform): Promise<boolean>;
    setSimulationMode(enabled: boolean): void;
    isSimulationMode(): boolean;
    getMarketData(platform: ExchangePlatform, symbol: string): Promise<MarketData>;
    getOrderBook(platform: ExchangePlatform, symbol: string): Promise<OrderBook>;
    placeOrder(platform: ExchangePlatform, symbol: string, side: 'buy' | 'sell', type: 'market' | 'limit', quantity: number, price?: number): Promise<any>;
    private simulateOrder;
    getBalance(platform: ExchangePlatform): Promise<any>;
    private simulateBalance;
    getOpenOrders(platform: ExchangePlatform): Promise<any[]>;
    private simulateOpenOrders;
    cancelOrder(platform: ExchangePlatform, orderId: string): Promise<boolean>;
}
