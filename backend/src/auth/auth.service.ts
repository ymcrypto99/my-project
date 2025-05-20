import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '../logger/logger.service';

// Mock user database for demonstration
// In a real application, this would be replaced with a database connection
const USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    name: 'Admin User',
    // hashed password for 'password123'
    password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
  },
];

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${username}`);
    
    const user = USERS.find(user => user.username === username);
    if (!user) {
      this.logger.warn(`User not found: ${username}`);
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${username}`);
      return null;
    }
    
    const { password: _, ...result } = user;
    this.logger.debug(`User validated: ${username}`);
    return result;
  }

  async login(user: any) {
    this.logger.debug(`Generating JWT token for user: ${user.username}`);
    
    const payload = { 
      sub: user.id, 
      username: user.username,
      email: user.email,
    };
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: { username: string; email: string; password: string; name: string }) {
    this.logger.debug(`Registering new user: ${userData.username}`);
    
    // Check if user already exists
    const existingUser = USERS.find(
      user => user.username === userData.username || user.email === userData.email
    );
    
    if (existingUser) {
      this.logger.warn(`User already exists: ${userData.username}`);
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create new user
    const newUser = {
      id: USERS.length + 1,
      username: userData.username,
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
    };
    
    // In a real application, this would save to a database
    USERS.push(newUser);
    
    this.logger.log(`User registered: ${userData.username}`);
    
    // Return user without password
    const { password: _, ...result } = newUser;
    return result;
  }

  validateToken(token: string) {
    try {
      this.logger.debug('Validating JWT token');
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      return null;
    }
  }
}
