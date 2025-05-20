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
import { useLog } from './LogContext';
// Define platform types
export var ExchangePlatform;
(function (ExchangePlatform) {
    ExchangePlatform["BINANCE"] = "binance";
    ExchangePlatform["KRAKEN"] = "kraken";
    ExchangePlatform["BITFOREX"] = "bitforex";
    ExchangePlatform["COINBASE"] = "coinbase";
})(ExchangePlatform || (ExchangePlatform = {}));
// Create platform context
var PlatformContext = createContext(undefined);
// Platform provider component
export var PlatformProvider = function (_a) {
    var children = _a.children;
    var _b = useLog(), info = _b.info, logError = _b.error;
    var _c = useState({
        platform: ExchangePlatform.BINANCE,
        simulationMode: true,
        apiKeys: {}
    }), config = _c[0], setConfig = _c[1];
    var _d = useState(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    // Fetch platform config on mount
    useEffect(function () {
        var fetchConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        setIsLoading(true);
                        return [4 /*yield*/, fetch('/api/platform-config')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to fetch platform configuration');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setConfig(data);
                        setError(null);
                        info('Platform configuration loaded', { platform: data.platform, simulationMode: data.simulationMode });
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        logError('Failed to fetch platform config', err_1 instanceof Error ? err_1 : new Error(String(err_1)));
                        setError('Failed to load platform configuration');
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchConfig();
    }, [info, logError]);
    // Update platform
    var updatePlatform = function (platform) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch('/api/platform-config/platform', {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ platform: platform })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to update platform');
                    }
                    setConfig(function (prev) { return (__assign(__assign({}, prev), { platform: platform })); });
                    setError(null);
                    info('Platform updated', { platform: platform });
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    logError('Failed to update platform', err_2 instanceof Error ? err_2 : new Error(String(err_2)));
                    setError('Failed to update platform');
                    throw err_2;
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Update simulation mode
    var updateSimulationMode = function (simulationMode) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch('/api/platform-config/simulation-mode', {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ simulationMode: simulationMode })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to update simulation mode');
                    }
                    setConfig(function (prev) { return (__assign(__assign({}, prev), { simulationMode: simulationMode })); });
                    setError(null);
                    info('Simulation mode updated', { simulationMode: simulationMode });
                    return [3 /*break*/, 4];
                case 2:
                    err_3 = _a.sent();
                    logError('Failed to update simulation mode', err_3 instanceof Error ? err_3 : new Error(String(err_3)));
                    setError('Failed to update simulation mode');
                    throw err_3;
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Set API keys
    var setApiKeys = function (platform, apiKey, apiSecret) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch('/api/platform-config/api-keys', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ platform: platform, apiKey: apiKey, apiSecret: apiSecret })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to set API keys');
                    }
                    // Update the apiKeys state to show we have keys but need to validate
                    setConfig(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), { apiKeys: __assign(__assign({}, prev.apiKeys), (_a = {}, _a[platform] = {
                                hasKeys: true,
                                isValid: false
                            }, _a)) }));
                    });
                    setError(null);
                    info('API keys set', { platform: platform });
                    // Automatically check if the keys are valid
                    return [4 /*yield*/, checkApiKeys(platform)];
                case 2:
                    // Automatically check if the keys are valid
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    logError('Failed to set API keys', err_4 instanceof Error ? err_4 : new Error(String(err_4)));
                    setError('Failed to set API keys');
                    throw err_4;
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Check API keys
    var checkApiKeys = function (platform) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data_1, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch("/api/platform-config/api-keys/check/".concat(platform))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Failed to check API keys');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data_1 = _a.sent();
                    // Update the apiKeys state with validation result
                    setConfig(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), { apiKeys: __assign(__assign({}, prev.apiKeys), (_a = {}, _a[platform] = {
                                hasKeys: true,
                                isValid: data_1.valid
                            }, _a)) }));
                    });
                    setError(null);
                    info('API keys checked', { platform: platform, valid: data_1.valid });
                    return [2 /*return*/, data_1.valid];
                case 3:
                    err_5 = _a.sent();
                    logError('Failed to check API keys', err_5 instanceof Error ? err_5 : new Error(String(err_5)));
                    setError('Failed to check API keys');
                    return [2 /*return*/, false];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Context value
    var value = {
        config: config,
        isLoading: isLoading,
        error: error,
        updatePlatform: updatePlatform,
        updateSimulationMode: updateSimulationMode,
        setApiKeys: setApiKeys,
        checkApiKeys: checkApiKeys,
    };
    return (_jsx(PlatformContext.Provider, { value: value, children: children }));
};
// Custom hook to use platform context
export var usePlatform = function () {
    var context = useContext(PlatformContext);
    if (context === undefined) {
        throw new Error('usePlatform must be used within a PlatformProvider');
    }
    return context;
};
