import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { LogProvider } from './contexts/LogContext';
import ErrorBoundary from './components/common/ErrorBoundary';
// Create React Query client
var queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(ChakraProvider, { theme: theme, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsx(LogProvider, { children: _jsx(AuthProvider, { children: _jsx(WebSocketProvider, { children: _jsx(PlatformProvider, { children: _jsx(App, {}) }) }) }) }) }) }) }) }) }));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);