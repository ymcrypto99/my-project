var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
var LogContext = createContext(undefined);
export var useLogger = function () {
    var context = useContext(LogContext);
    if (!context) {
        throw new Error('useLogger must be used within a LogProvider');
    }
    return context;
};
// Re-export useLogger as useLog for compatibility with existing code
export var useLog = useLogger;
export var LogProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), userId = _b[0], setUserId = _b[1];
    // Get user ID from local storage on mount
    useEffect(function () {
        var user = localStorage.getItem('user');
        if (user) {
            try {
                var userData = JSON.parse(user);
                setUserId(userData.id);
            }
            catch (error) {
                console.error('Failed to parse user data from localStorage', error);
            }
        }
    }, []);
    // Send logs to backend
    var sendLogToBackend = function (level, message, context, stack, metadata) { return __awaiter(void 0, void 0, void 0, function () {
        var token, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, axios.post("".concat(import.meta.env.VITE_API_URL, "/logs/frontend"), {
                            level: level,
                            message: message,
                            context: context,
                            stack: stack,
                            userId: userId,
                            metadata: metadata,
                            userAgent: navigator.userAgent,
                            url: window.location.href,
                            timestamp: new Date().toISOString(),
                        }, {
                            headers: token ? { Authorization: "Bearer ".concat(token) } : {},
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    // If we can't send to backend, at least log to console
                    console.error('Failed to send log to backend:', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Log error with stack trace
    var logError = function (error, context, metadata) {
        if (context === void 0) { context = 'App'; }
        console.error("[".concat(context, "]"), error);
        // Also log to local storage for persistence
        var logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
        logs.push({
            level: 'error',
            message: error.message,
            stack: error.stack,
            context: context,
            metadata: metadata,
            timestamp: new Date().toISOString(),
        });
        // Keep only the last 50 logs to avoid storage issues
        if (logs.length > 50) {
            logs.shift();
        }
        localStorage.setItem('error_logs', JSON.stringify(logs));
        // Send to backend
        sendLogToBackend('error', error.message, context, error.stack, metadata);
    };
    // Log info message
    var logInfo = function (message, context, metadata) {
        if (context === void 0) { context = 'App'; }
        console.info("[".concat(context, "]"), message, metadata || '');
        // Send to backend
        sendLogToBackend('info', message, context, undefined, metadata);
    };
    // Log warning message
    var logWarning = function (message, context, metadata) {
        if (context === void 0) { context = 'App'; }
        console.warn("[".concat(context, "]"), message, metadata || '');
        // Send to backend
        sendLogToBackend('warning', message, context, undefined, metadata);
    };
    return (_jsx(LogContext.Provider, { value: { logError: logError, logInfo: logInfo, logWarning: logWarning }, children: children }));
};
