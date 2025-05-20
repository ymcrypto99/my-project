import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private logger: LoggerService,
  ) {
    super();
    this.logger.setContext('LocalStrategy');
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.debug(`Validating local strategy for user: ${username}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.warn(`Authentication failed for user: ${username}`);
      throw new Error('Invalid credentials');
    }
    return user;
  }
}
