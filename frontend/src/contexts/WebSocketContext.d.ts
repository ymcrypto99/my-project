import React from 'react';
import { Socket } from 'socket.io-client';
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
export declare const WebSocketProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useWebSocket: () => WebSocketContextType;
export {};
