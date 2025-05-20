import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private logger;
    constructor(authService: AuthService, logger: LoggerService);
    validate(username: string, password: string): Promise<any>;
}
export {};
