import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';
var ProtectedRoute = function (_a) {
    var children = _a.children;
    var _b = useAuth(), isAuthenticated = _b.isAuthenticated, isLoading = _b.isLoading;
    var location = useLocation();
    if (isLoading) {
        return (_jsx(Center, { h: "100vh", children: _jsx(Spinner, { thickness: "4px", speed: "0.65s", emptyColor: "gray.200", color: "primary.500", size: "xl" }) }));
    }
    if (!isAuthenticated) {
        // Redirect to login page with return url
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
