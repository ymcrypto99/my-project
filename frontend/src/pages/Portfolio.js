import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, Text, Card, CardHeader, CardBody, Flex, HStack, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, Badge, Select, Progress, Stat, StatNumber, StatHelpText, StatArrow, useColorModeValue, } from '@chakra-ui/react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { usePlatform } from '../contexts/PlatformContext';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
// Mock data for initial development
var mockPortfolioValue = [
    { date: '2023-01-01', value: 10000 },
    { date: '2023-02-01', value: 12000 },
    { date: '2023-03-01', value: 11500 },
    { date: '2023-04-01', value: 13500 },
    { date: '2023-05-01', value: 15000 },
    { date: '2023-06-01', value: 14000 },
    { date: '2023-07-01', value: 16000 },
    { date: '2023-08-01', value: 17500 },
];
var mockAssetAllocation = [
    { name: 'BTC', value: 45, color: '#F7931A' },
    { name: 'ETH', value: 25, color: '#627EEA' },
    { name: 'SOL', value: 15, color: '#00FFA3' },
    { name: 'ADA', value: 10, color: '#0033AD' },
    { name: 'Other', value: 5, color: '#8884d8' },
];
var mockAssets = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.5, price: 48235.67, value: 24117.84, change24h: 2.34, allocation: 45 },
    { symbol: 'ETH', name: 'Ethereum', balance: 4.2, price: 3245.89, value: 13632.74, change24h: -1.23, allocation: 25 },
    { symbol: 'SOL', name: 'Solana', balance: 65.3, price: 123.45, value: 8061.29, change24h: 5.67, allocation: 15 },
    { symbol: 'ADA', name: 'Cardano', balance: 4500, price: 1.23, value: 5535.00, change24h: 0.45, allocation: 10 },
    { symbol: 'DOT', name: 'Polkadot', balance: 125, price: 21.34, value: 2667.50, change24h: -2.56, allocation: 3 },
    { symbol: 'AVAX', name: 'Avalanche', balance: 32, price: 34.56, value: 1105.92, change24h: 3.21, allocation: 2 },
];
var mockTransactions = [
    { id: '1', type: 'buy', symbol: 'BTC', amount: 0.1, price: 47235.67, value: 4723.57, fee: 12.50, date: '2023-08-15', time: '10:23 AM' },
    { id: '2', type: 'sell', symbol: 'ETH', amount: 1.2, price: 3345.89, value: 4015.07, fee: 10.25, date: '2023-08-14', time: '09:45 AM' },
    { id: '3', type: 'buy', symbol: 'SOL', amount: 10, price: 113.45, value: 1134.50, fee: 5.75, date: '2023-08-10', time: '14:30 PM' },
    { id: '4', type: 'sell', symbol: 'ADA', amount: 100, price: 1.33, value: 133.00, fee: 1.25, date: '2023-08-05', time: '11:15 AM' },
];
var Portfolio = function () {
    var _a = useWebSocket(), isConnected = _a.isConnected, portfolio = _a.portfolio;
    var config = usePlatform().config;
    var _b = useLog(), info = _b.info, logError = _b.error;
    var _c = useState(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState(null), loadError = _d[0], setLoadError = _d[1];
    var _e = useState('1M'), timeframe = _e[0], setTimeframe = _e[1];
    var _f = useState(0), selectedTab = _f[0], setSelectedTab = _f[1];
    // Colors
    var cardBg = useColorModeValue('white', 'gray.800');
    var borderColor = useColorModeValue('gray.200', 'gray.700');
    // Calculate total portfolio value
    var totalPortfolioValue = mockAssets.reduce(function (sum, asset) { return sum + asset.value; }, 0);
    // Log component mount
    useEffect(function () {
        info('Portfolio component mounted');
        // Simulate loading data
        var timer = setTimeout(function () {
            setIsLoading(false);
        }, 1500);
        return function () {
            clearTimeout(timer);
            info('Portfolio component unmounted');
        };
    }, [info]);
    // Handle timeframe change
    var handleTimeframeChange = function (e) {
        setTimeframe(e.target.value);
        info('Portfolio timeframe changed', { timeframe: e.target.value });
    };
    return (_jsx(LoadingState, { isLoading: isLoading, error: loadError, children: _jsxs(Box, { children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 6, children: [_jsx(Heading, { size: "lg", children: "Portfolio" }), _jsxs(HStack, { children: [_jsx(Text, { children: "Timeframe:" }), _jsxs(Select, { value: timeframe, onChange: handleTimeframeChange, w: "100px", children: [_jsx("option", { value: "1D", children: "1D" }), _jsx("option", { value: "1W", children: "1W" }), _jsx("option", { value: "1M", children: "1M" }), _jsx("option", { value: "3M", children: "3M" }), _jsx("option", { value: "1Y", children: "1Y" }), _jsx("option", { value: "ALL", children: "All" })] })] })] }), _jsxs(Grid, { templateColumns: { base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4, mb: 6, children: [_jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { pb: 0, children: _jsx(Heading, { size: "md", children: "Total Value" }) }), _jsx(CardBody, { children: _jsxs(Stat, { children: [_jsxs(StatNumber, { fontSize: "3xl", children: ["$", totalPortfolioValue.toLocaleString()] }), _jsxs(StatHelpText, { children: [_jsx(StatArrow, { type: "increase" }), "8.36% since last month"] })] }) })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { pb: 0, children: _jsx(Heading, { size: "md", children: "24h Change" }) }), _jsx(CardBody, { children: _jsxs(Stat, { children: [_jsx(StatNumber, { fontSize: "3xl", color: "green.500", children: "+$345.67" }), _jsxs(StatHelpText, { children: [_jsx(StatArrow, { type: "increase" }), "2.87% in the last 24h"] })] }) })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { pb: 0, children: _jsx(Heading, { size: "md", children: "Assets" }) }), _jsx(CardBody, { children: _jsxs(Stat, { children: [_jsx(StatNumber, { fontSize: "3xl", children: mockAssets.length }), _jsxs(StatHelpText, { children: ["Across ", config.simulationMode ? 'simulated' : 'real', " accounts"] })] }) })] }) })] }), _jsxs(Grid, { templateColumns: { base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 6, mb: 6, children: [_jsx(GridItem, { colSpan: { base: 1, lg: 2 }, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", h: "100%", children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Portfolio Value" }) }), _jsx(CardBody, { children: _jsx(Box, { h: "300px", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: mockPortfolioValue, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(RechartsTooltip, {}), _jsx(Area, { type: "monotone", dataKey: "value", stroke: "#3182CE", fill: "#3182CE", fillOpacity: 0.2 })] }) }) }) })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", h: "100%", children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Asset Allocation" }) }), _jsx(CardBody, { children: _jsx(Box, { h: "300px", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: mockAssetAllocation, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", label: function (_a) {
                                                                var name = _a.name, percent = _a.percent;
                                                                return "".concat(name, " ").concat((percent * 100).toFixed(0), "%");
                                                            }, children: mockAssetAllocation.map(function (entry, index) { return (_jsx(Cell, { fill: entry.color }, "cell-".concat(index))); }) }), _jsx(RechartsTooltip, {})] }) }) }) })] }) })] }), _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { p: 0, children: _jsx(Tabs, { variant: "enclosed", onChange: function (index) { return setSelectedTab(index); }, children: _jsxs(TabList, { children: [_jsx(Tab, { children: "Assets" }), _jsx(Tab, { children: "Transactions" })] }) }) }), _jsx(CardBody, { children: _jsxs(TabPanels, { children: [_jsx(TabPanel, { p: 0, pt: 4, children: _jsx(Box, { overflowX: "auto", children: _jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Asset" }), _jsx(Th, { isNumeric: true, children: "Balance" }), _jsx(Th, { isNumeric: true, children: "Price" }), _jsx(Th, { isNumeric: true, children: "Value" }), _jsx(Th, { isNumeric: true, children: "24h Change" }), _jsx(Th, { isNumeric: true, children: "Allocation" })] }) }), _jsx(Tbody, { children: mockAssets.map(function (asset) { return (_jsxs(Tr, { children: [_jsx(Td, { children: _jsxs(HStack, { children: [_jsx(Text, { fontWeight: "bold", children: asset.symbol }), _jsx(Text, { color: "gray.500", children: asset.name })] }) }), _jsx(Td, { isNumeric: true, children: asset.balance }), _jsxs(Td, { isNumeric: true, children: ["$", asset.price.toLocaleString()] }), _jsxs(Td, { isNumeric: true, children: ["$", asset.value.toLocaleString()] }), _jsxs(Td, { isNumeric: true, color: asset.change24h >= 0 ? 'green.500' : 'red.500', children: [asset.change24h >= 0 ? '+' : '', asset.change24h, "%"] }), _jsx(Td, { isNumeric: true, children: _jsxs(Flex, { align: "center", justify: "flex-end", children: [_jsxs(Text, { mr: 2, children: [asset.allocation, "%"] }), _jsx(Box, { w: "100px", children: _jsx(Progress, { value: asset.allocation, size: "sm", colorScheme: "blue", borderRadius: "full" }) })] }) })] }, asset.symbol)); }) })] }) }) }), _jsx(TabPanel, { p: 0, pt: 4, children: _jsx(Box, { overflowX: "auto", children: _jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Type" }), _jsx(Th, { children: "Asset" }), _jsx(Th, { isNumeric: true, children: "Amount" }), _jsx(Th, { isNumeric: true, children: "Price" }), _jsx(Th, { isNumeric: true, children: "Value" }), _jsx(Th, { isNumeric: true, children: "Fee" }), _jsx(Th, { children: "Date" })] }) }), _jsx(Tbody, { children: mockTransactions.map(function (tx) { return (_jsxs(Tr, { children: [_jsx(Td, { children: _jsx(Badge, { colorScheme: tx.type === 'buy' ? 'green' : 'red', children: tx.type.toUpperCase() }) }), _jsx(Td, { children: tx.symbol }), _jsx(Td, { isNumeric: true, children: tx.amount }), _jsxs(Td, { isNumeric: true, children: ["$", tx.price.toLocaleString()] }), _jsxs(Td, { isNumeric: true, children: ["$", tx.value.toLocaleString()] }), _jsxs(Td, { isNumeric: true, children: ["$", tx.fee.toLocaleString()] }), _jsx(Td, { children: _jsxs(VStack, { spacing: 0, align: "flex-start", children: [_jsx(Text, { children: tx.date }), _jsx(Text, { fontSize: "sm", color: "gray.500", children: tx.time })] }) })] }, tx.id)); }) })] }) }) })] }) })] })] }) }));
};
export default Portfolio;
