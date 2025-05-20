import React from 'react';
interface LogContextProps {
    logError: (error: Error, context?: string, metadata?: any) => void;
    logInfo: (message: string, context?: string, metadata?: any) => void;
    logWarning: (message: string, context?: string, metadata?: any) => void;
}
export declare const useLogger: () => LogContextProps;
export declare const useLog: () => LogContextProps;
export declare const LogProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};
