import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private logger: LoggerService) {
    super();
    this.logger.setContext('LocalAuthGuard');
  }

  canActivate(context: ExecutionContext) {
    this.logger.debug('Validating local authentication');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.warn('Local authentication failed', { error: err?.message, info: info?.message });
      throw err || new Error('Authentication failed');
    }
    this.logger.debug(`Local authentication successful for user: ${user.username}`);
    return user;
  }
}
