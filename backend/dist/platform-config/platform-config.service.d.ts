import { ExchangeService, ExchangePlatform } from '../exchange/exchange.service';
import { LoggerService } from '../logger/logger.service';
export interface PlatformConfig {
    platform: ExchangePlatform;
    simulationMode: boolean;
    apiKeys: {
        [key in ExchangePlatform]?: {
            hasKeys: boolean;
            isValid: boolean;
        };
    };
}
export declare class PlatformConfigService {
    private exchangeService;
    private logger;
    private config;
    constructor(exchangeService: ExchangeService, logger: LoggerService);
    getConfig(): PlatformConfig;
    updatePlatform(platform: ExchangePlatform): Promise<PlatformConfig>;
    updateSimulationMode(enabled: boolean): Promise<PlatformConfig>;
    setApiKeys(platform: ExchangePlatform, apiKey: string, apiSecret: string): Promise<PlatformConfig>;
    validateApiKeys(platform: ExchangePlatform): Promise<boolean>;
}
