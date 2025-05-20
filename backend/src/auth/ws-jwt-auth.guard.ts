import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('WsJwtAuthGuard');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
    
    // Attach user to client for later use
    client.user = user;
    this.logger.debug(`WebSocket authenticated for user: ${user.username}`);
    
    return true;
  }

  private extractTokenFromHeader(header: string): string | undefined {
    if (!header) return undefined;
    
    const [type, token] = header.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
