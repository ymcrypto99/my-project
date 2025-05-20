"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformConfigModule = void 0;
const common_1 = require("@nestjs/common");
const platform_config_service_1 = require("./platform-config.service");
const platform_config_controller_1 = require("./platform-config.controller");
const logger_module_1 = require("../logger/logger.module");
const exchange_module_1 = require("../exchange/exchange.module");
let PlatformConfigModule = class PlatformConfigModule {
};
exports.PlatformConfigModule = PlatformConfigModule;
exports.PlatformConfigModule = PlatformConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [logger_module_1.LoggerModule, exchange_module_1.ExchangeModule],
        controllers: [platform_config_controller_1.PlatformConfigController],
        providers: [platform_config_service_1.PlatformConfigService],
        exports: [platform_config_service_1.PlatformConfigService],
    })
], PlatformConfigModule);
//# sourceMappingURL=platform-config.module.js.map