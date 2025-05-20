import React from 'react';
export declare enum ExchangePlatform {
    BINANCE = "binance",
    KRAKEN = "kraken",
    BITFOREX = "bitforex",
    COINBASE = "coinbase"
}
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
interface PlatformContextType {
    config: PlatformConfig;
    isLoading: boolean;
    error: string | null;
    updatePlatform: (platform: ExchangePlatform) => Promise<void>;
    updateSimulationMode: (simulationMode: boolean) => Promise<void>;
    setApiKeys: (platform: ExchangePlatform, apiKey: string, apiSecret: string) => Promise<void>;
    checkApiKeys: (platform: ExchangePlatform) => Promise<boolean>;
}
export declare const PlatformProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const usePlatform: () => PlatformContextType;
export {};
