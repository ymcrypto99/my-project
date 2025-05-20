var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Code, VStack, HStack, Text, Collapse, useDisclosure, } from '@chakra-ui/react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useLog } from '../../contexts/LogContext';
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error: error,
            errorInfo: null,
        };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        // Log the error to an error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
        // Log to our logging system
        var logContext = this.context;
        if (logContext && logContext.error) {
            logContext.error('React component error', error, {
                componentStack: errorInfo.componentStack
            });
        }
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            // Render fallback UI
            return _jsx(ErrorFallback, { error: this.state.error, errorInfo: this.state.errorInfo });
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
// Set up context for the ErrorBoundary class component
ErrorBoundary.contextType = React.createContext(null);
var ErrorFallback = function (_a) {
    var error = _a.error, errorInfo = _a.errorInfo;
    var _b = useDisclosure(), isOpen = _b.isOpen, onToggle = _b.onToggle;
    var logError = useLog().error;
    React.useEffect(function () {
        if (error) {
            logError('Error boundary caught error', error, {
                componentStack: errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.componentStack
            });
        }
    }, [error, errorInfo, logError]);
    var handleReload = function () {
        window.location.reload();
    };
    return (_jsx(Box, { p: 4, children: _jsxs(Alert, { status: "error", variant: "subtle", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", borderRadius: "md", p: 6, children: [_jsx(AlertIcon, { boxSize: "40px", mr: 0 }), _jsx(AlertTitle, { mt: 4, mb: 1, fontSize: "lg", children: "Something went wrong" }), _jsxs(AlertDescription, { maxWidth: "lg", children: [_jsx(Text, { mb: 4, children: "We're sorry, but an error occurred while rendering this component." }), error && (_jsx(Text, { fontWeight: "medium", mb: 2, children: error.toString() })), _jsxs(VStack, { spacing: 4, mt: 4, children: [_jsx(Button, { colorScheme: "red", onClick: handleReload, children: "Reload Page" }), errorInfo && (_jsxs(HStack, { onClick: onToggle, cursor: "pointer", color: "gray.500", children: [_jsx(Text, { fontSize: "sm", children: "Show Technical Details" }), isOpen ? _jsx(MdExpandLess, {}) : _jsx(MdExpandMore, {})] }))] }), _jsx(Collapse, { in: isOpen, animateOpacity: true, children: _jsx(Box, { mt: 4, p: 3, bg: "blackAlpha.100", borderRadius: "md", maxHeight: "300px", overflowY: "auto", textAlign: "left", children: _jsx(Code, { colorScheme: "red", whiteSpace: "pre-wrap", fontSize: "xs", children: errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.componentStack }) }) })] })] }) }));
};
export default ErrorBoundary;
