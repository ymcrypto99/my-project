import { PlatformConfigService } from './platform-config.service';
import { ExchangePlatform } from '../exchange/exchange.service';
import { LoggerService } from '../logger/logger.service';
export declare class PlatformConfigController {
    private platformConfigService;
    private logger;
    constructor(platformConfigService: PlatformConfigService, logger: LoggerService);
    getConfig(): Promise<import("./platform-config.service").PlatformConfig>;
    updatePlatform(body: {
        platform: ExchangePlatform;
    }): Promise<import("./platform-config.service").PlatformConfig>;
    updateSimulationMode(body: {
        enabled: boolean;
    }): Promise<import("./platform-config.service").PlatformConfig>;
    setApiKeys(platform: ExchangePlatform, body: {
        apiKey: string;
        apiSecret: string;
    }): Promise<import("./platform-config.service").PlatformConfig>;
    validateApiKeys(platform: ExchangePlatform): Promise<{
        platform: ExchangePlatform;
        isValid: boolean;
    }>;
}
