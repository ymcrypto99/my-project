import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  HStack,
  VStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  Select,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  useColorModeValue,
  useToast,
  Divider,
  Progress,
} from '@chakra-ui/react';
import { MdPlayArrow, MdSave, MdAdd, MdDelete, MdContentCopy, MdHistory } from 'react-icons/md';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';

// Mock data for initial development
const mockStrategies = [
  { id: '1', name: 'Simple Moving Average Crossover', description: 'Buy when short MA crosses above long MA, sell when it crosses below' },
  { id: '2', name: 'RSI Oversold/Overbought', description: 'Buy when RSI is below 30, sell when RSI is above 70' },
  { id: '3', name: 'MACD Signal Line Crossover', description: 'Buy when MACD crosses above signal line, sell when it crosses below' },
];

const mockStrategyCode = `// Simple Moving Average Crossover Strategy
function initialize() {
  // Define strategy parameters
  this.shortPeriod = 10;
  this.longPeriod = 50;
  
  // Initialize indicators
  this.addIndicator('shortMA', 'SMA', this.shortPeriod);
  this.addIndicator('longMA', 'SMA', this.longPeriod);
}

function onTick(data) {
  // Get current indicator values
  const shortMA = this.indicators.shortMA.value;
  const longMA = this.indicators.longMA.value;
  
  // Previous values (from last tick)
  const prevShortMA = this.indicators.shortMA.previousValue;
  const prevLongMA = this.indicators.longMA.previousValue;
  
  // Check for crossover (short MA crosses above long MA)
  if (prevShortMA <= prevLongMA && shortMA > longMA) {
    // Buy signal
    this.buy({ amount: 'all' });
  }
  
  // Check for crossunder (short MA crosses below long MA)
  else if (prevShortMA >= prevLongMA && shortMA < longMA) {
    // Sell signal
    this.sell({ amount: 'all' });
  }
}

function onStop() {
  // Clean up any resources
  console.log('Strategy stopped');
}`;

