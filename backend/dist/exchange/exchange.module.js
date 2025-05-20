"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeModule = void 0;
const common_1 = require("@nestjs/common");
const exchange_service_1 = require("./exchange.service");
const binance_service_1 = require("./binance.service");
const kraken_service_1 = require("./kraken.service");
const bitforex_service_1 = require("./bitforex.service");
const coinbase_service_1 = require("./coinbase.service");
const logger_module_1 = require("../logger/logger.module");
let ExchangeModule = class ExchangeModule {
};
exports.ExchangeModule = ExchangeModule;
exports.ExchangeModule = ExchangeModule = __decorate([
    (0, common_1.Module)({
        imports: [logger_module_1.LoggerModule],
        providers: [
            exchange_service_1.ExchangeService,
            binance_service_1.BinanceService,
            kraken_service_1.KrakenService,
            bitforex_service_1.BitforexService,
            coinbase_service_1.CoinbaseService,
        ],
        exports: [exchange_service_1.ExchangeService],
    })
], ExchangeModule);
//# sourceMappingURL=exchange.module.js.map