import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context: string;
  private logger: winston.Logger;

  constructor() {
    const logDir = process.env.LOG_DIR || '../logs/backend';
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Configure Winston logger
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'crypto-profit-seeker' },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              return `${timestamp} [${context || 'Global'}] ${level}: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ''
              }`;
            }),
          ),
        }),
        
        // File transport with daily rotation
        new winston.transports.DailyRotateFile({
          dirname: logDir,
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        
        // Error file transport
        new winston.transports.DailyRotateFile({
          dirname: logDir,
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
      ],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, ...optionalParams: any[]) {
    this.logger.info(message, { context: this.context, ...this.extractMetadata(optionalParams) });
  }

  error(message: string, ...optionalParams: any[]) {
    this.logger.error(message, { context: this.context, ...this.extractMetadata(optionalParams) });
  }

  warn(message: string, ...optionalParams: any[]) {
    this.logger.warn(message, { context: this.context, ...this.extractMetadata(optionalParams) });
  }

  debug(message: string, ...optionalParams: any[]) {
    this.logger.debug(message, { context: this.context, ...this.extractMetadata(optionalParams) });
  }

  verbose(message: string, ...optionalParams: any[]) {
    this.logger.verbose(message, { context: this.context, ...this.extractMetadata(optionalParams) });
  }

  // Method to log frontend errors
  logFrontendError(data: { message: string; stack?: string; context?: string; userId?: string; metadata?: any }) {
    const { message, stack, context, userId, metadata } = data;
    
    this.logger.error(message, {
      context: context || 'Frontend',
      stack,
      userId,
      source: 'frontend',
      ...metadata,
    });
    
    // Also save to a separate frontend log file
    const frontendLogDir = path.join(process.env.LOG_DIR || '../logs', 'frontend');
    
    // Create frontend logs directory if it doesn't exist
    if (!fs.existsSync(frontendLogDir)) {
      fs.mkdirSync(frontendLogDir, { recursive: true });
    }
    
    // Append to frontend log file
    fs.appendFileSync(
      path.join(frontendLogDir, `frontend-errors-${new Date().toISOString().split('T')[0]}.log`),
      `${new Date().toISOString()} [${context || 'Frontend'}] ERROR: ${message}\n${stack ? `Stack: ${stack}\n` : ''}${
        metadata ? `Metadata: ${JSON.stringify(metadata)}\n` : ''
      }\n`
    );
  }

  // Helper method to extract metadata from optional params
  private extractMetadata(optionalParams: any[]): any {
    if (optionalParams.length === 0) {
      return {};
    }

    // If the first param is an Error, extract message and stack
    if (optionalParams[0] instanceof Error) {
      const error = optionalParams[0];
      return {
        error: {
          message: error.message,
          stack: error.stack,
        },
        ...optionalParams.slice(1).reduce((acc, param, index) => {
          if (typeof param === 'object' && param !== null) {
            return { ...acc, ...param };
          }
          return { ...acc, [`param${index + 1}`]: param };
        }, {}),
      };
    }

    // Otherwise, combine all params into metadata
    return optionalParams.reduce((acc, param, index) => {
      if (typeof param === 'object' && param !== null) {
        return { ...acc, ...param };
      }
      return { ...acc, [`param${index + 1}`]: param };
    }, {});
  }
}
