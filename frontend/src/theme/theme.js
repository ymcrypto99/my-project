import { extendTheme } from '@chakra-ui/react';
// Color mode config
var config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};
// Custom colors
var colors = {
    primary: {
        50: '#e6f7ff',
        100: '#b3e0ff',
        200: '#80caff',
        300: '#4db3ff',
        400: '#1a9dff',
        500: '#0087e6',
        600: '#006bb4',
        700: '#004f82',
        800: '#003351',
        900: '#00171f',
    },
    secondary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
    },
    success: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
    },
    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },
    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },
    background: {
        light: '#f8fafc',
        dark: '#0f172a',
    },
    surface: {
        light: '#ffffff',
        dark: '#1e293b',
    },
    border: {
        light: '#e2e8f0',
        dark: '#334155',
    },
    text: {
        primary: {
            light: '#0f172a',
            dark: '#f8fafc',
        },
        secondary: {
            light: '#64748b',
            dark: '#94a3b8',
        },
    },
};
// Semantic tokens
var semanticTokens = {
    colors: {
        background: {
            default: 'background.light',
            _dark: 'background.dark',
        },
        surface: {
            default: 'surface.light',
            _dark: 'surface.dark',
        },
        border: {
            default: 'border.light',
            _dark: 'border.dark',
        },
        'text.primary': {
            default: 'text.primary.light',
            _dark: 'text.primary.dark',
        },
        'text.secondary': {
            default: 'text.secondary.light',
            _dark: 'text.secondary.dark',
        },
    },
};
// Component styles
var components = {
    Button: {
        baseStyle: {
            fontWeight: 'medium',
            borderRadius: 'md',
        },
        variants: {
            solid: function (props) { return ({
                bg: "".concat(props.colorScheme, ".500"),
                color: 'white',
                _hover: {
                    bg: "".concat(props.colorScheme, ".600"),
                },
            }); },
            outline: function (props) { return ({
                border: '1px solid',
                borderColor: "".concat(props.colorScheme, ".500"),
                color: "".concat(props.colorScheme, ".500"),
            }); },
            ghost: function (props) { return ({
                color: "".concat(props.colorScheme, ".500"),
                _hover: {
                    bg: "".concat(props.colorScheme, ".50"),
                },
            }); },
        },
        defaultProps: {
            colorScheme: 'primary',
        },
    },
    Input: {
        baseStyle: {
            field: {
                borderRadius: 'md',
            },
        },
        variants: {
            outline: {
                field: {
                    borderColor: 'border',
                    _hover: {
                        borderColor: 'primary.500',
                    },
                    _focus: {
                        borderColor: 'primary.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                    },
                },
            },
        },
        defaultProps: {
            variant: 'outline',
        },
    },
    Heading: {
        baseStyle: {
            fontWeight: 'semibold',
        },
    },
};
// Typography
var fonts = {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
};
// Breakpoints
var breakpoints = {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
};
// Create the theme
var theme = extendTheme({
    config: config,
    colors: colors,
    semanticTokens: semanticTokens,
    components: components,
    fonts: fonts,
    breakpoints: breakpoints,
    styles: {
        global: function (props) { return ({
            body: {
                bg: 'background',
                color: 'text.primary',
            },
        }); },
    },
});
export default theme;
