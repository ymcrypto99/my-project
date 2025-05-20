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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, Text, Card, CardHeader, CardBody, Flex, HStack, VStack, Button, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel, Input, InputGroup, InputRightElement, Select, Switch, IconButton, Divider, useColorMode, useColorModeValue, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure, } from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff, MdSave, MdDelete, MdRefresh } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { usePlatform, ExchangePlatform } from '../contexts/PlatformContext';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
var Settings = function () {
    var _a = useColorMode(), colorMode = _a.colorMode, toggleColorMode = _a.toggleColorMode;
    var _b = useAuth(), user = _b.user, updateProfile = _b.updateProfile, changePassword = _b.changePassword, logout = _b.logout;
    var _c = usePlatform(), config = _c.config, updatePlatform = _c.updatePlatform, updateSimulationMode = _c.updateSimulationMode, setApiKeys = _c.setApiKeys, checkApiKeys = _c.checkApiKeys;
    var _d = useLog(), logs = _d.logs, clearLogs = _d.clearLogs, info = _d.info, logError = _d.error;
    var toast = useToast();
    var _e = useDisclosure(), isOpen = _e.isOpen, onOpen = _e.onOpen, onClose = _e.onClose;
    var cancelRef = React.useRef(null);
    var _f = useState(true), isLoading = _f[0], setIsLoading = _f[1];
    var _g = useState(null), loadError = _g[0], setLoadError = _g[1];
    var _h = useState(0), tabIndex = _h[0], setTabIndex = _h[1];
    // Profile form state
    var _j = useState(''), name = _j[0], setName = _j[1];
    var _k = useState(''), email = _k[0], setEmail = _k[1];
    // Password form state
    var _l = useState(''), currentPassword = _l[0], setCurrentPassword = _l[1];
    var _m = useState(''), newPassword = _m[0], setNewPassword = _m[1];
    var _o = useState(''), confirmPassword = _o[0], setConfirmPassword = _o[1];
    var _p = useState(false), showCurrentPassword = _p[0], setShowCurrentPassword = _p[1];
    var _q = useState(false), showNewPassword = _q[0], setShowNewPassword = _q[1];
    // API Keys form state
    var _r = useState(ExchangePlatform.BINANCE), selectedPlatform = _r[0], setSelectedPlatform = _r[1];
    var _s = useState(''), apiKey = _s[0], setApiKey = _s[1];
    var _t = useState(''), apiSecret = _t[0], setApiSecret = _t[1];
    var _u = useState(false), showApiSecret = _u[0], setShowApiSecret = _u[1];
    // Colors
    var cardBg = useColorModeValue('white', 'gray.800');
    var borderColor = useColorModeValue('gray.200', 'gray.700');
    // Log component mount
    useEffect(function () {
        info('Settings component mounted');
        // Simulate loading data
        var timer = setTimeout(function () {
            setIsLoading(false);
            // Set initial form values
            if (user) {
                setName(user.name || '');
                setEmail(user.email || '');
            }
        }, 1500);
        return function () {
            clearTimeout(timer);
            info('Settings component unmounted');
        };
    }, [info, user]);
    // Handle tab change
    var handleTabChange = function (index) {
        setTabIndex(index);
        info('Settings tab changed', { tabIndex: index });
    };
    // Handle profile update
    var handleProfileUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateProfile({ name: name, email: email })];
                case 1:
                    _a.sent();
                    toast({
                        title: 'Profile Updated',
                        description: 'Your profile has been updated successfully.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    info('Profile updated', { name: name, email: email });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Failed to update profile';
                    logError('Profile update failed', err_1 instanceof Error ? err_1 : new Error(errorMessage));
                    toast({
                        title: 'Update Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle password change
    var handlePasswordChange = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!currentPassword || !newPassword || !confirmPassword) {
                        throw new Error('All password fields are required');
                    }
                    if (newPassword !== confirmPassword) {
                        throw new Error('New passwords do not match');
                    }
                    return [4 /*yield*/, changePassword(currentPassword, newPassword)];
                case 1:
                    _a.sent();
                    toast({
                        title: 'Password Changed',
                        description: 'Your password has been changed successfully.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    // Clear password fields
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    info('Password changed');
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Failed to change password';
                    logError('Password change failed', err_2 instanceof Error ? err_2 : new Error(errorMessage));
                    toast({
                        title: 'Password Change Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle platform change
    var handlePlatformChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var platform, err_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    platform = e.target.value;
                    setSelectedPlatform(platform);
                    return [4 /*yield*/, updatePlatform(platform)];
                case 1:
                    _a.sent();
                    toast({
                        title: 'Platform Updated',
                        description: "Platform changed to ".concat(platform),
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    info('Platform updated', { platform: platform });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Failed to update platform';
                    logError('Platform update failed', err_3 instanceof Error ? err_3 : new Error(errorMessage));
                    toast({
                        title: 'Update Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle simulation mode toggle
    var handleSimulationModeToggle = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newMode, err_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    newMode = !config.simulationMode;
                    return [4 /*yield*/, updateSimulationMode(newMode)];
                case 1:
                    _a.sent();
                    toast({
                        title: newMode ? 'Simulation Mode Enabled' : 'Live Trading Enabled',
                        description: newMode
                            ? 'You are now in simulation mode. No real trades will be executed.'
                            : 'You are now in live trading mode. Real trades will be executed.',
                        status: 'info',
                        duration: 5000,
                        isClosable: true,
                    });
                    info('Simulation mode updated', { simulationMode: newMode });
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    errorMessage = err_4 instanceof Error ? err_4.message : 'Failed to update simulation mode';
                    logError('Simulation mode update failed', err_4 instanceof Error ? err_4 : new Error(errorMessage));
                    toast({
                        title: 'Update Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle API keys save
    var handleSaveApiKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_5, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!apiKey || !apiSecret) {
                        throw new Error('API Key and Secret are required');
                    }
                    return [4 /*yield*/, setApiKeys(selectedPlatform, apiKey, apiSecret)];
                case 1:
                    _a.sent();
                    toast({
                        title: 'API Keys Saved',
                        description: "API keys for ".concat(selectedPlatform, " have been saved."),
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    // Clear API key fields
                    setApiKey('');
                    setApiSecret('');
                    info('API keys saved', { platform: selectedPlatform });
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    errorMessage = err_5 instanceof Error ? err_5.message : 'Failed to save API keys';
                    logError('API keys save failed', err_5 instanceof Error ? err_5 : new Error(errorMessage));
                    toast({
                        title: 'Save Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle check API keys
    var handleCheckApiKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isValid, err_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, checkApiKeys(selectedPlatform)];
                case 1:
                    isValid = _a.sent();
                    toast({
                        title: isValid ? 'API Keys Valid' : 'API Keys Invalid',
                        description: isValid
                            ? "Your ".concat(selectedPlatform, " API keys are valid.")
                            : "Your ".concat(selectedPlatform, " API keys are invalid or have insufficient permissions."),
                        status: isValid ? 'success' : 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    info('API keys checked', { platform: selectedPlatform, valid: isValid });
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _a.sent();
                    errorMessage = err_6 instanceof Error ? err_6.message : 'Failed to check API keys';
                    logError('API keys check failed', err_6 instanceof Error ? err_6 : new Error(errorMessage));
                    toast({
                        title: 'Check Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Handle clear logs
    var handleClearLogs = function () {
        clearLogs();
        toast({
            title: 'Logs Cleared',
            description: 'Application logs have been cleared.',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
        info('Logs cleared');
    };
    // Handle logout
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_7, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    info('User logged out');
                    return [3 /*break*/, 3];
                case 2:
                    err_7 = _a.sent();
                    errorMessage = err_7 instanceof Error ? err_7.message : 'Failed to logout';
                    logError('Logout failed', err_7 instanceof Error ? err_7 : new Error(errorMessage));
                    toast({
                        title: 'Logout Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(LoadingState, { isLoading: isLoading, error: loadError, children: [_jsxs(Box, { children: [_jsx(Flex, { justify: "space-between", align: "center", mb: 6, children: _jsx(Heading, { size: "lg", children: "Settings" }) }), _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { p: 0, children: _jsx(Tabs, { index: tabIndex, onChange: handleTabChange, children: _jsxs(TabList, { children: [_jsx(Tab, { children: "Profile" }), _jsx(Tab, { children: "Security" }), _jsx(Tab, { children: "Trading" }), _jsx(Tab, { children: "API Keys" }), _jsx(Tab, { children: "Appearance" }), _jsx(Tab, { children: "Logs" })] }) }) }), _jsx(CardBody, { children: _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Heading, { size: "md", mb: 4, children: "Profile Settings" }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Full Name" }), _jsx(Input, { value: name, onChange: function (e) { return setName(e.target.value); }, placeholder: "Enter your full name" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { value: email, onChange: function (e) { return setEmail(e.target.value); }, placeholder: "Enter your email", type: "email" })] }), _jsx(Button, { colorScheme: "primary", alignSelf: "flex-start", onClick: handleProfileUpdate, children: "Save Changes" })] }) }), _jsx(TabPanel, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Heading, { size: "md", mb: 4, children: "Security Settings" }), _jsxs(Box, { children: [_jsx(Heading, { size: "sm", mb: 4, children: "Change Password" }), _jsxs(FormControl, { mb: 4, children: [_jsx(FormLabel, { children: "Current Password" }), _jsxs(InputGroup, { children: [_jsx(Input, { value: currentPassword, onChange: function (e) { return setCurrentPassword(e.target.value); }, type: showCurrentPassword ? 'text' : 'password', placeholder: "Enter your current password" }), _jsx(InputRightElement, { children: _jsx(IconButton, { "aria-label": showCurrentPassword ? 'Hide password' : 'Show password', icon: showCurrentPassword ? _jsx(MdVisibilityOff, {}) : _jsx(MdVisibility, {}), variant: "ghost", size: "sm", onClick: function () { return setShowCurrentPassword(!showCurrentPassword); } }) })] })] }), _jsxs(FormControl, { mb: 4, children: [_jsx(FormLabel, { children: "New Password" }), _jsxs(InputGroup, { children: [_jsx(Input, { value: newPassword, onChange: function (e) { return setNewPassword(e.target.value); }, type: showNewPassword ? 'text' : 'password', placeholder: "Enter your new password" }), _jsx(InputRightElement, { children: _jsx(IconButton, { "aria-label": showNewPassword ? 'Hide password' : 'Show password', icon: showNewPassword ? _jsx(MdVisibilityOff, {}) : _jsx(MdVisibility, {}), variant: "ghost", size: "sm", onClick: function () { return setShowNewPassword(!showNewPassword); } }) })] })] }), _jsxs(FormControl, { mb: 4, children: [_jsx(FormLabel, { children: "Confirm New Password" }), _jsx(Input, { value: confirmPassword, onChange: function (e) { return setConfirmPassword(e.target.value); }, type: showNewPassword ? 'text' : 'password', placeholder: "Confirm your new password" })] }), _jsx(Button, { colorScheme: "primary", onClick: handlePasswordChange, children: "Change Password" })] }), _jsx(Divider, { my: 6 }), _jsxs(Box, { children: [_jsx(Heading, { size: "sm", mb: 4, children: "Account Actions" }), _jsx(Button, { colorScheme: "red", variant: "outline", leftIcon: _jsx(MdDelete, {}), onClick: onOpen, children: "Delete Account" })] })] }) }), _jsx(TabPanel, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Heading, { size: "md", mb: 4, children: "Trading Settings" }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Simulation Mode" }), _jsx(Switch, { isChecked: config.simulationMode, onChange: handleSimulationModeToggle, colorScheme: "primary", size: "lg" })] }), _jsx(Text, { color: "gray.500", children: config.simulationMode
                                                            ? 'Simulation mode is enabled. No real trades will be executed.'
                                                            : 'Live trading is enabled. Real trades will be executed.' }), _jsx(Divider, { my: 2 }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Default Trading Platform" }), _jsxs(Select, { value: config.platform, onChange: handlePlatformChange, children: [_jsx("option", { value: ExchangePlatform.BINANCE, children: "Binance" }), _jsx("option", { value: ExchangePlatform.KRAKEN, children: "Kraken" }), _jsx("option", { value: ExchangePlatform.BITFOREX, children: "Bitforex" }), _jsx("option", { value: ExchangePlatform.COINBASE, children: "Coinbase" })] })] })] }) }), _jsx(TabPanel, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Heading, { size: "md", mb: 4, children: "API Keys" }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Platform" }), _jsxs(Select, { value: selectedPlatform, onChange: function (e) { return setSelectedPlatform(e.target.value); }, children: [_jsx("option", { value: ExchangePlatform.BINANCE, children: "Binance" }), _jsx("option", { value: ExchangePlatform.KRAKEN, children: "Kraken" }), _jsx("option", { value: ExchangePlatform.BITFOREX, children: "Bitforex" }), _jsx("option", { value: ExchangePlatform.COINBASE, children: "Coinbase" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "API Key" }), _jsx(Input, { value: apiKey, onChange: function (e) { return setApiKey(e.target.value); }, placeholder: "Enter your API key" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "API Secret" }), _jsxs(InputGroup, { children: [_jsx(Input, { value: apiSecret, onChange: function (e) { return setApiSecret(e.target.value); }, type: showApiSecret ? 'text' : 'password', placeholder: "Enter your API secret" }), _jsx(InputRightElement, { children: _jsx(IconButton, { "aria-label": showApiSecret ? 'Hide secret' : 'Show secret', icon: showApiSecret ? _jsx(MdVisibilityOff, {}) : _jsx(MdVisibility, {}), variant: "ghost", size: "sm", onClick: function () { return setShowApiSecret(!showApiSecret); } }) })] })] }), _jsxs(HStack, { children: [_jsx(Button, { colorScheme: "primary", leftIcon: _jsx(MdSave, {}), onClick: handleSaveApiKeys, children: "Save Keys" }), _jsx(Button, { leftIcon: _jsx(MdRefresh, {}), onClick: handleCheckApiKeys, children: "Check Keys" })] }), _jsx(Divider, { my: 2 }), _jsxs(Box, { children: [_jsx(Heading, { size: "sm", mb: 4, children: "API Key Status" }), _jsx(Grid, { templateColumns: "repeat(2, 1fr)", gap: 4, children: Object.values(ExchangePlatform).map(function (platform) {
                                                                    var apiKeyInfo = config.apiKeys[platform];
                                                                    return (_jsx(GridItem, { children: _jsxs(HStack, { children: [_jsxs(Text, { fontWeight: "medium", children: [platform, ":"] }), (apiKeyInfo === null || apiKeyInfo === void 0 ? void 0 : apiKeyInfo.hasKeys) ? (_jsx(Text, { color: apiKeyInfo.isValid ? 'green.500' : 'red.500', children: apiKeyInfo.isValid ? 'Valid' : 'Invalid' })) : (_jsx(Text, { color: "gray.500", children: "Not Set" }))] }) }, platform));
                                                                }) })] })] }) }), _jsx(TabPanel, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Heading, { size: "md", mb: 4, children: "Appearance Settings" }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Dark Mode" }), _jsx(Switch, { isChecked: colorMode === 'dark', onChange: toggleColorMode, colorScheme: "primary", size: "lg" })] }), _jsx(Text, { color: "gray.500", children: colorMode === 'dark'
                                                            ? 'Dark mode is enabled.'
                                                            : 'Light mode is enabled.' })] }) }), _jsx(TabPanel, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(Flex, { justify: "space-between", align: "center", children: [_jsx(Heading, { size: "md", children: "Application Logs" }), _jsx(Button, { colorScheme: "red", variant: "outline", size: "sm", onClick: handleClearLogs, children: "Clear Logs" })] }), _jsx(Box, { maxH: "400px", overflowY: "auto", p: 4, borderWidth: "1px", borderRadius: "md", fontFamily: "monospace", fontSize: "sm", children: logs.length > 0 ? (logs.map(function (log) { return (_jsxs(Box, { mb: 2, color: log.level === 'error' ? 'red.500' :
                                                                log.level === 'warn' ? 'orange.500' :
                                                                    log.level === 'info' ? 'blue.500' :
                                                                        'gray.500', children: [_jsxs(Text, { children: ["[", new Date(log.timestamp).toLocaleTimeString(), "] [", log.level.toUpperCase(), "] ", log.message] }), log.details && (_jsx(Text, { ml: 4, fontSize: "xs", color: "gray.500", children: JSON.stringify(log.details) }))] }, log.id)); })) : (_jsx(Text, { color: "gray.500", children: "No logs available" })) })] }) })] }) })] })] }), _jsx(AlertDialog, { isOpen: isOpen, leastDestructiveRef: cancelRef, onClose: onClose, children: _jsx(AlertDialogOverlay, { children: _jsxs(AlertDialogContent, { children: [_jsx(AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", children: "Delete Account" }), _jsx(AlertDialogBody, { children: "Are you sure you want to delete your account? This action cannot be undone." }), _jsxs(AlertDialogFooter, { children: [_jsx(Button, { ref: cancelRef, onClick: onClose, children: "Cancel" }), _jsx(Button, { colorScheme: "red", onClick: onClose, ml: 3, children: "Delete" })] })] }) }) })] }));
};
export default Settings;
