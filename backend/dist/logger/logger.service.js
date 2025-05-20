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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");
let LoggerService = class LoggerService {
    constructor() {
        const logDir = process.env.LOG_DIR || '../logs/backend';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            defaultMeta: { service: 'crypto-profit-seeker' },
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.printf((_a) => {
                        var { timestamp, level, message, context } = _a, meta = __rest(_a, ["timestamp", "level", "message", "context"]);
                        return `${timestamp} [${context || 'Global'}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                    })),
                }),
                new winston.transports.DailyRotateFile({
                    dirname: logDir,
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
                new winston.transports.DailyRotateFile({
                    dirname: logDir,
                    filename: 'error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '20m',
                    maxFiles: '14d',
                    level: 'error',
                }),
            ],
        });
    }
    setContext(context) {
        this.context = context;
    }
    log(message, ...optionalParams) {
        this.logger.info(message, Object.assign({ context: this.context }, this.extractMetadata(optionalParams)));
    }
    error(message, ...optionalParams) {
        this.logger.error(message, Object.assign({ context: this.context }, this.extractMetadata(optionalParams)));
    }
    warn(message, ...optionalParams) {
        this.logger.warn(message, Object.assign({ context: this.context }, this.extractMetadata(optionalParams)));
    }
    debug(message, ...optionalParams) {
        this.logger.debug(message, Object.assign({ context: this.context }, this.extractMetadata(optionalParams)));
    }
    verbose(message, ...optionalParams) {
        this.logger.verbose(message, Object.assign({ context: this.context }, this.extractMetadata(optionalParams)));
    }
    logFrontendError(data) {
        const { message, stack, context, userId, metadata } = data;
        this.logger.error(message, Object.assign({ context: context || 'Frontend', stack,
            userId, source: 'frontend' }, metadata));
        const frontendLogDir = path.join(process.env.LOG_DIR || '../logs', 'frontend');
        if (!fs.existsSync(frontendLogDir)) {
            fs.mkdirSync(frontendLogDir, { recursive: true });
        }
        fs.appendFileSync(path.join(frontendLogDir, `frontend-errors-${new Date().toISOString().split('T')[0]}.log`), `${new Date().toISOString()} [${context || 'Frontend'}] ERROR: ${message}\n${stack ? `Stack: ${stack}\n` : ''}${metadata ? `Metadata: ${JSON.stringify(metadata)}\n` : ''}\n`);
    }
    extractMetadata(optionalParams) {
        if (optionalParams.length === 0) {
            return {};
        }
        if (optionalParams[0] instanceof Error) {
            const error = optionalParams[0];
            return Object.assign({ error: {
                    message: error.message,
                    stack: error.stack,
                } }, optionalParams.slice(1).reduce((acc, param, index) => {
                if (typeof param === 'object' && param !== null) {
                    return Object.assign(Object.assign({}, acc), param);
                }
                return Object.assign(Object.assign({}, acc), { [`param${index + 1}`]: param });
            }, {}));
        }
        return optionalParams.reduce((acc, param, index) => {
            if (typeof param === 'object' && param !== null) {
                return Object.assign(Object.assign({}, acc), param);
            }
            return Object.assign(Object.assign({}, acc), { [`param${index + 1}`]: param });
        }, {});
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map