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
exports.ExchangeService = exports.ExchangePlatform = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const binance_service_1 = require("./binance.service");
const kraken_service_1 = require("./kraken.service");
const bitforex_service_1 = require("./bitforex.service");
const coinbase_service_1 = require("./coinbase.service");
var ExchangePlatform;
(function (ExchangePlatform) {
    ExchangePlatform["BINANCE"] = "binance";
    ExchangePlatform["KRAKEN"] = "kraken";
    ExchangePlatform["BITFOREX"] = "bitforex";
    ExchangePlatform["COINBASE"] = "coinbase";
})(ExchangePlatform || (exports.ExchangePlatform = ExchangePlatform = {}));
let ExchangeService = class ExchangeService {
    constructor(logger, binanceService, krakenService, bitforexService, coinbaseService) {
        this.logger = logger;
        this.binanceService = binanceService;
        this.krakenService = krakenService;
        this.bitforexService = bitforexService;
        this.coinbaseService = coinbaseService;
        this.exchangeServices = new Map();
        this.apiCredentials = new Map();
        this.simulationMode = true;
        this.logger.setContext('ExchangeService');
        this.exchangeServices.set(ExchangePlatform.BINANCE, binanceService);
        this.exchangeServices.set(ExchangePlatform.KRAKEN, krakenService);
        this.exchangeServices.set(ExchangePlatform.BITFOREX, bitforexService);
        this.exchangeServices.set(ExchangePlatform.COINBASE, coinbaseService);
        this.logger.log('Exchange service initialized');
    }
    setApiCredentials(platform, apiKey, apiSecret) {
        this.logger.log(`Setting API credentials for ${platform}`);
        this.apiCredentials.set(platform, { apiKey, apiSecret });
        const service = this.exchangeServices.get(platform);
        if (service) {
            service.setCredentials(apiKey, apiSecret);
        }
    }
    async validateApiCredentials(platform) {
        this.logger.log(`Validating API credentials for ${platform}`);
        const credentials = this.apiCredentials.get(platform);
        if (!credentials) {
            this.logger.warn(`No API credentials found for ${platform}`);
            return false;
        }
        const service = this.exchangeServices.get(platform);
        if (!service) {
            this.logger.error(`Exchange service not found for ${platform}`);
            return false;
        }
        try {
            const isValid = await service.validateCredentials();
            this.apiCredentials.set(platform, Object.assign(Object.assign({}, credentials), { isValid }));
            return isValid;
        }
        catch (error) {
            this.logger.error(`Error validating credentials for ${platform}`, error);
            return false;
        }
    }
    setSimulationMode(enabled) {
        this.logger.log(`Setting simulation mode to ${enabled}`);
        this.simulationMode = enabled;
        for (const service of this.exchangeServices.values()) {
            service.setSimulationMode(enabled);
        }
    }
    isSimulationMode() {
        return this.simulationMode;
    }
    async getMarketData(platform, symbol) {
        this.logger.debug(`Getting market data for ${symbol} from ${platform}`);
        const service = this.exchangeServices.get(platform);
        if (!service) {
            this.logger.error(`Exchange service not found for ${platform}`);
            throw new Error(`Exchange service not found for ${platform}`);
        }
        try {
            return await service.getMarketData(symbol);
        }
        catch (error) {
            this.logger.error(`Error getting market data for ${symbol} from ${platform}`, error);
            throw error;
        }
    }
    async getOrderBook(platform, symbol) {
        this.logger.debug(`Getting order book for ${symbol} from ${platform}`);
        const service = this.exchangeServices.get(platform);
        if (!service) {
            this.logger.error(`Exchange service not found for ${platform}`);
            throw new Error(`Exchange service not found for ${platform}`);
        }
        try {
            return await service.getOrderBook(symbol);
        }
        catch (error) {
            this.logger.error(`Error getting order book for ${symbol} from ${platform}`, error);
            throw error;
        }
    }
    async placeOrder(platform, symbol, side, type, quantity, price) {
        this.logger.log(`Placing ${side} ${type} order for ${quantity} ${symbol} on ${platform}`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, order will be simulated');
            return this.simulateOrder(platform, symbol, side, type, quantity, price);
        }
        const service = this.exchangeServices.get(platform);
        if (!service) {
            this.logger.error(`Exchange service not found for ${platform}`);
            throw new Error(`Exchange service not found for ${platform}`);
        }
        try {
            return await service.placeOrder(symbol, side, type, quantity, price);
        }
        catch (error) {
            this.logger.error(`Error placing order on ${platform}`, error);
            throw error;
        }
    }
    simulateOrder(platform, symbol, side, type, quantity, price) {
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
            platform,
            simulated: true,
        };
    }
    async getBalance(platform) {
        this.logger.log(`Getting balance from ${platform}`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, balance will be simulated');
            return this.simulateBalance(platform);
        }
        const service = this.exchangeServices.get(platform);
        if (!service) {
            this.logger.error(`Exchange service not found for ${platform}`);
            throw new Error(`Exchange service not found for ${platform}`);
        }
        try {
            return await service.getBalance();
        }
        catch (error) {
            this.logger.error(`Error getting balance from ${platform}`, error);
            throw error;
        }
    }
    simulateBalance(platform) {
        return {
            BTC: { free: 0.5, locked: 0.1, total: 0.6 },
            ETH: { free: 5.0, locked: 1.0, total: 6.0 },
            USDT: { free: 10000, locked: 5000, total: 15000 },
            platform,
            simulated: true,
        };
    }
    async getOpenOrders(platform) {
        this.logger.log(`Getting open orders from ${platform}`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, open orders will be simulated');
            return this.simulateOpenOrders(platform);
        }
        const service = this.exchangeServices.get(platform);
        if (!service) {
            this.logger.error(`Exchange service not found for ${platform}`);
            throw new Error(`Exchange service not found for ${platform}`);
        }
        try {
            return await service.getOpenOrders();
        }
        catch (error) {
            this.logger.error(`Error getting open orders from ${platform}`, error);
            throw error;
        }
    }
    simulateOpenOrders(platform) {
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
                platform,
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
                platform,
                simulated: true,
            },
        ];
    }
    async cancelOrder(platform, orderId) {
        this.logger.log(`Cancelling order ${orderId} on ${platform}`);
        if (this.simulationMode) {
            this.logger.log('Simulation mode is enabled, order cancellation will be simulated');
            return true;
        }
        const service = this.exchangeServices.get(platform);
        if (!service) {
            this.logger.error(`Exchange service not found for ${platform}`);
            throw new Error(`Exchange service not found for ${platform}`);
        }
        try {
            return await service.cancelOrder(orderId);
        }
        catch (error) {
            this.logger.error(`Error cancelling order ${orderId} on ${platform}`, error);
            throw error;
        }
    }
};
exports.ExchangeService = ExchangeService;
exports.ExchangeService = ExchangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        binance_service_1.BinanceService,
        kraken_service_1.KrakenService,
        bitforex_service_1.BitforexService,
        coinbase_service_1.CoinbaseService])
], ExchangeService);
//# sourceMappingURL=exchange.service.js.map