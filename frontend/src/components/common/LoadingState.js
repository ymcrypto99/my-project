import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Box, Flex, Spinner, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Button, } from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';
import { useLog } from '../../contexts/LogContext';
var LoadingState = function (_a) {
    var isLoading = _a.isLoading, error = _a.error, onRetry = _a.onRetry, children = _a.children, _b = _a.loadingText, loadingText = _b === void 0 ? 'Loading data...' : _b, _c = _a.minHeight, minHeight = _c === void 0 ? '200px' : _c;
    var _d = useLog(), debug = _d.debug, logError = _d.error;
    React.useEffect(function () {
        if (isLoading) {
            debug("Loading: ".concat(loadingText));
        }
        if (error) {
            logError("Loading error: ".concat(error));
        }
    }, [isLoading, error, loadingText, debug, logError]);
    if (isLoading) {
        return (_jsxs(Flex, { justify: "center", align: "center", direction: "column", minHeight: minHeight, p: 4, children: [_jsx(Spinner, { thickness: "4px", speed: "0.65s", emptyColor: "gray.200", color: "primary.500", size: "xl", mb: 4 }), _jsx(Text, { color: "text.secondary", children: loadingText })] }));
    }
    if (error) {
        return (_jsx(Box, { minHeight: minHeight, p: 4, children: _jsxs(Alert, { status: "error", variant: "subtle", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", borderRadius: "md", p: 6, children: [_jsx(AlertIcon, { boxSize: "40px", mr: 0 }), _jsx(AlertTitle, { mt: 4, mb: 1, fontSize: "lg", children: "Error Loading Data" }), _jsxs(AlertDescription, { maxWidth: "lg", children: [_jsx(Text, { mb: 4, children: error }), onRetry && (_jsx(Button, { leftIcon: _jsx(MdRefresh, {}), colorScheme: "red", onClick: onRetry, mt: 2, children: "Retry" }))] })] }) }));
    }
    return _jsx(_Fragment, { children: children });
};
export default LoadingState;
