import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PlatformConfigService } from './platform-config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExchangePlatform } from '../exchange/exchange.service';
import { LoggerService } from '../logger/logger.service';

@Controller('platform-config')
@UseGuards(JwtAuthGuard)
export class PlatformConfigController {
  constructor(
    private platformConfigService: PlatformConfigService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('PlatformConfigController');
  }

  @Get()
  async getConfig() {
    this.logger.log('Getting platform configuration');
    return this.platformConfigService.getConfig();
  }

  @Post('platform')
  async updatePlatform(@Body() body: { platform: ExchangePlatform }) {
    this.logger.log(`Updating platform to ${body.platform}`);
    return this.platformConfigService.updatePlatform(body.platform);
  }

  @Post('simulation-mode')
  async updateSimulationMode(@Body() body: { enabled: boolean }) {
    this.logger.log(`Updating simulation mode to ${body.enabled}`);
    return this.platformConfigService.updateSimulationMode(body.enabled);
  }

  @Post('api-keys/:platform')
  async setApiKeys(
    @Param('platform') platform: ExchangePlatform,
    @Body() body: { apiKey: string; apiSecret: string },
  ) {
    this.logger.log(`Setting API keys for ${platform}`);
    return this.platformConfigService.setApiKeys(platform, body.apiKey, body.apiSecret);
  }

  @Get('validate-api-keys/:platform')
  async validateApiKeys(@Param('platform') platform: ExchangePlatform) {
    this.logger.log(`Validating API keys for ${platform}`);
    const isValid = await this.platformConfigService.validateApiKeys(platform);
    return { platform, isValid };
  }
}
