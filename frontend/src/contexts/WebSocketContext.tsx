import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useLog } from './LogContext';

// Define WebSocket event types
export interface MarketDataEvent {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export interface OrderBookEvent {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  timestamp: number;
}

export interface TradeEvent {
  symbol: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface OrderEvent {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: string;
  price: number;
  quantity: number;
  status: string;
  timestamp: number;
}

export interface PortfolioEvent {
  balances: Record<string, number>;
  totalValue: number;
  timestamp: number;
}

// Define WebSocket context type
interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastPong: Date | null;
  subscribe: (channel: string, symbol?: string) => void;
  unsubscribe: (channel: string, symbol?: string) => void;
  marketData: Record<string, MarketDataEvent>;
  orderBooks: Record<string, OrderBookEvent>;
  recentTrades: Record<string, TradeEvent[]>;
  orders: OrderEvent[];
  portfolio: PortfolioEvent | null;
  connectionError: string | null;
}

// Create WebSocket context
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// WebSocket provider component
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const { info, warn, error } = useLog();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState<Date | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // State for different data types
  const [marketData, setMarketData] = useState<Record<string, MarketDataEvent>>({});
  const [orderBooks, setOrderBooks] = useState<Record<string, OrderBookEvent>>({});
  const [recentTrades, setRecentTrades] = useState<Record<string, TradeEvent[]>>({});
  const [orders, setOrders] = useState<OrderEvent[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioEvent | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    info('Initializing WebSocket connection', { url: WS_URL });
    
    // Create socket instance
    const socketInstance = io(WS_URL, {
      auth: {
        token
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Set up event listeners
    socketInstance.on('connect', () => {
      info('WebSocket connected');
      setIsConnected(true);
      setConnectionError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      warn(`WebSocket disconnected: ${reason}`);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      error('WebSocket connection error', err instanceof Error ? err : new Error(String(err)));
      setConnectionError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    socketInstance.on('pong', () => {
      setLastPong(new Date());
    });

    // Market data events
    socketInstance.on('marketData', (data: MarketDataEvent) => {
      setMarketData(prev => ({
        ...prev,
        [data.symbol]: data
      }));
    });

    // Order book events
    socketInstance.on('orderBook', (data: OrderBookEvent) => {
      setOrderBooks(prev => ({
        ...prev,
        [data.symbol]: data
      }));
    });

    // Trade events
    socketInstance.on('trade', (data: TradeEvent) => {
      setRecentTrades(prev => {
        const symbolTrades = prev[data.symbol] || [];
        const updatedTrades = [data, ...symbolTrades].slice(0, 100); // Keep last 100 trades
        
        return {
          ...prev,
          [data.symbol]: updatedTrades
        };
      });
    });

    // Order events
    socketInstance.on('order', (data: OrderEvent) => {
      setOrders(prev => {
        // Update or add order
        const orderIndex = prev.findIndex(order => order.id === data.id);
        if (orderIndex >= 0) {
          const updatedOrders = [...prev];
          updatedOrders[orderIndex] = data;
          return updatedOrders;
        } else {
          return [data, ...prev];
        }
      });
    });

    // Portfolio events
    socketInstance.on('portfolio', (data: PortfolioEvent) => {
      setPortfolio(data);
    });

    // Store socket instance
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      info('Closing WebSocket connection');
      socketInstance.disconnect();
    };
  }, [isAuthenticated, token, info, warn, error]);

  // Send ping every 30 seconds to keep connection alive
  useEffect(() => {
    if (!socket || !isConnected) return;

    const pingInterval = setInterval(() => {
      socket.emit('ping');
    }, 30000);

    return () => {
      clearInterval(pingInterval);
    };
  }, [socket, isConnected]);

  // Subscribe to a channel
  const subscribe = (channel: string, symbol?: string) => {
    if (!socket || !isConnected) {
      warn(`Cannot subscribe to ${channel}, socket not connected`);
      return;
    }
    
    info(`Subscribing to ${channel}${symbol ? ` for ${symbol}` : ''}`);
    socket.emit('subscribe', { channel, symbol });
  };

  // Unsubscribe from a channel
  const unsubscribe = (channel: string, symbol?: string) => {
    if (!socket || !isConnected) {
      warn(`Cannot unsubscribe from ${channel}, socket not connected`);
      return;
    }
    
    info(`Unsubscribing from ${channel}${symbol ? ` for ${symbol}` : ''}`);
    socket.emit('unsubscribe', { channel, symbol });
  };

  // Context value
  const value = {
    socket,
    isConnected,
    lastPong,
    subscribe,
    unsubscribe,
    marketData,
    orderBooks,
    recentTrades,
    orders,
    portfolio,
    connectionError
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
