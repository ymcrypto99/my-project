import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(private logger: LoggerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'crypto-profit-seeker-secret',
    });
    this.logger.setContext('WsJwtStrategy');
  }

  async validate(payload: any) {
    this.logger.debug(`Validating WebSocket JWT payload for user: ${payload.username}`);
    return { 
      id: payload.sub, 
      username: payload.username,
      email: payload.email
    };
  }
}
