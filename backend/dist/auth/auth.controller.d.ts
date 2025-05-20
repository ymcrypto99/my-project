import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';
export declare class AuthController {
    private authService;
    private logger;
    constructor(authService: AuthService, logger: LoggerService);
    login(req: any): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            name: any;
        };
        access_token: string;
    }>;
    register(registerDto: {
        username: string;
        email: string;
        password: string;
        name: string;
    }): Promise<{
        id: number;
        username: string;
        email: string;
        name: string;
    }>;
    getProfile(req: any): any;
}
