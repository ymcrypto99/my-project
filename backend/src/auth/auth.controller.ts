import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('AuthController');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    this.logger.log(`User login: ${req.user.username}`);
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: { username: string; email: string; password: string; name: string }) {
    this.logger.log(`User registration attempt: ${registerDto.username}`);
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    this.logger.log(`Profile request for user: ${req.user.username}`);
    return req.user;
  }
}
