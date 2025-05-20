import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private logger: LoggerService) {
    super();
    this.logger.setContext('JwtAuthGuard');
  }

  canActivate(context: ExecutionContext) {
    this.logger.debug('Validating JWT for HTTP request');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.warn('JWT authentication failed', { error: err?.message, info: info?.message });
      throw err || new UnauthorizedException('Authentication failed');
    }
    this.logger.debug(`JWT authenticated for user: ${user.username}`);
    return user;
  }
}
