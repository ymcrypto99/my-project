import { Strategy } from 'passport-jwt';
import { LoggerService } from '../logger/logger.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private logger;
    constructor(logger: LoggerService);
    validate(payload: any): Promise<{
        id: any;
        username: any;
        email: any;
    }>;
}
export {};
