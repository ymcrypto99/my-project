"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_gateway_1 = require("./events.gateway");
const logger_module_1 = require("../logger/logger.module");
const exchange_module_1 = require("../exchange/exchange.module");
const auth_module_1 = require("../auth/auth.module");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [logger_module_1.LoggerModule, exchange_module_1.ExchangeModule, auth_module_1.AuthModule],
        providers: [events_gateway_1.EventsGateway],
        exports: [events_gateway_1.EventsGateway],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map