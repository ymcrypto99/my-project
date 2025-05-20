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
exports.PlatformConfigService = void 0;
const common_1 = require("@nestjs/common");
const exchange_service_1 = require("../exchange/exchange.service");
const logger_service_1 = require("../logger/logger.service");
let PlatformConfigService = class PlatformConfigService {
    constructor(exchangeService, logger) {
        this.exchangeService = exchangeService;
        this.logger = logger;
        this.config = {
            platform: exchange_service_1.ExchangePlatform.BINANCE,
            simulationMode: true,
            apiKeys: {
                [exchange_service_1.ExchangePlatform.BINANCE]: { hasKeys: false, isValid: false },
                [exchange_service_1.ExchangePlatform.KRAKEN]: { hasKeys: false, isValid: false },
                [exchange_service_1.ExchangePlatform.BITFOREX]: { hasKeys: false, isValid: false },
                [exchange_service_1.ExchangePlatform.COINBASE]: { hasKeys: false, isValid: false },
            },
        };
        this.logger.setContext('PlatformConfigService');
        this.logger.log('Platform config service initialized');
    }
    getConfig() {
        return Object.assign({}, this.config);
    }
    async updatePlatform(platform) {
        this.logger.log(`Updating platform to ${platform}`);
        this.config.platform = platform;
        return this.getConfig();
    }
    async updateSimulationMode(enabled) {
        this.logger.log(`Updating simulation mode to ${enabled}`);
        this.config.simulationMode = enabled;
        this.exchangeService.setSimulationMode(enabled);
        return this.getConfig();
    }
    async setApiKeys(platform, apiKey, apiSecret) {
        this.logger.log(`Setting API keys for ${platform}`);
        this.exchangeService.setApiCredentials(platform, apiKey, apiSecret);
        this.config.apiKeys[platform] = {
            hasKeys: true,
            isValid: false,
        };
        return this.getConfig();
    }
    async validateApiKeys(platform) {
        var _a;
        this.logger.log(`Validating API keys for ${platform}`);
        if (!((_a = this.config.apiKeys[platform]) === null || _a === void 0 ? void 0 : _a.hasKeys)) {
            this.logger.warn(`No API keys set for ${platform}`);
            return false;
        }
        try {
            const isValid = await this.exchangeService.validateApiCredentials(platform);
            this.config.apiKeys[platform] = {
                hasKeys: true,
                isValid,
            };
            return isValid;
        }
        catch (error) {
            this.logger.error(`Error validating API keys for ${platform}`, error);
            this.config.apiKeys[platform] = {
                hasKeys: true,
                isValid: false,
            };
            return false;
        }
    }
};
exports.PlatformConfigService = PlatformConfigService;
exports.PlatformConfigService = PlatformConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [exchange_service_1.ExchangeService,
        logger_service_1.LoggerService])
], PlatformConfigService);
//# sourceMappingURL=platform-config.service.js.map