import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, Text, Stat, StatNumber, StatHelpText, StatArrow, Card, CardHeader, CardBody, SimpleGrid, Flex, Select, HStack, Badge, useColorModeValue, } from '@chakra-ui/react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { usePlatform } from '../contexts/PlatformContext';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Mock data for initial development
var mockPortfolioData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
];
var mockAssetAllocation = [
    { name: 'BTC', value: 45 },
    { name: 'ETH', value: 25 },
    { name: 'SOL', value: 15 },
    { name: 'ADA', value: 10 },
    { name: 'Other', value: 5 },
];
var mockMarketData = [
    { symbol: 'BTC/USDT', price: 48235.67, change: 2.34 },
    { symbol: 'ETH/USDT', price: 3245.89, change: -1.23 },
    { symbol: 'SOL/USDT', price: 123.45, change: 5.67 },
    { symbol: 'ADA/USDT', price: 1.23, change: 0.45 },
    { symbol: 'DOT/USDT', price: 21.34, change: -2.56 },
    { symbol: 'AVAX/USDT', price: 34.56, change: 3.21 },
];
var mockRecentActivity = [
    { id: 1, type: 'buy', symbol: 'BTC/USDT', amount: 0.05, price: 48235.67, time: '10:23 AM' },
    { id: 2, type: 'sell', symbol: 'ETH/USDT', amount: 1.2, price: 3245.89, time: '09:45 AM' },
    { id: 3, type: 'buy', symbol: 'SOL/USDT', amount: 10, price: 123.45, time: 'Yesterday' },
    { id: 4, type: 'sell', symbol: 'ADA/USDT', amount: 100, price: 1.23, time: 'Yesterday' },
];
var Dashboard = function () {
    var _a = useWebSocket(), isConnected = _a.isConnected, marketData = _a.marketData;
    var config = usePlatform().config;
    var _b = useLog(), info = _b.info, error = _b.error;
    var _c = useState(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState(null), loadError = _d[0], setLoadError = _d[1];
    var _e = useState('1M'), timeframe = _e[0], setTimeframe = _e[1];
    // Colors
    var cardBg = useColorModeValue('white', 'gray.800');
    var borderColor = useColorModeValue('gray.200', 'gray.700');
    // Log component mount
    useEffect(function () {
        info('Dashboard component mounted');
        // Simulate loading data
        var timer = setTimeout(function () {
            setIsLoading(false);
        }, 1500);
        return function () {
            clearTimeout(timer);
            info('Dashboard component unmounted');
        };
    }, [info]);
    // Handle timeframe change
    var handleTimeframeChange = function (e) {
        setTimeframe(e.target.value);
        info('Dashboard timeframe changed', { timeframe: e.target.value });
    };
    return (_jsx(LoadingState, { isLoading: isLoading, error: loadError, children: _jsxs(Box, { children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 6, children: [_jsx(Heading, { size: "lg", children: "Dashboard" }), _jsxs(HStack, { children: [_jsx(Text, { children: "Timeframe:" }), _jsxs(Select, { value: timeframe, onChange: handleTimeframeChange, w: "100px", children: [_jsx("option", { value: "1D", children: "1D" }), _jsx("option", { value: "1W", children: "1W" }), _jsx("option", { value: "1M", children: "1M" }), _jsx("option", { value: "3M", children: "3M" }), _jsx("option", { value: "1Y", children: "1Y" }), _jsx("option", { value: "ALL", children: "All" })] })] })] }), _jsxs(Grid, { templateColumns: { base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4, mb: 6, children: [_jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { pb: 0, children: _jsx(Heading, { size: "md", children: "Total Balance" }) }), _jsx(CardBody, { children: _jsxs(Stat, { children: [_jsx(StatNumber, { fontSize: "3xl", children: "$12,345.67" }), _jsxs(StatHelpText, { children: [_jsx(StatArrow, { type: "increase" }), "23.36%"] })] }) })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { pb: 0, children: _jsx(Heading, { size: "md", children: "24h Profit/Loss" }) }), _jsx(CardBody, { children: _jsxs(Stat, { children: [_jsx(StatNumber, { fontSize: "3xl", color: "green.500", children: "+$345.67" }), _jsxs(StatHelpText, { children: [_jsx(StatArrow, { type: "increase" }), "2.87%"] })] }) })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { pb: 0, children: _jsx(Heading, { size: "md", children: "Active Positions" }) }), _jsx(CardBody, { children: _jsxs(Stat, { children: [_jsx(StatNumber, { fontSize: "3xl", children: "5" }), _jsx(StatHelpText, { children: "2 profitable, 3 at loss" })] }) })] }) })] }), _jsxs(Grid, { templateColumns: { base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 6, mb: 6, children: [_jsx(GridItem, { colSpan: { base: 1, lg: 2 }, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", h: "100%", children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Portfolio Performance" }) }), _jsx(CardBody, { children: _jsx(Box, { h: "300px", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: mockPortfolioData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "value", stroke: "#3182CE", fill: "#3182CE", fillOpacity: 0.2 })] }) }) }) })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", h: "100%", children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Asset Allocation" }) }), _jsx(CardBody, { children: _jsx(Box, { h: "300px", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: mockAssetAllocation, layout: "vertical", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number" }), _jsx(YAxis, { dataKey: "name", type: "category", width: 40 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", fill: "#3182CE" })] }) }) }) })] }) })] }), _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", mb: 6, children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Market Overview" }) }), _jsx(CardBody, { children: _jsx(SimpleGrid, { columns: { base: 2, md: 3, lg: 6 }, spacing: 4, children: mockMarketData.map(function (item) { return (_jsxs(Box, { p: 3, borderWidth: "1px", borderRadius: "md", borderColor: borderColor, children: [_jsx(Text, { fontWeight: "medium", children: item.symbol }), _jsxs(Text, { fontSize: "xl", fontWeight: "bold", children: ["$", item.price.toLocaleString()] }), _jsxs(Text, { color: item.change >= 0 ? 'green.500' : 'red.500', fontSize: "sm", children: [item.change >= 0 ? '+' : '', item.change, "%"] })] }, item.symbol)); }) }) })] }), _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Recent Activity" }) }), _jsx(CardBody, { children: _jsx(Box, { children: mockRecentActivity.map(function (activity) { return (_jsxs(Flex, { py: 3, borderBottomWidth: activity.id !== mockRecentActivity.length ? "1px" : "0", borderColor: borderColor, justify: "space-between", align: "center", children: [_jsxs(HStack, { spacing: 3, children: [_jsx(Badge, { colorScheme: activity.type === 'buy' ? 'green' : 'red', children: activity.type.toUpperCase() }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "medium", children: activity.symbol }), _jsx(Text, { fontSize: "sm", color: "gray.500", children: activity.time })] })] }), _jsxs(Box, { textAlign: "right", children: [_jsxs(Text, { fontWeight: "medium", children: [activity.amount, " @ $", activity.price] }), _jsxs(Text, { fontSize: "sm", color: "gray.500", children: ["$", (activity.amount * activity.price).toLocaleString()] })] })] }, activity.id)); }) }) })] })] }) }));
};
export default Dashboard;
