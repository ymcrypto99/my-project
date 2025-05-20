import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLog } from './LogContext';

// Define platform types
export enum ExchangePlatform {
  BINANCE = 'binance',
  KRAKEN = 'kraken',
  BITFOREX = 'bitforex',
  COINBASE = 'coinbase',
}

// At the top of your PlatformContext component
/*let logInfo = console.info;
let logError = console.error;
try {
  const logContext = useLog( );
  logInfo = logContext.logInfo || logContext.info || console.info;
  logError = logContext.logError || logContext.error || console.error;
} catch (e) {
  console.warn("LogContext not available, using console fallbacks");
}*/
const safeLog = () => {
  try {
    const logContext = useLog();
    return {
      info: logContext.info || logContext.logInfo || console.info,
      error: logContext.error || logContext.logError || console.error,
      warn: logContext.warn || logContext.logWarning || console.warn,
      debug: logContext.debug || logContext.logDebug || console.debug
    };
  } catch (e) {
    console.warn("LogContext not available, using console fallbacks");
    return {
      info: console.info,
      error: console.error,
      warn: console.warn,
      debug: console.debug
    };
  }
};

const logger = safeLog();
const logInfo = logger.info;
const logError = logger.error;
const logWarning = logger.warn;
const logDebug = logger.debug;


// Define platform config interface
export interface PlatformConfig {
  platform: ExchangePlatform;
  simulationMode: boolean;
  apiKeys: {
    [key in ExchangePlatform]?: {
      hasKeys: boolean;
      isValid: boolean;
    };
  };
}

// Define platform context type
interface PlatformContextType {
  config: PlatformConfig;
  isLoading: boolean;
  error: string | null;
  updatePlatform: (platform: ExchangePlatform) => Promise<void>;
  updateSimulationMode: (simulationMode: boolean) => Promise<void>;
  setApiKeys: (platform: ExchangePlatform, apiKey: string, apiSecret: string) => Promise<void>;
  checkApiKeys: (platform: ExchangePlatform) => Promise<boolean>;
}

// Create platform context
const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

// Platform provider component
export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { info, error: logError } = useLog();
  const [config, setConfig] = useState<PlatformConfig>({
    platform: ExchangePlatform.BINANCE,
    simulationMode: true,
    apiKeys: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe logging functions
  const safeLog = () => {
    try {
      return useLog();
    } catch (e) {
      console.warn("LogContext not available, using console fallbacks");
      return {
        info: console.info,
        error: console.error,
        warn: console.warn,
        debug: console.debug,
        logInfo: console.info,
        logError: console.error,
        logWarning: console.warn,
        logDebug: console.debug
      };
    }
  };
  
  const logger = safeLog();

  // Fetch platform config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/platform-config');
        
        if (!response.ok) {
          throw new Error('Failed to fetch platform configuration');
        }
        
        const data = await response.json();
        setConfig(data);
        setError(null);
        info('Platform configuration loaded', { platform: data.platform, simulationMode: data.simulationMode });
      } catch (err) {
        logError('Failed to fetch platform config', err instanceof Error ? err : new Error(String(err)));
        setError('Failed to load platform configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [info, logError]);

  // Update platform
  const updatePlatform = async (platform: ExchangePlatform) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/platform-config/platform', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update platform');
      }
      
      setConfig(prev => ({ ...prev, platform }));
      setError(null);
      info('Platform updated', { platform });
    } catch (err) {
      logError('Failed to update platform', err instanceof Error ? err : new Error(String(err)));
      setError('Failed to update platform');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update simulation mode
  const updateSimulationMode = async (simulationMode: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/platform-config/simulation-mode', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ simulationMode })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update simulation mode');
      }
      
      setConfig(prev => ({ ...prev, simulationMode }));
      setError(null);
      info('Simulation mode updated', { simulationMode });
    } catch (err) {
      logError('Failed to update simulation mode', err instanceof Error ? err : new Error(String(err)));
      setError('Failed to update simulation mode');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Set API keys
  const setApiKeys = async (platform: ExchangePlatform, apiKey: string, apiSecret: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/platform-config/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform, apiKey, apiSecret })
      });
      
      if (!response.ok) {
        throw new Error('Failed to set API keys');
      }
      
      // Update the apiKeys state to show we have keys but need to validate
      setConfig(prev => ({
        ...prev,
        apiKeys: {
          ...prev.apiKeys,
          [platform]: {
            hasKeys: true,
            isValid: false
          }
        }
      }));
      
      setError(null);
      info('API keys set', { platform });
      
      // Automatically check if the keys are valid
      await checkApiKeys(platform);
    } catch (err) {
      logError('Failed to set API keys', err instanceof Error ? err : new Error(String(err)));
      setError('Failed to set API keys');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Check API keys
  const checkApiKeys = async (platform: ExchangePlatform): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/platform-config/api-keys/check/${platform}`);
      
      if (!response.ok) {
        throw new Error('Failed to check API keys');
      }
      
      const data = await response.json();
      
      // Update the apiKeys state with validation result
      setConfig(prev => ({
        ...prev,
        apiKeys: {
          ...prev.apiKeys,
          [platform]: {
            hasKeys: true,
            isValid: data.valid
          }
        }
      }));
      
      setError(null);
      info('API keys checked', { platform, valid: data.valid });
      return data.valid;
    } catch (err) {
      logError('Failed to check API keys', err instanceof Error ? err : new Error(String(err)));
      setError('Failed to check API keys');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    config,
    isLoading,
    error,
    updatePlatform,
    updateSimulationMode,
    setApiKeys,
    checkApiKeys,
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

// Custom hook to use platform context
export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
