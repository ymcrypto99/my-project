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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformConfigController = void 0;
const common_1 = require("@nestjs/common");
const platform_config_service_1 = require("./platform-config.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const exchange_service_1 = require("../exchange/exchange.service");
const logger_service_1 = require("../logger/logger.service");
let PlatformConfigController = class PlatformConfigController {
    constructor(platformConfigService, logger) {
        this.platformConfigService = platformConfigService;
        this.logger = logger;
        this.logger.setContext('PlatformConfigController');
    }
    async getConfig() {
        this.logger.log('Getting platform configuration');
        return this.platformConfigService.getConfig();
    }
    async updatePlatform(body) {
        this.logger.log(`Updating platform to ${body.platform}`);
        return this.platformConfigService.updatePlatform(body.platform);
    }
    async updateSimulationMode(body) {
        this.logger.log(`Updating simulation mode to ${body.enabled}`);
        return this.platformConfigService.updateSimulationMode(body.enabled);
    }
    async setApiKeys(platform, body) {
        this.logger.log(`Setting API keys for ${platform}`);
        return this.platformConfigService.setApiKeys(platform, body.apiKey, body.apiSecret);
    }
    async validateApiKeys(platform) {
        this.logger.log(`Validating API keys for ${platform}`);
        const isValid = await this.platformConfigService.validateApiKeys(platform);
        return { platform, isValid };
    }
};
exports.PlatformConfigController = PlatformConfigController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Post)('platform'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlatformConfigController.prototype, "updatePlatform", null);
__decorate([
    (0, common_1.Post)('simulation-mode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlatformConfigController.prototype, "updateSimulationMode", null);
__decorate([
    (0, common_1.Post)('api-keys/:platform'),
    __param(0, (0, common_1.Param)('platform')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformConfigController.prototype, "setApiKeys", null);
__decorate([
    (0, common_1.Get)('validate-api-keys/:platform'),
    __param(0, (0, common_1.Param)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformConfigController.prototype, "validateApiKeys", null);
exports.PlatformConfigController = PlatformConfigController = __decorate([
    (0, common_1.Controller)('platform-config'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [platform_config_service_1.PlatformConfigService,
        logger_service_1.LoggerService])
], PlatformConfigController);
//# sourceMappingURL=platform-config.controller.js.map