import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface LogEntry {
  id?: string;
  level: 'error' | 'info' | 'warning' | 'debug' | 'warn';
  message: string;
  stack?: string;
  context: string;
  metadata?: any;
  timestamp: string;
  details?: any;
}

export interface LogContextProps {
  logError: (error: Error | string, context?: string | any, metadata?: any) => void;
  logInfo: (message: string, context?: string | any, metadata?: any) => void;
  logWarning: (message: string, context?: string | any, metadata?: any) => void;
  logDebug: (message: string, context?: string | any, metadata?: any) => void;
  // Aliases for backward compatibility
  info: (message: string, context?: string | any) => void;
  error: (message: string | Error, context?: string | any) => void;
  warn: (message: string, context?: string | any) => void;
  debug: (message: string, context?: string | any) => void;
  // Additional properties used in Settings.tsx
  logs: LogEntry[];
  clearLogs: () => void;
}

const LogContext = createContext<LogContextProps | undefined>(undefined);

export const useLogger = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogger must be used within a LogProvider');
  }
  return context;
};

// Re-export useLogger as useLog for compatibility with existing code
export const useLog = useLogger;

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Get user ID from local storage on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserId(userData.id);
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
      }
    }
    
    // Load logs from localStorage
    try {
      const storedLogs = localStorage.getItem('error_logs');
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        // Add id to each log for React key prop
        const logsWithIds = parsedLogs.map((log: LogEntry, index: number) => ({
          ...log,
          id: `log-${index}`
        }));
        setLogs(logsWithIds);
      }
    } catch (error) {
      console.error('Failed to load logs from localStorage', error);
    }
  }, []);

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('error_logs');
  };

  // Send logs to backend
  const sendLogToBackend = async (
    level: 'error' | 'info' | 'warning' | 'debug' | 'warn',
    message: string,
    context: string,
    stack?: string,
    metadata?: any
  ) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logs/frontend`,
        {
          level,
          message,
          context,
          stack,
          userId,
          metadata,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
    } catch (err) {
      // If we can't send to backend, at least log to console
      console.error('Failed to send log to backend:', err);
    }
  };

  // Process context and metadata arguments
  const processArgs = (contextOrMetadata: string | any): { context: string; metadata: any } => {
    if (typeof contextOrMetadata === 'string') {
      return { context: contextOrMetadata, metadata: undefined };
    } else {
      return { context: 'App', metadata: contextOrMetadata };
    }
  };

  // Log error with stack trace
  const logError = (error: Error | string, contextOrMetadata: string | any = 'App', metadata?: any) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const { context, metadata: metadataFromContext } = processArgs(contextOrMetadata);
    const finalMetadata = metadata || metadataFromContext;
    
    console.error(`[${context}]`, errorObj);
    
    // Create log entry
    const logEntry: LogEntry = {
      id: `log-${Date.now()}`,
      level: 'error',
      message: errorObj.message,
      stack: errorObj.stack,
      context,
      metadata: finalMetadata,
      timestamp: new Date().toISOString(),
      details: finalMetadata
    };
    
    // Update state
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      // Keep only the last 50 logs to avoid storage issues
      if (newLogs.length > 50) {
        newLogs.shift();
      }
      
      // Update localStorage
      localStorage.setItem('error_logs', JSON.stringify(newLogs));
      
      return newLogs;
    });
    
    // Send to backend
    sendLogToBackend('error', errorObj.message, context, errorObj.stack, finalMetadata);
  };

  // Log info message
  const logInfo = (message: string, contextOrMetadata: string | any = 'App', metadata?: any) => {
    const { context, metadata: metadataFromContext } = processArgs(contextOrMetadata);
    const finalMetadata = metadata || metadataFromContext;
    
    console.info(`[${context}]`, message, finalMetadata || '');
    
    // Create log entry
    const logEntry: LogEntry = {
      id: `log-${Date.now()}`,
      level: 'info',
      message,
      context,
      metadata: finalMetadata,
      timestamp: new Date().toISOString(),
      details: finalMetadata
    };
    
    // Update state
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      // Keep only the last 50 logs to avoid storage issues
      if (newLogs.length > 50) {
        newLogs.shift();
      }
      
      return newLogs;
    });
    
    // Send to backend
    sendLogToBackend('info', message, context, undefined, finalMetadata);
  };

  // Log warning message
  const logWarning = (message: string, contextOrMetadata: string | any = 'App', metadata?: any) => {
    const { context, metadata: metadataFromContext } = processArgs(contextOrMetadata);
    const finalMetadata = metadata || metadataFromContext;
    
    console.warn(`[${context}]`, message, finalMetadata || '');
    
    // Create log entry
    const logEntry: LogEntry = {
      id: `log-${Date.now()}`,
      level: 'warning',
      message,
      context,
      metadata: finalMetadata,
      timestamp: new Date().toISOString(),
      details: finalMetadata
    };
    
    // Update state
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      // Keep only the last 50 logs to avoid storage issues
      if (newLogs.length > 50) {
        newLogs.shift();
      }
      
      return newLogs;
    });
    
    // Send to backend
    sendLogToBackend('warning', message, context, undefined, finalMetadata);
  };

  // Log debug message
  const logDebug = (message: string, contextOrMetadata: string | any = 'App', metadata?: any) => {
    const { context, metadata: metadataFromContext } = processArgs(contextOrMetadata);
    const finalMetadata = metadata || metadataFromContext;
    
    console.debug(`[${context}]`, message, finalMetadata || '');
    
    // Create log entry
    const logEntry: LogEntry = {
      id: `log-${Date.now()}`,
      level: 'debug',
      message,
      context,
      metadata: finalMetadata,
      timestamp: new Date().toISOString(),
      details: finalMetadata
    };
    
    // Update state
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, logEntry];
      // Keep only the last 50 logs to avoid storage issues
      if (newLogs.length > 50) {
        newLogs.shift();
      }
      
      return newLogs;
    });
    
    // Send to backend
    sendLogToBackend('debug', message, context, undefined, finalMetadata);
  };

  // Alias functions for backward compatibility
  const info = (message: string, contextOrMetadata: any = 'App') => {
    logInfo(message, contextOrMetadata);
  };

  const error = (messageOrError: string | Error, contextOrMetadata: any = 'App') => {
    logError(messageOrError, contextOrMetadata);
  };

  const warn = (message: string, contextOrMetadata: any = 'App') => {
    logWarning(message, contextOrMetadata);
  };

  const debug = (message: string, contextOrMetadata: any = 'App') => {
    logDebug(message, contextOrMetadata);
  };

  return (
    <LogContext.Provider value={{ 
      logError, 
      logInfo, 
      logWarning,
      logDebug,
      info,
      error,
      warn,
      debug,
      logs,
      clearLogs
    }}>
      {children}
    </LogContext.Provider>
  );
};
