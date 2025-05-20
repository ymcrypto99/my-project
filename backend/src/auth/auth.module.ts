import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { WsJwtStrategy } from './ws-jwt.strategy';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'crypto-profit-seeker-secret',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, WsJwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
