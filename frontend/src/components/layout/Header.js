import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, IconButton, Badge, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Heading, HStack, useColorMode, Tooltip, Avatar, } from '@chakra-ui/react';
import { MdNotifications, MdSettings, MdDarkMode, MdLightMode, MdWifi, MdWifiOff, MdLogout, MdPerson, } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLog } from '../../contexts/LogContext';
// Header component
var Header = function () {
    var _a = useColorMode(), colorMode = _a.colorMode, toggleColorMode = _a.toggleColorMode;
    var _b = useAuth(), user = _b.user, logout = _b.logout;
    var logs = useLog().logs;
    // Count error logs for notification badge
    var errorCount = logs.filter(function (log) { return log.level === 'error'; }).length;
    // Mock connection status (will be replaced with real status from WebSocket context)
    var isConnected = true;
    return (_jsxs(Flex, { as: "header", align: "center", justify: "space-between", py: 2, px: 4, bg: colorMode === 'dark' ? 'gray.800' : 'white', borderBottomWidth: "1px", borderBottomColor: colorMode === 'dark' ? 'gray.700' : 'gray.200', height: "60px", position: "fixed", top: "0", right: "0", left: { base: 0, md: '240px' }, zIndex: "sticky", children: [_jsx(Heading, { size: "md", display: { base: 'none', md: 'block' }, children: "Dashboard" }), _jsxs(HStack, { spacing: 2, children: [_jsx(Tooltip, { label: isConnected ? "Connected" : "Disconnected", children: _jsx(Box, { color: isConnected ? "green.500" : "red.500", children: isConnected ? _jsx(MdWifi, {}) : _jsx(MdWifiOff, {}) }) }), _jsx(Tooltip, { label: "Switch to ".concat(colorMode === 'dark' ? 'Light' : 'Dark', " Mode"), children: _jsx(IconButton, { "aria-label": "Switch to ".concat(colorMode === 'dark' ? 'Light' : 'Dark', " Mode"), icon: colorMode === 'dark' ? _jsx(MdLightMode, {}) : _jsx(MdDarkMode, {}), onClick: toggleColorMode, variant: "ghost", size: "sm" }) }), _jsx(Tooltip, { label: "Notifications", children: _jsxs(Box, { position: "relative", children: [_jsx(IconButton, { as: RouterLink, to: "/settings?tab=notifications", "aria-label": "Notifications", icon: _jsx(MdNotifications, {}), variant: "ghost", size: "sm" }), errorCount > 0 && (_jsx(Badge, { colorScheme: "red", borderRadius: "full", position: "absolute", top: "-1px", right: "-1px", fontSize: "xs", minW: "1.5em", children: errorCount }))] }) }), _jsx(Tooltip, { label: "Settings", children: _jsx(IconButton, { as: RouterLink, to: "/settings", "aria-label": "Settings", icon: _jsx(MdSettings, {}), variant: "ghost", size: "sm" }) }), _jsxs(Menu, { children: [_jsx(Tooltip, { label: "User Menu", children: _jsx(MenuButton, { as: IconButton, "aria-label": "User menu", icon: _jsx(Avatar, { size: "sm", name: (user === null || user === void 0 ? void 0 : user.name) || 'User', bg: "primary.500" }), variant: "ghost" }) }), _jsxs(MenuList, { children: [_jsx(MenuItem, { fontWeight: "medium", children: (user === null || user === void 0 ? void 0 : user.name) || 'User' }), _jsx(MenuDivider, {}), _jsx(MenuItem, { as: RouterLink, to: "/settings?tab=profile", icon: _jsx(MdPerson, {}), children: "Profile Settings" }), _jsx(MenuItem, { onClick: logout, icon: _jsx(MdLogout, {}), children: "Logout" })] })] })] })] }));
};
export default Header;
