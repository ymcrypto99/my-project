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
// Create auth context
var AuthContext = createContext(undefined);
// Auth provider component
export var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = useState(false), isAuthenticated = _b[0], setIsAuthenticated = _b[1];
    var _c = useState(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState(null), user = _d[0], setUser = _d[1];
    var _e = useState(null), token = _e[0], setToken = _e[1];
    var _f = useState(null), error = _f[0], setError = _f[1];
    var _g = useLog(), info = _g.logInfo, logError = _g.logError;
    var apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    // Check for existing token on mount
    useEffect(function () {
        var checkAuth = function () { return __awaiter(void 0, void 0, void 0, function () {
            var storedToken, response, userData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storedToken = localStorage.getItem('token');
                        if (!storedToken) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        setIsLoading(true);
                        setToken(storedToken);
                        return [4 /*yield*/, fetch("".concat(apiUrl, "/api/auth/profile"), {
                                headers: {
                                    Authorization: "Bearer ".concat(storedToken)
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Failed to authenticate with stored token');
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        userData = _a.sent();
                        setUser(userData);
                        setIsAuthenticated(true);
                        setError(null);
                        info('User authenticated with stored token');
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        logError(err_1 instanceof Error ? err_1 : new Error(String(err_1)), 'Authentication failed with stored token');
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                        setIsAuthenticated(false);
                        setError('Authentication failed. Please log in again.');
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        setIsLoading(false);
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        checkAuth();
    }, [info, logError, apiUrl]);
    // Login function
    var login = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorData, _a, token_1, user_1, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 7]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch("".concat(apiUrl, "/api/auth/login"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ email: email, password: password })
                        })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _b.sent();
                    throw new Error(errorData.message || 'Login failed');
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    _a = _b.sent(), token_1 = _a.token, user_1 = _a.user;
                    localStorage.setItem('token', token_1);
                    setToken(token_1);
                    setUser(user_1);
                    setIsAuthenticated(true);
                    setError(null);
                    info('User logged in successfully', { userId: user_1.id });
                    return [3 /*break*/, 7];
                case 5:
                    err_2 = _b.sent();
                    logError(err_2 instanceof Error ? err_2 : new Error(String(err_2)), 'Login failed');
                    setError(err_2 instanceof Error ? err_2.message : 'Login failed. Please check your credentials.');
                    throw err_2;
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Register function
    var register = function (email, password, name) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorData, _a, token_2, user_2, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 7]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch("".concat(apiUrl, "/api/auth/register"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ email: email, password: password, name: name })
                        })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _b.sent();
                    throw new Error(errorData.message || 'Registration failed');
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    _a = _b.sent(), token_2 = _a.token, user_2 = _a.user;
                    localStorage.setItem('token', token_2);
                    setToken(token_2);
                    setUser(user_2);
                    setIsAuthenticated(true);
                    setError(null);
                    info('User registered successfully', { userId: user_2.id });
                    return [3 /*break*/, 7];
                case 5:
                    err_3 = _b.sent();
                    logError(err_3 instanceof Error ? err_3 : new Error(String(err_3)), 'Registration failed');
                    setError(err_3 instanceof Error ? err_3.message : 'Registration failed. Please try again.');
                    throw err_3;
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Logout function
    var logout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setIsLoading(true);
                    if (!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch("".concat(apiUrl, "/api/auth/logout"), {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(token)
                            }
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    info('User logged out');
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    logError(err_4 instanceof Error ? err_4 : new Error(String(err_4)), 'Logout error');
                    return [3 /*break*/, 5];
                case 4:
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                    setError(null);
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Update profile function
    var updateProfile = function (profileData) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorData, updatedUser, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch("".concat(apiUrl, "/api/auth/profile"), {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(token)
                            },
                            body: JSON.stringify(profileData)
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _a.sent();
                    throw new Error(errorData.message || 'Failed to update profile');
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    updatedUser = _a.sent();
                    setUser(updatedUser);
                    setError(null);
                    info('User profile updated', { userId: user === null || user === void 0 ? void 0 : user.id });
                    return [3 /*break*/, 7];
                case 5:
                    err_5 = _a.sent();
                    logError(err_5 instanceof Error ? err_5 : new Error(String(err_5)), 'Profile update failed');
                    setError(err_5 instanceof Error ? err_5.message : 'Failed to update profile.');
                    throw err_5;
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Change password function
    var changePassword = function (currentPassword, newPassword) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorData, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    setIsLoading(true);
                    return [4 /*yield*/, fetch("".concat(apiUrl, "/api/auth/change-password"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: "Bearer ".concat(token)
                            },
                            body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword })
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _a.sent();
                    throw new Error(errorData.message || 'Failed to change password');
                case 3:
                    setError(null);
                    info('User password changed', { userId: user === null || user === void 0 ? void 0 : user.id });
                    return [3 /*break*/, 6];
                case 4:
                    err_6 = _a.sent();
                    logError(err_6 instanceof Error ? err_6 : new Error(String(err_6)), 'Password change failed');
                    setError(err_6 instanceof Error ? err_6.message : 'Failed to change password.');
                    throw err_6;
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Context value
    var value = {
        isAuthenticated: isAuthenticated,
        isLoading: isLoading,
        user: user,
        token: token,
        error: error,
        login: login,
        register: register,
        logout: logout,
        updateProfile: updateProfile,
        changePassword: changePassword,
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
// Custom hook to use auth context
export var useAuth = function () {
    var context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
