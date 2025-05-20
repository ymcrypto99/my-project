import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Heading, Text, Card, CardHeader, CardBody, Flex, HStack, VStack, Button, Select, FormControl, FormLabel, Input, Textarea, useColorModeValue, useToast, Divider, } from '@chakra-ui/react';
import { MdPlayArrow, MdSave, MdAdd, MdHistory } from 'react-icons/md';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
// Mock data for initial development
var mockStrategies = [
    { id: '1', name: 'Simple Moving Average Crossover', description: 'Buy when short MA crosses above long MA, sell when it crosses below' },
    { id: '2', name: 'RSI Oversold/Overbought', description: 'Buy when RSI is below 30, sell when RSI is above 70' },
    { id: '3', name: 'MACD Signal Line Crossover', description: 'Buy when MACD crosses above signal line, sell when it crosses below' },
];
var mockStrategyCode = "// Simple Moving Average Crossover Strategy\nfunction initialize() {\n  // Define strategy parameters\n  this.shortPeriod = 10;\n  this.longPeriod = 50;\n  \n  // Initialize indicators\n  this.addIndicator('shortMA', 'SMA', this.shortPeriod);\n  this.addIndicator('longMA', 'SMA', this.longPeriod);\n}\n\nfunction onTick(data) {\n  // Get current indicator values\n  const shortMA = this.indicators.shortMA.value;\n  const longMA = this.indicators.longMA.value;\n  \n  // Previous values (from last tick)\n  const prevShortMA = this.indicators.shortMA.previousValue;\n  const prevLongMA = this.indicators.longMA.previousValue;\n  \n  // Check for crossover (short MA crosses above long MA)\n  if (prevShortMA <= prevLongMA && shortMA > longMA) {\n    // Buy signal\n    this.buy({ amount: 'all' });\n  }\n  \n  // Check for crossunder (short MA crosses below long MA)\n  else if (prevShortMA >= prevLongMA && shortMA < longMA) {\n    // Sell signal\n    this.sell({ amount: 'all' });\n  }\n}\n\nfunction onStop() {\n  // Clean up any resources\n  console.log('Strategy stopped');\n}";
var mockBacktestResults = {
    startDate: '2023-01-01',
    endDate: '2023-08-01',
    initialBalance: 10000,
    finalBalance: 13450,
    profit: 3450,
    profitPercentage: 34.5,
    trades: 15,
    winningTrades: 9,
    losingTrades: 6,
    winRate: 60,
    maxDrawdown: 12.3,
    sharpeRatio: 1.8,
};
var StrategyEditor = function () {
    var _a = useLog(), info = _a.info, logError = _a.error;
    var toast = useToast();
    var _b = useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState(null), loadError = _c[0], setLoadError = _c[1];
    var _d = useState('1'), selectedStrategy = _d[0], setSelectedStrategy = _d[1];
    var _e = useState('Simple Moving Average Crossover'), strategyName = _e[0], setStrategyName = _e[1];
    var _f = useState('Buy when short MA crosses above long MA, sell when it crosses below'), strategyDescription = _f[0], setStrategyDescription = _f[1];
    var _g = useState(mockStrategyCode), code = _g[0], setCode = _g[1];
    var _h = useState(false), isBacktesting = _h[0], setIsBacktesting = _h[1];
    var _j = useState(null), backtestResults = _j[0], setBacktestResults = _j[1];
    // Colors
    var cardBg = useColorModeValue('white', 'gray.800');
    var borderColor = useColorModeValue('gray.200', 'gray.700');
    var codeBg = useColorModeValue('gray.50', 'gray.900');
    // Log component mount
    useEffect(function () {
        info('Strategy Editor component mounted');
        // Simulate loading data
        var timer = setTimeout(function () {
            setIsLoading(false);
        }, 1500);
        return function () {
            clearTimeout(timer);
            info('Strategy Editor component unmounted');
        };
    }, [info]);
    // Handle strategy selection
    var handleStrategyChange = function (e) {
        var strategyId = e.target.value;
        setSelectedStrategy(strategyId);
        // Find the selected strategy
        var strategy = mockStrategies.find(function (s) { return s.id === strategyId; });
        if (strategy) {
            setStrategyName(strategy.name);
            setStrategyDescription(strategy.description);
            // In a real app, we would load the actual code for this strategy
            setCode(mockStrategyCode);
        }
        info('Strategy changed', { strategyId: strategyId });
    };
    // Handle save strategy
    var handleSaveStrategy = function () {
        try {
            info('Strategy saved', { strategyId: selectedStrategy, name: strategyName });
            toast({
                title: 'Strategy Saved',
                description: "\"".concat(strategyName, "\" has been saved successfully."),
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (err) {
            var errorMessage = err instanceof Error ? err.message : 'Failed to save strategy';
            logError('Strategy save failed', err instanceof Error ? err : new Error(errorMessage));
            toast({
                title: 'Save Failed',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    // Handle run backtest
    var handleRunBacktest = function () {
        try {
            setIsBacktesting(true);
            info('Backtest started', { strategyId: selectedStrategy, name: strategyName });
            // Simulate backtest running
            setTimeout(function () {
                setBacktestResults(mockBacktestResults);
                setIsBacktesting(false);
                toast({
                    title: 'Backtest Completed',
                    description: "Backtest for \"".concat(strategyName, "\" completed successfully."),
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                info('Backtest completed', {
                    strategyId: selectedStrategy,
                    profit: mockBacktestResults.profit,
                    profitPercentage: mockBacktestResults.profitPercentage
                });
            }, 3000);
        }
        catch (err) {
            var errorMessage = err instanceof Error ? err.message : 'Failed to run backtest';
            logError('Backtest failed', err instanceof Error ? err : new Error(errorMessage));
            setIsBacktesting(false);
            toast({
                title: 'Backtest Failed',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    return (_jsx(LoadingState, { isLoading: isLoading, error: loadError, children: _jsxs(Box, { children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 6, children: [_jsx(Heading, { size: "lg", children: "Strategy Editor" }), _jsxs(HStack, { children: [_jsx(Select, { value: selectedStrategy, onChange: handleStrategyChange, w: "250px", children: mockStrategies.map(function (strategy) { return (_jsx("option", { value: strategy.id, children: strategy.name }, strategy.id)); }) }), _jsx(Button, { leftIcon: _jsx(MdAdd, {}), colorScheme: "primary", children: "New" })] })] }), _jsxs(Grid, { templateColumns: { base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 6, children: [_jsx(GridItem, { colSpan: { base: 1, lg: 2 }, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", mb: 6, children: [_jsx(CardHeader, { children: _jsxs(Flex, { justify: "space-between", align: "center", children: [_jsx(Heading, { size: "md", children: "Strategy Code" }), _jsxs(HStack, { children: [_jsx(Button, { leftIcon: _jsx(MdSave, {}), colorScheme: "primary", onClick: handleSaveStrategy, children: "Save" }), _jsx(Button, { leftIcon: _jsx(MdPlayArrow, {}), colorScheme: "green", isLoading: isBacktesting, loadingText: "Running", onClick: handleRunBacktest, children: "Run Backtest" })] })] }) }), _jsx(CardBody, { children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Strategy Name" }), _jsx(Input, { value: strategyName, onChange: function (e) { return setStrategyName(e.target.value); } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Description" }), _jsx(Textarea, { value: strategyDescription, onChange: function (e) { return setStrategyDescription(e.target.value); }, rows: 2 })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Code" }), _jsx(Textarea, { value: code, onChange: function (e) { return setCode(e.target.value); }, fontFamily: "monospace", bg: codeBg, p: 4, rows: 20, resize: "vertical" })] })] }) })] }) }), _jsx(GridItem, { colSpan: 1, children: _jsxs(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, boxShadow: "sm", children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Backtest Results" }) }), _jsx(CardBody, { children: isBacktesting ? (_jsxs(VStack, { spacing: 4, py: 8, children: [_jsx(Text, { children: "Running backtest..." }), _jsx(Box, { w: "100%", maxW: "200px", children: _jsx(Progress, { isIndeterminate: true, colorScheme: "primary" }) })] })) : backtestResults ? (_jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(Grid, { templateColumns: "repeat(2, 1fr)", gap: 4, children: [_jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Period" }) }), _jsx(GridItem, { children: _jsxs(Text, { children: [backtestResults.startDate, " to ", backtestResults.endDate] }) }), _jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Initial Balance" }) }), _jsx(GridItem, { children: _jsxs(Text, { children: ["$", backtestResults.initialBalance.toLocaleString()] }) }), _jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Final Balance" }) }), _jsx(GridItem, { children: _jsxs(Text, { children: ["$", backtestResults.finalBalance.toLocaleString()] }) }), _jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Profit/Loss" }) }), _jsx(GridItem, { children: _jsxs(Text, { color: backtestResults.profit >= 0 ? 'green.500' : 'red.500', children: ["$", backtestResults.profit.toLocaleString(), " (", backtestResults.profitPercentage, "%)"] }) })] }), _jsx(Divider, {}), _jsxs(Grid, { templateColumns: "repeat(2, 1fr)", gap: 4, children: [_jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Total Trades" }) }), _jsx(GridItem, { children: _jsx(Text, { children: backtestResults.trades }) }), _jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Win/Loss" }) }), _jsx(GridItem, { children: _jsxs(Text, { children: [backtestResults.winningTrades, "/", backtestResults.losingTrades] }) }), _jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Win Rate" }) }), _jsx(GridItem, { children: _jsxs(Text, { children: [backtestResults.winRate, "%"] }) }), _jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Max Drawdown" }) }), _jsx(GridItem, { children: _jsxs(Text, { children: [backtestResults.maxDrawdown, "%"] }) }), _jsx(GridItem, { children: _jsx(Text, { fontWeight: "medium", children: "Sharpe Ratio" }) }), _jsx(GridItem, { children: _jsx(Text, { children: backtestResults.sharpeRatio }) })] }), _jsx(Button, { leftIcon: _jsx(MdHistory, {}), variant: "outline", w: "full", mt: 4, children: "View Detailed Report" })] })) : (_jsxs(VStack, { spacing: 4, py: 8, color: "gray.500", children: [_jsx(Text, { children: "No backtest results available" }), _jsx(Text, { fontSize: "sm", children: "Run a backtest to see results here" })] })) })] }) })] })] }) }));
};
export default StrategyEditor;
