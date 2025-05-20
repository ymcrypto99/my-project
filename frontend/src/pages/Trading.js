import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, Text, Flex, HStack, Stack, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, Select, FormControl, FormLabel, Input, useColorModeValue, useToast, TabList, TabPanels, Tab, TabPanel, Tabs as ChakraTabs, } from '@chakra-ui/react';
import { MdRefresh, MdAdd, MdRemove } from 'react-icons/md';
import { useWebSocket } from '../contexts/WebSocketContext';
import { usePlatform } from '../contexts/PlatformContext';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Mock data for initial development
var mockPriceData = [
    { time: '09:00', price: 48235.67 },
    { time: '10:00', price: 48300.45 },
    { time: '11:00', price: 48150.23 },
    { time: '12:00', price: 48400.12 },
    { time: '13:00', price: 48500.34 },
    { time: '14:00', price: 48350.56 },
    { time: '15:00', price: 48450.78 },
    { time: '16:00', price: 48600.90 },
];
var mockOrderBook = {
    asks: [
        [48650.45, 0.5],
        [48600.34, 1.2],
        [48550.23, 0.8],
        [48500.12, 2.5],
        [48450.01, 1.7],
    ],
    bids: [
        [48400.98, 1.3],
        [48350.87, 2.1],
        [48300.76, 0.9],
        [48250.65, 3.2],
        [48200.54, 1.5],
    ],
};
var mockOpenOrders = [
    { id: '1', symbol: 'BTC/USDT', type: 'limit', side: 'buy', price: 48200.00, amount: 0.1, filled: 0, status: 'open', time: '15:30:45' },
    { id: '2', symbol: 'BTC/USDT', type: 'limit', side: 'sell', price: 48700.00, amount: 0.2, filled: 0, status: 'open', time: '14:45:30' },
];
var mockOrderHistory = [
    { id: '3', symbol: 'BTC/USDT', type: 'market', side: 'buy', price: 48350.45, amount: 0.15, filled: 0.15, status: 'filled', time: '13:20:15' },
    { id: '4', symbol: 'BTC/USDT', type: 'limit', side: 'sell', price: 48500.00, amount: 0.25, filled: 0.25, status: 'filled', time: '12:10:05' },
    { id: '5', symbol: 'BTC/USDT', type: 'limit', side: 'buy', price: 48100.00, amount: 0.3, filled: 0, status: 'canceled', time: '11:05:30' },
];
var Trading = function () {
    var _a = useWebSocket(), isConnected = _a.isConnected, marketData = _a.marketData, orderBooks = _a.orderBooks, recentTrades = _a.recentTrades;
    var config = usePlatform().config;
    var _b = useLog(), info = _b.logInfo, logError = _b.logError;
    var toast = useToast();
    var _c = useState(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState(null), loadError = _d[0], setLoadError = _d[1];
    var _e = useState('BTC/USDT'), selectedSymbol = _e[0], setSelectedSymbol = _e[1];
    var _f = useState('limit'), orderType = _f[0], setOrderType = _f[1];
    var _g = useState('buy'), orderSide = _g[0], setOrderSide = _g[1];
    var _h = useState(48400), orderPrice = _h[0], setOrderPrice = _h[1];
    var _j = useState(0.1), orderAmount = _j[0], setOrderAmount = _j[1];
    var _k = useState(4840), orderTotal = _k[0], setOrderTotal = _k[1];
    // Colors
    var cardBg = useColorModeValue('white', 'gray.800');
    var borderColor = useColorModeValue('gray.200', 'gray.700');
    var askColor = useColorModeValue('red.500', 'red.300');
    var bidColor = useColorModeValue('green.500', 'green.300');
    // Log component mount
    useEffect(function () {
        info('Trading component mounted');
        // Simulate loading data
        var timer = setTimeout(function () {
            setIsLoading(false);
        }, 1500);
        return function () {
            clearTimeout(timer);
            info('Trading component unmounted');
        };
    }, [info]);
    // Update total when price or amount changes
    useEffect(function () {
        setOrderTotal(orderPrice * orderAmount);
    }, [orderPrice, orderAmount]);
    // Handle symbol change
    var handleSymbolChange = function (e) {
        setSelectedSymbol(e.target.value);
        info('Trading symbol changed', { symbol: e.target.value });
    };
    // Handle order submission
    var handleSubmitOrder = function () {
        try {
            info('Order submitted', {
                symbol: selectedSymbol,
                type: orderType,
                side: orderSide,
                price: orderPrice,
                amount: orderAmount
            });
            toast({
                title: 'Order Submitted',
                description: "".concat(orderSide.toUpperCase(), " ").concat(orderAmount, " ").concat(selectedSymbol.split('/')[0], " at ").concat(orderPrice),
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Reset form for market orders
            if (orderType === 'market') {
                setOrderAmount(0.1);
            }
        }
        catch (err) {
            var errorMessage = err instanceof Error ? err.message : 'Failed to submit order';
            logError(err instanceof Error ? err : new Error(errorMessage), 'Order submission failed');
            toast({
                title: 'Order Failed',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    // Handle order cancellation
    var handleCancelOrder = function (orderId) {
        try {
            info('Order canceled', { orderId: orderId });
            toast({
                title: 'Order Canceled',
                description: "Order ".concat(orderId, " has been canceled"),
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (err) {
            var errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
            logError(err instanceof Error ? err : new Error(errorMessage), 'Order cancellation failed');
            toast({
                title: 'Cancellation Failed',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    return (_jsx(LoadingState, { isLoading: isLoading, error: loadError, children: _jsxs(Box, { children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 6, children: [_jsx(Heading, { size: "lg", children: "Trading" }), _jsxs(HStack, { children: [_jsx(Text, { children: "Symbol:" }), _jsxs(Select, { value: selectedSymbol, onChange: handleSymbolChange, w: "150px", children: [_jsx("option", { value: "BTC/USDT", children: "BTC/USDT" }), _jsx("option", { value: "ETH/USDT", children: "ETH/USDT" }), _jsx("option", { value: "SOL/USDT", children: "SOL/USDT" }), _jsx("option", { value: "ADA/USDT", children: "ADA/USDT" })] })] })] }), _jsxs(Grid, { templateColumns: { base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 6, children: [_jsxs(GridItem, { colSpan: { base: 1, lg: 2 }, children: [_jsxs(Box, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", mb: 6, p: 4, borderRadius: "md", children: [_jsx(Heading, { size: "md", mb: 4, children: "Price Chart" }), _jsx(Box, { h: "400px", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: mockPriceData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "time" }), _jsx(YAxis, { domain: ['auto', 'auto'] }), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "price", stroke: "#3182CE", fill: "#3182CE", fillOpacity: 0.2 })] }) }) })] }), _jsx(Box, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", borderRadius: "md", children: _jsx(Box, { p: 4, children: _jsxs(ChakraTabs, { variant: "enclosed", size: "sm", children: [_jsxs(TabList, { children: [_jsx(Tab, { children: "Open Orders" }), _jsx(Tab, { children: "Order History" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { p: 0, pt: 4, children: mockOpenOrders.length > 0 ? (_jsx(Box, { overflowX: "auto", children: _jsxs(Table, { size: "sm", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Type" }), _jsx(Th, { children: "Side" }), _jsx(Th, { children: "Price" }), _jsx(Th, { children: "Amount" }), _jsx(Th, { children: "Filled" }), _jsx(Th, { children: "Time" }), _jsx(Th, { children: "Action" })] }) }), _jsx(Tbody, { children: mockOpenOrders.map(function (order) { return (_jsxs(Tr, { children: [_jsx(Td, { children: order.type }), _jsx(Td, { children: _jsx(Badge, { colorScheme: order.side === 'buy' ? 'green' : 'red', children: order.side }) }), _jsx(Td, { children: order.price.toFixed(2) }), _jsx(Td, { children: order.amount }), _jsx(Td, { children: order.filled }), _jsx(Td, { children: order.time }), _jsx(Td, { children: _jsx(Button, { size: "xs", colorScheme: "red", variant: "outline", onClick: function () { return handleCancelOrder(order.id); }, children: "Cancel" }) })] }, order.id)); }) })] }) })) : (_jsx(Text, { textAlign: "center", py: 4, color: "gray.500", children: "No open orders" })) }), _jsx(TabPanel, { p: 0, pt: 4, children: mockOrderHistory.length > 0 ? (_jsx(Box, { overflowX: "auto", children: _jsxs(Table, { size: "sm", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Type" }), _jsx(Th, { children: "Side" }), _jsx(Th, { children: "Price" }), _jsx(Th, { children: "Amount" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "Time" })] }) }), _jsx(Tbody, { children: mockOrderHistory.map(function (order) { return (_jsxs(Tr, { children: [_jsx(Td, { children: order.type }), _jsx(Td, { children: _jsx(Badge, { colorScheme: order.side === 'buy' ? 'green' : 'red', children: order.side }) }), _jsx(Td, { children: order.price.toFixed(2) }), _jsx(Td, { children: order.amount }), _jsx(Td, { children: _jsx(Badge, { colorScheme: order.status === 'filled' ? 'green' :
                                                                                                order.status === 'canceled' ? 'gray' : 'yellow', children: order.status }) }), _jsx(Td, { children: order.time })] }, order.id)); }) })] }) })) : (_jsx(Text, { textAlign: "center", py: 4, color: "gray.500", children: "No order history" })) })] })] }) }) })] }), _jsxs(GridItem, { colSpan: 1, children: [_jsxs(Box, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", mb: 6, p: 4, borderRadius: "md", children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 4, children: [_jsx(Heading, { size: "md", children: "Order Book" }), _jsxs(Button, { size: "sm", variant: "ghost", children: [_jsx(Box, { mr: 2, children: _jsx(MdRefresh, {}) }), "Refresh"] })] }), _jsxs(Stack, { spacing: 4, children: [_jsxs(Box, { children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Asks (Sell Orders)" }), _jsxs(Table, { size: "sm", variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Price" }), _jsx(Th, { children: "Amount" }), _jsx(Th, { children: "Total" })] }) }), _jsx(Tbody, { children: mockOrderBook.asks.map(function (ask, index) { return (_jsxs(Tr, { children: [_jsx(Td, { color: askColor, children: ask[0].toFixed(2) }), _jsx(Td, { children: ask[1] }), _jsx(Td, { children: (ask[0] * ask[1]).toFixed(2) })] }, index)); }) })] })] }), _jsx(Box, { textAlign: "center", py: 2, bg: "gray.100", _dark: { bg: 'gray.700' }, borderRadius: "md", children: _jsx(Text, { fontSize: "xl", fontWeight: "bold", children: mockPriceData[mockPriceData.length - 1].price.toFixed(2) }) }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "medium", mb: 2, children: "Bids (Buy Orders)" }), _jsxs(Table, { size: "sm", variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Price" }), _jsx(Th, { children: "Amount" }), _jsx(Th, { children: "Total" })] }) }), _jsx(Tbody, { children: mockOrderBook.bids.map(function (bid, index) { return (_jsxs(Tr, { children: [_jsx(Td, { color: bidColor, children: bid[0].toFixed(2) }), _jsx(Td, { children: bid[1] }), _jsx(Td, { children: (bid[0] * bid[1]).toFixed(2) })] }, index)); }) })] })] })] })] }), _jsxs(Box, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", p: 4, borderRadius: "md", children: [_jsx(Heading, { size: "md", mb: 4, children: "Place Order" }), _jsxs(Stack, { spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Order Type" }), _jsxs(Select, { value: orderType, onChange: function (e) { return setOrderType(e.target.value); }, children: [_jsx("option", { value: "limit", children: "Limit" }), _jsx("option", { value: "market", children: "Market" }), _jsx("option", { value: "stop", children: "Stop" })] })] }), _jsxs(ChakraTabs, { variant: "solid-rounded", colorScheme: "primary", onChange: function (index) { return setOrderSide(index === 0 ? 'buy' : 'sell'); }, index: orderSide === 'buy' ? 0 : 1, children: [_jsxs(TabList, { children: [_jsx(Tab, { w: "50%", children: "Buy" }), _jsx(Tab, { w: "50%", children: "Sell" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { p: 0, pt: 4, children: _jsxs(Stack, { spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Price" }), _jsx(Input, { type: "number", value: orderPrice, onChange: function (e) { return setOrderPrice(parseFloat(e.target.value)); }, isDisabled: orderType === 'market' })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Amount" }), _jsx(Input, { type: "number", value: orderAmount, onChange: function (e) { return setOrderAmount(parseFloat(e.target.value)); } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Total" }), _jsx(Input, { type: "number", value: orderTotal, isReadOnly: true })] }), _jsx(Box, { p: 3, bg: "blue.50", _dark: { bg: 'blue.900' }, borderRadius: "md", children: _jsxs(Flex, { align: "center", justify: "space-between", children: [_jsx(Text, { children: "Simulation Mode" }), _jsxs(FormControl, { display: "flex", alignItems: "center", width: "auto", children: [_jsx(FormLabel, { htmlFor: "simulation-mode", mb: "0", children: "On" }), _jsx("input", { id: "simulation-mode", type: "checkbox", checked: !(config === null || config === void 0 ? void 0 : config.isLiveTrading), onChange: function () { } })] })] }) }), _jsxs(Button, { colorScheme: "green", size: "lg", onClick: handleSubmitOrder, children: [_jsx(Box, { mr: 2, children: _jsx(MdAdd, {}) }), "Buy ", selectedSymbol.split('/')[0]] })] }) }), _jsx(TabPanel, { p: 0, pt: 4, children: _jsxs(Stack, { spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Price" }), _jsx(Input, { type: "number", value: orderPrice, onChange: function (e) { return setOrderPrice(parseFloat(e.target.value)); }, isDisabled: orderType === 'market' })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Amount" }), _jsx(Input, { type: "number", value: orderAmount, onChange: function (e) { return setOrderAmount(parseFloat(e.target.value)); } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Total" }), _jsx(Input, { type: "number", value: orderTotal, isReadOnly: true })] }), _jsx(Box, { p: 3, bg: "blue.50", _dark: { bg: 'blue.900' }, borderRadius: "md", children: _jsxs(Flex, { align: "center", justify: "space-between", children: [_jsx(Text, { children: "Simulation Mode" }), _jsxs(FormControl, { display: "flex", alignItems: "center", width: "auto", children: [_jsx(FormLabel, { htmlFor: "simulation-mode-sell", mb: "0", children: "On" }), _jsx("input", { id: "simulation-mode-sell", type: "checkbox", checked: !(config === null || config === void 0 ? void 0 : config.isLiveTrading), onChange: function () { } })] })] }) }), _jsxs(Button, { colorScheme: "red", size: "lg", onClick: handleSubmitOrder, children: [_jsx(Box, { mr: 2, children: _jsx(MdRemove, {}) }), "Sell ", selectedSymbol.split('/')[0]] })] }) })] })] })] })] })] })] })] }) }));
};
export default Trading;
