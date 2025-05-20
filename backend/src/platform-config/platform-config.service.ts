import { Injectable } from '@nestjs/common';
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

@Injectable()
export class PlatformConfigService {
  private config: PlatformConfig = {
    platform: ExchangePlatform.BINANCE,
    simulationMode: true,
    apiKeys: {
      [ExchangePlatform.BINANCE]: { hasKeys: false, isValid: false },
      [ExchangePlatform.KRAKEN]: { hasKeys: false, isValid: false },
      [ExchangePlatform.BITFOREX]: { hasKeys: false, isValid: false },
      [ExchangePlatform.COINBASE]: { hasKeys: false, isValid: false },
    },
  };

  constructor(
    private exchangeService: ExchangeService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('PlatformConfigService');
    this.logger.log('Platform config service initialized');
  }

  getConfig(): PlatformConfig {
    return { ...this.config };
  }

  async updatePlatform(platform: ExchangePlatform): Promise<PlatformConfig> {
    this.logger.log(`Updating platform to ${platform}`);
    this.config.platform = platform;
    return this.getConfig();
  }

  async updateSimulationMode(enabled: boolean): Promise<PlatformConfig> {
    this.logger.log(`Updating simulation mode to ${enabled}`);
    this.config.simulationMode = enabled;
    this.exchangeService.setSimulationMode(enabled);
    return this.getConfig();
  }

  async setApiKeys(platform: ExchangePlatform, apiKey: string, apiSecret: string): Promise<PlatformConfig> {
    this.logger.log(`Setting API keys for ${platform}`);
    
    // Set the API keys in the exchange service
    this.exchangeService.setApiCredentials(platform, apiKey, apiSecret);
    
    // Update the config to indicate that keys are set
    this.config.apiKeys[platform] = {
      hasKeys: true,
      isValid: false, // Will be validated separately
    };
    
    return this.getConfig();
  }

  async validateApiKeys(platform: ExchangePlatform): Promise<boolean> {
    this.logger.log(`Validating API keys for ${platform}`);
    
    if (!this.config.apiKeys[platform]?.hasKeys) {
      this.logger.warn(`No API keys set for ${platform}`);
      return false;
    }
    
    try {
      const isValid = await this.exchangeService.validateApiCredentials(platform);
      
      // Update the config with the validation result
      this.config.apiKeys[platform] = {
        hasKeys: true,
        isValid,
      };
      
      return isValid;
    } catch (error) {
      this.logger.error(`Error validating API keys for ${platform}`, error);
      
      // Update the config to indicate that keys are invalid
      this.config.apiKeys[platform] = {
        hasKeys: true,
        isValid: false,
      };
      
      return false;
    }
  }
}
