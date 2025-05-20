import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
export declare class AuthService {
    private jwtService;
    private logger;
    constructor(jwtService: JwtService, logger: LoggerService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: any): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            name: any;
        };
        access_token: string;
    }>;
    register(userData: {
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
    validateToken(token: string): any;
}
