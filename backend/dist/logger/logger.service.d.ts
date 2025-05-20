import { LoggerService as NestLoggerService } from '@nestjs/common';
import 'winston-daily-rotate-file';
export declare class LoggerService implements NestLoggerService {
    private context;
    private logger;
    constructor();
    setContext(context: string): void;
    log(message: string, ...optionalParams: any[]): void;
    error(message: string, ...optionalParams: any[]): void;
    warn(message: string, ...optionalParams: any[]): void;
    debug(message: string, ...optionalParams: any[]): void;
    verbose(message: string, ...optionalParams: any[]): void;
    logFrontendError(data: {
        message: string;
        stack?: string;
        context?: string;
        userId?: string;
        metadata?: any;
    }): void;
    private extractMetadata;
}
