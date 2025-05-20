import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLog } from '../../contexts/LogContext';
var AppLayout = function () {
    var info = useLog().info;
    // Log page navigation
    React.useEffect(function () {
        info('App layout mounted');
        return function () {
            info('App layout unmounted');
        };
    }, [info]);
    return (_jsxs(Flex, { h: "100vh", flexDirection: "column", children: [_jsx(Sidebar, {}), _jsxs(Box, { ml: { base: 0, md: '240px' }, pt: "60px" // Header height
                , flex: "1", overflowY: "auto", bg: "background", children: [_jsx(Header, {}), _jsx(Box, { as: "main", p: 4, children: _jsx(Outlet, {}) })] })] }));
};
export default AppLayout;
