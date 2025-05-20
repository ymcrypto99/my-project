import React from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Code,
  VStack,
  HStack,
  Text,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useLog, LogContextProps } from '../../contexts/LogContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Create a proper context with the right type
const LoggerContext = React.createContext<LogContextProps | null>(null);

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
    
    // Log to our logging system
    const logContext = this.context as LogContextProps | null;
    if (logContext && logContext.logError) {
      logContext.logError(error, 'React component error', {
        componentStack: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

// Set up context for the ErrorBoundary class component
ErrorBoundary.contextType = LoggerContext;

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { logError } = useLog();
  
  React.useEffect(() => {
    if (error) {
      logError(error, 'Error boundary caught error', {
        componentStack: errorInfo?.componentStack
      });
    }
  }, [error, errorInfo, logError]);
  
  const handleReload = () => {
    window.location.reload();
  };
  
  return (
    <Box p={4}>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="md"
        p={6}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Something went wrong
        </AlertTitle>
        <AlertDescription maxWidth="lg">
          <Text mb={4}>
            We're sorry, but an error occurred while rendering this component.
          </Text>
          
          {error && (
            <Text fontWeight="medium" mb={2}>
              {error.toString()}
            </Text>
          )}
          
          <VStack spacing={4} mt={4}>
            <Button colorScheme="red" onClick={handleReload}>
              Reload Page
            </Button>
            
            {errorInfo && (
              <HStack onClick={onToggle} cursor="pointer" color="gray.500">
                <Text fontSize="sm">Show Technical Details</Text>
                {isOpen ? <MdExpandLess /> : <MdExpandMore />}
              </HStack>
            )}
          </VStack>
          
          <Collapse in={isOpen} animateOpacity>
            <Box
              mt={4}
              p={3}
              bg="blackAlpha.100"
              borderRadius="md"
              maxHeight="300px"
              overflowY="auto"
              textAlign="left"
            >
              <Code colorScheme="red" whiteSpace="pre-wrap" fontSize="xs">
                {errorInfo?.componentStack}
              </Code>
            </Box>
          </Collapse>
        </AlertDescription>
      </Alert>
    </Box>
  );
};

export default ErrorBoundary;
