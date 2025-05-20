import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';
export declare class WsJwtAuthGuard implements CanActivate {
    private authService;
    private logger;
    constructor(authService: AuthService, logger: LoggerService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private extractTokenFromHeader;
}
