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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const logger_service_1 = require("../logger/logger.service");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(logger) {
        super();
        this.logger = logger;
        this.logger.setContext('JwtAuthGuard');
    }
    canActivate(context) {
        this.logger.debug('Validating JWT for HTTP request');
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            this.logger.warn('JWT authentication failed', { error: err === null || err === void 0 ? void 0 : err.message, info: info === null || info === void 0 ? void 0 : info.message });
            throw err || new common_1.UnauthorizedException('Authentication failed');
        }
        this.logger.debug(`JWT authenticated for user: ${user.username}`);
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map