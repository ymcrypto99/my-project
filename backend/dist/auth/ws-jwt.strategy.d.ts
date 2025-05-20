import { Strategy } from 'passport-jwt';
import { LoggerService } from '../logger/logger.service';
declare const WsJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class WsJwtStrategy extends WsJwtStrategy_base {
    private logger;
    constructor(logger: LoggerService);
    validate(payload: any): Promise<{
        id: any;
        username: any;
        email: any;
    }>;
}
export {};
