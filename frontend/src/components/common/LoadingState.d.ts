import React from 'react';
interface LoadingStateProps {
    isLoading: boolean;
    error: string | null;
    onRetry?: () => void;
    children: React.ReactNode;
    loadingText?: string;
    minHeight?: string;
}
declare const LoadingState: React.FC<LoadingStateProps>;
export default LoadingState;
