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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Router>
            {/* LogProvider must come BEFORE AuthProvider since AuthProvider uses useLog */}
            <LogProvider>
              <AuthProvider>
                <WebSocketProvider>
                  <PlatformProvider>
                    <App />
                  </PlatformProvider>
                </WebSocketProvider>
              </AuthProvider>
            </LogProvider>
          </Router>
        </QueryClientProvider>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
