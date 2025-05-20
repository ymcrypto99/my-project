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
exports.BinanceService = void 0;
const common_1 = require("@nestjs/common");
const Binance = require("binance-api-node");
const logger_service_1 = require("../logger/logger.service");
let BinanceService = class BinanceService {
    constructor(logger) {
        this.logger = logger;
        this.simulationMode = true;
        this.logger.setContext('BinanceService');
        this.client = Binance.default();
        this.logger.log('Binance service initialized');
    }
    setCredentials(apiKey, apiSecret) {
        this.logger.log('Setting Binance API credentials');
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.client = Binance.default({
            apiKey,
            apiSecret,
        });
    }
    setSimulationMode(enabled) {
        this.logger.log(`Setting simulation mode to ${enabled}`);
        this.simulationMode = enabled;
    }
    async validateCredentials() {
        this.logger.log('Validating Binance API credentials');
        if (!this.apiKey || !this.apiSecret) {
            this.logger.warn('No API credentials provided');
            return false;
        }
        try {
            await this.client.accountInfo();
            this.logger.log('Binance API credentials are valid');
            return true;
        }
        catch (error) {
            this.logger.error('Binance API credentials validation failed', error);
            return false;
        }
    }
    async getMarketData(symbol) {
        this.logger.debug(`Getting market data for ${symbol}`);
        try {
            const formattedSymbol = this.formatSymbol(symbol);
            const ticker = await this.client.dailyStats({ symbol: formattedSymbol });
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
            const depth = await this.client.book({ symbol: formattedSymbol, limit: 10 });
            return {
                symbol,
                bids: depth.bids.map(bid => [parseFloat(bid.price), parseFloat(bid.quantity)]),
                asks: depth.asks.map(ask => [parseFloat(ask.price), parseFloat(ask.quantity)]),
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
            const formattedSymbol = this.formatSymbol(symbol);
            const orderParams = {
                symbol: formattedSymbol,
                side: side.toUpperCase(),
                type: type.toUpperCase(),
                quantity: quantity.toString(),
            };
            if (type === 'limit' && price) {
                orderParams.price = price.toString();
            }
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
        }
        catch (error) {
            this.logger.error(`Error placing order on Binance`, error);
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
            price: price || 0,
            status: 'FILLED',
            timestamp,
            simulated: true,
        };
    }
    async getBalance() {
        this.logger.log('Getting balance from Binance');
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, balance will be simulated');
            return this.simulateBalance();
        }
        try {
            const account = await this.client.accountInfo();
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
        }
        catch (error) {
            this.logger.error('Error getting balance from Binance', error);
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
        }
        catch (error) {
            this.logger.error('Error getting open orders from Binance', error);
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
        this.logger.log(`Cancelling order ${orderId} on Binance`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, order cancellation will be simulated');
            return true;
        }
        try {
            await this.client.cancelOrder({ orderId });
            return true;
        }
        catch (error) {
            this.logger.error(`Error cancelling order ${orderId} on Binance`, error);
            throw error;
        }
    }
    formatSymbol(symbol) {
        return symbol.replace('/', '');
    }
    normalizeSymbol(symbol) {
        if (symbol.endsWith('USDT')) {
            return symbol.replace('USDT', '/USDT');
        }
        return symbol;
    }
};
exports.BinanceService = BinanceService;
exports.BinanceService = BinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], BinanceService);
//# sourceMappingURL=binance.service.js.map