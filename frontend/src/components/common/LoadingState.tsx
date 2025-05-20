import React from 'react';
import {
  Box,
  Flex,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';
import { useLog } from '../../contexts/LogContext';

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingText?: string;
  minHeight?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  error,
  onRetry,
  children,
  loadingText = 'Loading data...',
  minHeight = '200px',
}) => {
  const { debug, error: logError } = useLog();
  
  React.useEffect(() => {
    if (isLoading) {
      debug(`Loading: ${loadingText}`);
    }
    
    if (error) {
      logError(`Loading error: ${error}`);
    }
  }, [isLoading, error, loadingText, debug, logError]);

  if (isLoading) {
    return (
      <Flex
        justify="center"
        align="center"
        direction="column"
        minHeight={minHeight}
        p={4}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
          mb={4}
        />
        <Text color="text.secondary">{loadingText}</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box minHeight={minHeight} p={4}>
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
            Error Loading Data
          </AlertTitle>
          <AlertDescription maxWidth="lg">
            <Text mb={4}>{error}</Text>
            {onRetry && (
              <Button
                leftIcon={<MdRefresh />}
                colorScheme="red"
                onClick={onRetry}
                mt={2}
              >
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

export default LoadingState;
