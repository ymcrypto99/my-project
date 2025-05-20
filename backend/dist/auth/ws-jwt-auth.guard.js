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
exports.WsJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const logger_service_1 = require("../logger/logger.service");
let WsJwtAuthGuard = class WsJwtAuthGuard {
    constructor(authService, logger) {
        this.authService = authService;
        this.logger = logger;
        this.logger.setContext('WsJwtAuthGuard');
    }
    canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = this.extractTokenFromHeader(client.handshake.headers.authorization);
        if (!token) {
            this.logger.warn('WebSocket connection attempt without token');
            return false;
        }
        const user = this.authService.validateToken(token);
        if (!user) {
            this.logger.warn('WebSocket connection attempt with invalid token');
            return false;
        }
        client.user = user;
        this.logger.debug(`WebSocket authenticated for user: ${user.username}`);
        return true;
    }
    extractTokenFromHeader(header) {
        if (!header)
            return undefined;
        const [type, token] = header.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
};
exports.WsJwtAuthGuard = WsJwtAuthGuard;
exports.WsJwtAuthGuard = WsJwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        logger_service_1.LoggerService])
], WsJwtAuthGuard);
//# sourceMappingURL=ws-jwt-auth.guard.js.map