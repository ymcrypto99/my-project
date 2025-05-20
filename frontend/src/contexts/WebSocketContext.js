var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useLog } from './LogContext';
// Create WebSocket context
var WebSocketContext = createContext(undefined);
// WebSocket provider component
export var WebSocketProvider = function (_a) {
    var children = _a.children;
    var _b = useAuth(), isAuthenticated = _b.isAuthenticated, token = _b.token;
    var _c = useLog(), info = _c.info, warn = _c.warn, error = _c.error;
    var _d = useState(null), socket = _d[0], setSocket = _d[1];
    var _e = useState(false), isConnected = _e[0], setIsConnected = _e[1];
    var _f = useState(null), lastPong = _f[0], setLastPong = _f[1];
    var _g = useState(null), connectionError = _g[0], setConnectionError = _g[1];
    // State for different data types
    var _h = useState({}), marketData = _h[0], setMarketData = _h[1];
    var _j = useState({}), orderBooks = _j[0], setOrderBooks = _j[1];
    var _k = useState({}), recentTrades = _k[0], setRecentTrades = _k[1];
    var _l = useState([]), orders = _l[0], setOrders = _l[1];
    var _m = useState(null), portfolio = _m[0], setPortfolio = _m[1];
    // Initialize WebSocket connection
    useEffect(function () {
        if (!isAuthenticated || !token) {
            return;
        }
        var WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
        info('Initializing WebSocket connection', { url: WS_URL });
        // Create socket instance
        var socketInstance = io(WS_URL, {
            auth: {
                token: token
            },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });
        // Set up event listeners
        socketInstance.on('connect', function () {
            info('WebSocket connected');
            setIsConnected(true);
            setConnectionError(null);
        });
        socketInstance.on('disconnect', function (reason) {
            warn("WebSocket disconnected: ".concat(reason));
            setIsConnected(false);
        });
        socketInstance.on('connect_error', function (err) {
            error('WebSocket connection error', err instanceof Error ? err : new Error(String(err)));
            setConnectionError("Connection error: ".concat(err.message));
            setIsConnected(false);
        });
        socketInstance.on('pong', function () {
            setLastPong(new Date());
        });
        // Market data events
        socketInstance.on('marketData', function (data) {
            setMarketData(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[data.symbol] = data, _a)));
            });
        });
        // Order book events
        socketInstance.on('orderBook', function (data) {
            setOrderBooks(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[data.symbol] = data, _a)));
            });
        });
        // Trade events
        socketInstance.on('trade', function (data) {
            setRecentTrades(function (prev) {
                var _a;
                var symbolTrades = prev[data.symbol] || [];
                var updatedTrades = __spreadArray([data], symbolTrades, true).slice(0, 100); // Keep last 100 trades
                return __assign(__assign({}, prev), (_a = {}, _a[data.symbol] = updatedTrades, _a));
            });
        });
        // Order events
        socketInstance.on('order', function (data) {
            setOrders(function (prev) {
                // Update or add order
                var orderIndex = prev.findIndex(function (order) { return order.id === data.id; });
                if (orderIndex >= 0) {
                    var updatedOrders = __spreadArray([], prev, true);
                    updatedOrders[orderIndex] = data;
                    return updatedOrders;
                }
                else {
                    return __spreadArray([data], prev, true);
                }
            });
        });
        // Portfolio events
        socketInstance.on('portfolio', function (data) {
            setPortfolio(data);
        });
        // Store socket instance
        setSocket(socketInstance);
        // Clean up on unmount
        return function () {
            info('Closing WebSocket connection');
            socketInstance.disconnect();
        };
    }, [isAuthenticated, token, info, warn, error]);
    // Send ping every 30 seconds to keep connection alive
    useEffect(function () {
        if (!socket || !isConnected)
            return;
        var pingInterval = setInterval(function () {
            socket.emit('ping');
        }, 30000);
        return function () {
            clearInterval(pingInterval);
        };
    }, [socket, isConnected]);
    // Subscribe to a channel
    var subscribe = function (channel, symbol) {
        if (!socket || !isConnected) {
            warn("Cannot subscribe to ".concat(channel, ", socket not connected"));
            return;
        }
        info("Subscribing to ".concat(channel).concat(symbol ? " for ".concat(symbol) : ''));
        socket.emit('subscribe', { channel: channel, symbol: symbol });
    };
    // Unsubscribe from a channel
    var unsubscribe = function (channel, symbol) {
        if (!socket || !isConnected) {
            warn("Cannot unsubscribe from ".concat(channel, ", socket not connected"));
            return;
        }
        info("Unsubscribing from ".concat(channel).concat(symbol ? " for ".concat(symbol) : ''));
        socket.emit('unsubscribe', { channel: channel, symbol: symbol });
    };
    // Context value
    var value = {
        socket: socket,
        isConnected: isConnected,
        lastPong: lastPong,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        marketData: marketData,
        orderBooks: orderBooks,
        recentTrades: recentTrades,
        orders: orders,
        portfolio: portfolio,
        connectionError: connectionError
    };
    return (_jsx(WebSocketContext.Provider, { value: value, children: children }));
};
// Custom hook to use WebSocket context
export var useWebSocket = function () {
    var context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
