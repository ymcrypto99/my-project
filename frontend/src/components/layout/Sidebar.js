import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Flex, VStack, HStack, Text, Heading, Icon, Divider, useColorModeValue, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { MdDashboard, MdShowChart, MdAccountBalance, MdCode, MdStorage, MdSettings, MdMenu, } from 'react-icons/md';
// Navigation items
var navItems = [
    { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { name: 'Trading', icon: MdShowChart, path: '/trading' },
    { name: 'Portfolio', icon: MdAccountBalance, path: '/portfolio' },
    { name: 'Strategy Editor', icon: MdCode, path: '/strategy-editor' },
    { name: 'Data Management', icon: MdStorage, path: '/data-management' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
];
// Sidebar component
var Sidebar = function () {
    var location = useLocation();
    var _a = useDisclosure(), isOpen = _a.isOpen, onOpen = _a.onOpen, onClose = _a.onClose;
    // Colors
    var bgColor = useColorModeValue('white', 'gray.800');
    var borderColor = useColorModeValue('gray.200', 'gray.700');
    // Sidebar content
    var SidebarContent = function () { return (_jsxs(VStack, { align: "stretch", spacing: 1, w: "full", children: [_jsx(Box, { px: 4, py: 5, children: _jsx(Heading, { size: "md", bgGradient: "linear(to-r, primary.500, secondary.500)", bgClip: "text", children: "Crypto Profit Seeker" }) }), _jsx(Divider, { borderColor: borderColor }), _jsx(VStack, { align: "stretch", spacing: 1, mt: 4, children: navItems.map(function (item) { return (_jsx(NavItem, { icon: item.icon, path: item.path, isActive: location.pathname === item.path, onClick: onClose, children: item.name }, item.name)); }) })] })); };
    // Mobile menu button
    var MobileNav = function () { return (_jsxs(Flex, { px: 4, height: "20", alignItems: "center", bg: bgColor, borderBottomWidth: "1px", borderBottomColor: borderColor, justifyContent: "space-between", display: { base: 'flex', md: 'none' }, children: [_jsx(IconButton, { "aria-label": "Open menu", icon: _jsx(MdMenu, {}), onClick: onOpen, variant: "ghost" }), _jsx(Heading, { size: "md", bgGradient: "linear(to-r, primary.500, secondary.500)", bgClip: "text", children: "Crypto Profit Seeker" }), _jsx(Box, { w: 8 }), " "] })); };
    return (_jsxs(_Fragment, { children: [_jsx(MobileNav, {}), _jsxs(Drawer, { isOpen: isOpen, placement: "left", onClose: onClose, children: [_jsx(DrawerOverlay, {}), _jsxs(DrawerContent, { children: [_jsx(DrawerCloseButton, {}), _jsx(DrawerHeader, { children: "Menu" }), _jsx(DrawerBody, { p: 0, children: _jsx(SidebarContent, {}) })] })] }), _jsx(Box, { as: "nav", pos: "fixed", top: "0", left: "0", h: "100vh", w: "240px", bg: bgColor, borderRight: "1px", borderRightColor: borderColor, display: { base: 'none', md: 'block' }, zIndex: "sticky", children: _jsx(SidebarContent, {}) })] }));
};
var NavItem = function (_a) {
    var icon = _a.icon, path = _a.path, isActive = _a.isActive, children = _a.children, onClick = _a.onClick;
    // Colors
    var activeBg = useColorModeValue('primary.50', 'primary.900');
    var activeColor = useColorModeValue('primary.700', 'primary.200');
    var hoverBg = useColorModeValue('gray.100', 'gray.700');
    return (_jsx(Box, { as: RouterLink, to: path, onClick: onClick, bg: isActive ? activeBg : 'transparent', color: isActive ? activeColor : 'inherit', _hover: {
            bg: isActive ? activeBg : hoverBg,
            color: isActive ? activeColor : 'inherit',
        }, borderRadius: "md", mx: 2, role: "group", cursor: "pointer", transition: "all 0.2s", children: _jsxs(HStack, { spacing: 3, px: 3, py: 3, children: [_jsx(Icon, { as: icon, boxSize: 5, color: isActive ? 'primary.500' : 'gray.500', _groupHover: {
                        color: isActive ? 'primary.500' : 'primary.400',
                    } }), _jsx(Text, { fontWeight: isActive ? 'medium' : 'normal', children: children })] }) }));
};
export default Sidebar;
