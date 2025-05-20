# Crypto Profit Seeker - Frontend

This is the frontend application for the Crypto Profit Seeker platform, a comprehensive cryptocurrency trading and analysis tool.

## Features

- Real-time market data visualization
- Trading interface with multiple exchange support
- Portfolio tracking and performance metrics
- Strategy editor for creating and testing trading strategies
- Data management for historical price data
- User authentication and account management
- Platform configuration and API key management

## Tech Stack

- React 18
- TypeScript
- Chakra UI v2.8.2
- Recharts for data visualization
- React Router for navigation
- Context API for state management
- WebSocket for real-time data

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173 (or another port if 5173 is in use).

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

Adjust the URLs according to your backend configuration.

## Project Structure

- `src/` - Source code
  - `components/` - Reusable UI components
    - `common/` - Common components used across the application
    - `layout/` - Layout components (Header, Sidebar, etc.)
    - `auth/` - Authentication-related components
  - `contexts/` - React contexts for state management
  - `pages/` - Application pages
  - `services/` - API services and utilities
  - `theme/` - Chakra UI theme configuration
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point

## Backend Integration

The frontend communicates with the backend through:

1. REST API for authentication, configuration, and data operations
2. WebSockets for real-time market data and trading updates

Make sure the backend server is running and accessible at the URLs specified in the environment variables.