const mockBacktestResults = {
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

const StrategyEditor: React.FC = () => {
  const { logInfo: info, logError } = useLog();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState('1');
  const [strategyName, setStrategyName] = useState('Simple Moving Average Crossover');
  const [strategyDescription, setStrategyDescription] = useState('Buy when short MA crosses above long MA, sell when it crosses below');
  const [code, setCode] = useState(mockStrategyCode);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<typeof mockBacktestResults | null>(null);
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBg = useColorModeValue('gray.50', 'gray.900');
  
  // Log component mount
  useEffect(() => {
    info('Strategy Editor component mounted');
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      info('Strategy Editor component unmounted');
    };
  }, [info]);
  
  // Handle strategy selection
  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const strategyId = e.target.value;
    setSelectedStrategy(strategyId);
    
    // Find the selected strategy
    const strategy = mockStrategies.find(s => s.id === strategyId);
    if (strategy) {
      setStrategyName(strategy.name);
      setStrategyDescription(strategy.description);
      // In a real app, we would load the actual code for this strategy
      setCode(mockStrategyCode);
    }
    
    info('Strategy changed');
  };
  
  // Handle save strategy
  const handleSaveStrategy = () => {
    try {
      info('Strategy saved');
      
      toast({
        title: 'Strategy Saved',
        description: `"${strategyName}" has been saved successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save strategy';
      logError(err instanceof Error ? err : new Error(errorMessage), 'Strategy save failed');
      
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
  const handleRunBacktest = () => {
    try {
      setIsBacktesting(true);
      info('Backtest started');
      
      // Simulate backtest running
      setTimeout(() => {
        setBacktestResults(mockBacktestResults);
        setIsBacktesting(false);
        
        toast({
          title: 'Backtest Completed',
          description: `Backtest for "${strategyName}" completed successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        info('Backtest completed');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run backtest';
      logError(err instanceof Error ? err : new Error(errorMessage), 'Backtest failed');
      
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

  return (
    <LoadingState isLoading={isLoading} error={loadError}>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Strategy Editor</Heading>
          <HStack>
            <Select 
              value={selectedStrategy} 
              onChange={handleStrategyChange} 
              w="250px"
            >
              {mockStrategies.map(strategy => (
                <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
              ))}
            </Select>
            <Button colorScheme="primary">
              <Box mr={2}><MdAdd /></Box>
              New
            </Button>
          </HStack>
        </Flex>
        
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {/* Left Column - Editor */}
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" mb={6} p={4} borderRadius="md">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Strategy Code</Heading>
                <HStack>
                  <Button 
                    colorScheme="primary"
                    onClick={handleSaveStrategy}
                  >
                    <Box mr={2}><MdSave /></Box>
                    Save
                  </Button>
                  <Button 
                    colorScheme="green"
                    isLoading={isBacktesting}
                    loadingText="Running"
                    onClick={handleRunBacktest}
                  >
                    <Box mr={2}><MdPlayArrow /></Box>
                    Run Backtest
                  </Button>
                </HStack>
              </Flex>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Strategy Name</FormLabel>
                  <Input 
                    value={strategyName} 
                    onChange={(e) => setStrategyName(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea 
                    value={strategyDescription} 
                    onChange={(e) => setStrategyDescription(e.target.value)}
                    rows={2}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Code</FormLabel>
                  <Textarea 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)}
                    fontFamily="monospace"
                    bg={codeBg}
                    p={4}
                    rows={20}
                    resize="vertical"
                  />
                </FormControl>
              </VStack>
            </Box>
          </GridItem>
          
          {/* Right Column - Backtest Results */}
          <GridItem colSpan={1}>
            <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" p={4} borderRadius="md">
              <Heading size="md" mb={4}>Backtest Results</Heading>
              {isBacktesting ? (
                <VStack spacing={4} py={8}>
                  <Text>Running backtest...</Text>
                  <Box w="100%" maxW="200px">
                    <Progress isIndeterminate colorScheme="primary" />
                  </Box>
                </VStack>
              ) : backtestResults ? (
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <Text fontWeight="medium">Period</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{backtestResults.startDate} to {backtestResults.endDate}</Text>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontWeight="medium">Initial Balance</Text>
                    </GridItem>
                    <GridItem>
                      <Text>${backtestResults.initialBalance.toLocaleString()}</Text>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontWeight="medium">Final Balance</Text>
                    </GridItem>
                    <GridItem>
                      <Text>${backtestResults.finalBalance.toLocaleString()}</Text>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontWeight="medium">Profit/Loss</Text>
                    </GridItem>
                    <GridItem>
                      <Text color={backtestResults.profit >= 0 ? 'green.500' : 'red.500'}>
                        ${backtestResults.profit.toLocaleString()} ({backtestResults.profitPercentage}%)
                      </Text>
                    </GridItem>
                  </Grid>
                  
                  <Divider />
                  
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <Text fontWeight="medium">Total Trades</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{backtestResults.trades}</Text>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontWeight="medium">Win/Loss</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{backtestResults.winningTrades}/{backtestResults.losingTrades}</Text>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontWeight="medium">Win Rate</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{backtestResults.winRate}%</Text>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontWeight="medium">Max Drawdown</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{backtestResults.maxDrawdown}%</Text>
                    </GridItem>
                    
                    <GridItem>
                      <Text fontWeight="medium">Sharpe Ratio</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{backtestResults.sharpeRatio}</Text>
                    </GridItem>
                  </Grid>
                  
                  <Button variant="outline" w="full" mt={4}>
                    <Box mr={2}><MdHistory /></Box>
                    View Detailed Report
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} py={8} color="gray.500">
                  <Text>No backtest results available</Text>
                  <Text fontSize="sm">Run a backtest to see results here</Text>
                </VStack>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </LoadingState>
  );
};

export default StrategyEditor;
