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
exports.KrakenService = void 0;
const common_1 = require("@nestjs/common");
const KrakenClient = require("kraken-api");
const logger_service_1 = require("../logger/logger.service");
let KrakenService = class KrakenService {
    constructor(logger) {
        this.logger = logger;
        this.simulationMode = true;
        this.logger.setContext('KrakenService');
        this.client = new KrakenClient('', '');
        this.logger.log('Kraken service initialized');
    }
    setCredentials(apiKey, apiSecret) {
        this.logger.log('Setting Kraken API credentials');
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.client = new KrakenClient(apiKey, apiSecret);
    }
    setSimulationMode(enabled) {
        this.logger.log(`Setting simulation mode to ${enabled}`);
        this.simulationMode = enabled;
    }
    async validateCredentials() {
        this.logger.log('Validating Kraken API credentials');
        if (!this.apiKey || !this.apiSecret) {
            this.logger.warn('No API credentials provided');
            return false;
        }
        try {
            await this.client.api('Balance');
            this.logger.log('Kraken API credentials are valid');
            return true;
        }
        catch (error) {
            this.logger.error('Kraken API credentials validation failed', error);
            return false;
        }
    }
    async getMarketData(symbol) {
        this.logger.debug(`Getting market data for ${symbol}`);
        try {
            const formattedSymbol = this.formatSymbol(symbol);
            const response = await this.client.api('Ticker', { pair: formattedSymbol });
            const ticker = response.result[formattedSymbol];
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
            const response = await this.client.api('Depth', { pair: formattedSymbol, count: 10 });
            const depth = response.result[formattedSymbol];
            return {
                symbol,
                bids: depth.bids.map(bid => [parseFloat(bid[0]), parseFloat(bid[1])]),
                asks: depth.asks.map(ask => [parseFloat(ask[0]), parseFloat(ask[1])]),
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
                pair: formattedSymbol,
                type: side,
                ordertype: type,
                volume: quantity.toString(),
            };
            if (type === 'limit' && price) {
                orderParams.price = price.toString();
            }
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
        }
        catch (error) {
            this.logger.error(`Error placing order on Kraken`, error);
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
        this.logger.log('Getting balance from Kraken');
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, balance will be simulated');
            return this.simulateBalance();
        }
        try {
            const response = await this.client.api('Balance');
            const balances = {};
            Object.entries(response.result).forEach(([asset, balance]) => {
                const amount = parseFloat(balance);
                if (amount > 0) {
                    const symbol = this.normalizeAsset(asset);
                    balances[symbol] = {
                        free: amount,
                        locked: 0,
                        total: amount,
                    };
                }
            });
            return balances;
        }
        catch (error) {
            this.logger.error('Error getting balance from Kraken', error);
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
        this.logger.log('Getting open orders from Kraken');
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, open orders will be simulated');
            return this.simulateOpenOrders();
        }
        try {
            const response = await this.client.api('OpenOrders');
            const orders = response.result.open;
            return Object.entries(orders).map(([orderId, orderData]) => {
                const order = orderData;
                return {
                    id: orderId,
                    symbol: this.normalizeSymbol(order.descr.pair),
                    side: order.descr.type,
                    type: order.descr.ordertype,
                    quantity: parseFloat(order.vol),
                    price: parseFloat(order.descr.price),
                    status: 'OPEN',
                    timestamp: order.opentm * 1000,
                };
            });
        }
        catch (error) {
            this.logger.error('Error getting open orders from Kraken', error);
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
        this.logger.log(`Cancelling order ${orderId} on Kraken`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, order cancellation will be simulated');
            return true;
        }
        try {
            await this.client.api('CancelOrder', { txid: orderId });
            return true;
        }
        catch (error) {
            this.logger.error(`Error cancelling order ${orderId} on Kraken`, error);
            throw error;
        }
    }
    formatSymbol(symbol) {
        return symbol
            .replace('/', '')
            .replace('BTC', 'XBT');
    }
    normalizeSymbol(symbol) {
        return symbol
            .replace('XBT', 'BTC')
            .replace('USDT', '/USDT');
    }
    normalizeAsset(asset) {
        const assetMap = {
            'XXBT': 'BTC',
            'XETH': 'ETH',
            'ZUSD': 'USD',
            'USDT': 'USDT',
        };
        return assetMap[asset] || asset;
    }
};
exports.KrakenService = KrakenService;
exports.KrakenService = KrakenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], KrakenService);
//# sourceMappingURL=kraken.service.js.map