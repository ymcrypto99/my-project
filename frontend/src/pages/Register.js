var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link, useToast, Card, CardBody, InputGroup, InputRightElement, IconButton, Flex, } from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLog } from '../contexts/LogContext';
var Register = function () {
    var _a = useState(''), name = _a[0], setName = _a[1];
    var _b = useState(''), email = _b[0], setEmail = _b[1];
    var _c = useState(''), password = _c[0], setPassword = _c[1];
    var _d = useState(''), confirmPassword = _d[0], setConfirmPassword = _d[1];
    var _e = useState(false), showPassword = _e[0], setShowPassword = _e[1];
    var _f = useState(false), isLoading = _f[0], setIsLoading = _f[1];
    var register = useAuth().register;
    var _g = useLog(), info = _g.info, logError = _g.error;
    var toast = useToast();
    var navigate = useNavigate();
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!name || !email || !password || !confirmPassword) {
                        toast({
                            title: 'Error',
                            description: 'Please fill in all fields',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                        return [2 /*return*/];
                    }
                    if (password !== confirmPassword) {
                        toast({
                            title: 'Error',
                            description: 'Passwords do not match',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, register(email, password, name)];
                case 2:
                    _a.sent();
                    info('User registered successfully', { email: email });
                    toast({
                        title: 'Account created',
                        description: 'You have successfully registered',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    navigate('/dashboard');
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Registration failed. Please try again.';
                    logError('Registration failed', err_1 instanceof Error ? err_1 : new Error(errorMessage));
                    toast({
                        title: 'Registration Failed',
                        description: errorMessage,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx(Flex, { minH: "100vh", align: "center", justify: "center", bg: "background", p: 4, children: _jsx(Card, { maxW: "400px", w: "full", boxShadow: "lg", children: _jsx(CardBody, { p: 8, children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(VStack, { spacing: 2, align: "center", children: [_jsx(Heading, { size: "xl", bgGradient: "linear(to-r, primary.500, secondary.500)", bgClip: "text", children: "Crypto.AI" }), _jsx(Text, { color: "text.secondary", children: "Create a new account" })] }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Full Name" }), _jsx(Input, { type: "text", value: name, onChange: function (e) { return setName(e.target.value); }, placeholder: "Enter your full name" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, placeholder: "Enter your email" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Password" }), _jsxs(InputGroup, { children: [_jsx(Input, { type: showPassword ? 'text' : 'password', value: password, onChange: function (e) { return setPassword(e.target.value); }, placeholder: "Create a password" }), _jsx(InputRightElement, { children: _jsx(IconButton, { "aria-label": showPassword ? 'Hide password' : 'Show password', icon: showPassword ? _jsx(MdVisibilityOff, {}) : _jsx(MdVisibility, {}), variant: "ghost", size: "sm", onClick: function () { return setShowPassword(!showPassword); } }) })] })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Confirm Password" }), _jsx(Input, { type: showPassword ? 'text' : 'password', value: confirmPassword, onChange: function (e) { return setConfirmPassword(e.target.value); }, placeholder: "Confirm your password" })] }), _jsx(Button, { type: "submit", colorScheme: "primary", size: "lg", width: "full", isLoading: isLoading, loadingText: "Creating Account", children: "Sign Up" })] }) }), _jsxs(Text, { textAlign: "center", children: ["Already have an account?", ' ', _jsx(Link, { as: RouterLink, to: "/login", color: "primary.500", children: "Sign In" })] })] }) }) }) }));
};
export default Register;
