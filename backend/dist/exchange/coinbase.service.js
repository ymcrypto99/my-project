"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinbaseService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
let CoinbaseService = class CoinbaseService {
    constructor(logger) {
        this.logger = logger;
        this.simulationMode = true;
        this.logger.setContext('CoinbaseService');
        this.logger.log('Coinbase service initialized');
    }
    setCredentials(apiKey, apiSecret) {
        this.logger.log('Setting Coinbase API credentials');
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.logger.log('Coinbase client would be initialized with credentials');
    }
    setSimulationMode(enabled) {
        this.logger.log(`Setting simulation mode to ${enabled}`);
        this.simulationMode = enabled;
    }
    async validateCredentials() {
        this.logger.log('Validating Coinbase API credentials');
        if (!this.apiKey || !this.apiSecret) {
            this.logger.warn('No API credentials provided');
            return false;
        }
        try {
            this.logger.log('Coinbase API credentials validation simulated');
            return true;
        }
        catch (error) {
            this.logger.error('Coinbase API credentials validation failed', error);
            return false;
        }
    }
    async getMarketData(symbol) {
        this.logger.debug(`Getting market data for ${symbol}`);
        try {
            const formattedSymbol = this.formatSymbol(symbol);
            const price = this.simulatePrice(symbol);
            const high24h = price * 1.05;
            const low24h = price * 0.95;
            const volume24h = Math.random() * 1000;
            const change24h = price * 0.02;
            const changePercent24h = 2.0;
            return {
                symbol,
                price,
                high24h,
                low24h,
                volume24h,
                change24h,
                changePercent24h,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            this.logger.error(`Error getting market data for ${symbol}`, error);
            throw error;
        }
    }
    async getOrderBook(symbol) {
        this.logger.debug(`Getting order book for ${symbol}`);
        try {
            const formattedSymbol = this.formatSymbol(symbol);
            const currentPrice = this.simulatePrice(symbol);
            const bids = Array.from({ length: 10 }, (_, i) => {
                const price = currentPrice * (1 - (i + 1) * 0.001);
                const quantity = Math.random() * 10;
                return [price, quantity];
            });
            const asks = Array.from({ length: 10 }, (_, i) => {
                const price = currentPrice * (1 + (i + 1) * 0.001);
                const quantity = Math.random() * 10;
                return [price, quantity];
            });
            return {
                symbol,
                bids,
                asks,
                timestamp: Date.now(),
            };
        }
        catch (error) {
            this.logger.error(`Error getting order book for ${symbol}`, error);
            throw error;
        }
    }
    async placeOrder(symbol, side, type, quantity, price) {
        this.logger.log(`Placing ${side} ${type} order for ${quantity} ${symbol}`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, order will be simulated');
            return this.simulateOrder(symbol, side, type, quantity, price);
        }
        try {
            return this.simulateOrder(symbol, side, type, quantity, price);
        }
        catch (error) {
            this.logger.error(`Error placing order on Coinbase`, error);
            throw error;
        }
    }
    simulateOrder(symbol, side, type, quantity, price) {
        const orderId = Math.floor(Math.random() * 1000000).toString();
        const timestamp = Date.now();
        return {
            id: orderId,
            symbol,
            side,
            type,
            quantity,
            price: price || this.simulatePrice(symbol),
            status: 'FILLED',
            timestamp,
            simulated: true,
        };
    }
    async getBalance() {
        this.logger.log('Getting balance from Coinbase');
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, balance will be simulated');
            return this.simulateBalance();
        }
        try {
            return this.simulateBalance();
        }
        catch (error) {
            this.logger.error('Error getting balance from Coinbase', error);
            throw error;
        }
    }
    simulateBalance() {
        return {
            BTC: { free: 0.5, locked: 0.1, total: 0.6 },
            ETH: { free: 5.0, locked: 1.0, total: 6.0 },
            USDT: { free: 10000, locked: 5000, total: 15000 },
            simulated: true,
        };
    }
    async getOpenOrders() {
        this.logger.log('Getting open orders from Coinbase');
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, open orders will be simulated');
            return this.simulateOpenOrders();
        }
        try {
            return this.simulateOpenOrders();
        }
        catch (error) {
            this.logger.error('Error getting open orders from Coinbase', error);
            throw error;
        }
    }
    simulateOpenOrders() {
        return [
            {
                id: '12345',
                symbol: 'BTC/USDT',
                side: 'buy',
                type: 'limit',
                quantity: 0.1,
                price: 30000,
                status: 'OPEN',
                timestamp: Date.now() - 3600000,
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
                timestamp: Date.now() - 7200000,
                simulated: true,
            },
        ];
    }
    async cancelOrder(orderId) {
        this.logger.log(`Cancelling order ${orderId} on Coinbase`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, order cancellation will be simulated');
            return true;
        }
        try {
            return true;
        }
        catch (error) {
            this.logger.error(`Error cancelling order ${orderId} on Coinbase`, error);
            throw error;
        }
    }
    formatSymbol(symbol) {
        return symbol.replace('/', '-');
    }
    normalizeSymbol(symbol) {
        return symbol.replace('-', '/');
    }
    simulatePrice(symbol) {
        if (symbol.includes('BTC')) {
            return 30000 + Math.random() * 2000;
        }
        else if (symbol.includes('ETH')) {
            return 2000 + Math.random() * 200;
        }
        else if (symbol.includes('SOL')) {
            return 100 + Math.random() * 20;
        }
        else {
            return 1 + Math.random() * 100;
        }
    }
};
exports.CoinbaseService = CoinbaseService;
exports.CoinbaseService = CoinbaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], CoinbaseService);
//# sourceMappingURL=coinbase.service.js.map