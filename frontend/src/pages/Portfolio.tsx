import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Flex,
  HStack,
  VStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { MdRefresh, MdInfo, MdDownload } from 'react-icons/md';
import { useWebSocket } from '../contexts/WebSocketContext';
import { usePlatform } from '../contexts/PlatformContext';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
import { PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for initial development
const mockPortfolioValue = [
  { date: '2023-01-01', value: 10000 },
  { date: '2023-02-01', value: 12000 },
  { date: '2023-03-01', value: 11500 },
  { date: '2023-04-01', value: 13500 },
  { date: '2023-05-01', value: 15000 },
  { date: '2023-06-01', value: 14000 },
  { date: '2023-07-01', value: 16000 },
  { date: '2023-08-01', value: 17500 },
];

const mockAssetAllocation = [
  { name: 'BTC', value: 45, color: '#F7931A' },
  { name: 'ETH', value: 25, color: '#627EEA' },
  { name: 'SOL', value: 15, color: '#00FFA3' },
  { name: 'ADA', value: 10, color: '#0033AD' },
  { name: 'Other', value: 5, color: '#8884d8' },
];

const mockAssets = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.5, price: 48235.67, value: 24117.84, change24h: 2.34, allocation: 45 },
  { symbol: 'ETH', name: 'Ethereum', balance: 4.2, price: 3245.89, value: 13632.74, change24h: -1.23, allocation: 25 },
  { symbol: 'SOL', name: 'Solana', balance: 65.3, price: 123.45, value: 8061.29, change24h: 5.67, allocation: 15 },
  { symbol: 'ADA', name: 'Cardano', balance: 4500, price: 1.23, value: 5535.00, change24h: 0.45, allocation: 10 },
  { symbol: 'DOT', name: 'Polkadot', balance: 125, price: 21.34, value: 2667.50, change24h: -2.56, allocation: 3 },
  { symbol: 'AVAX', name: 'Avalanche', balance: 32, price: 34.56, value: 1105.92, change24h: 3.21, allocation: 2 },
];

const mockTransactions = [
  { id: '1', type: 'buy', symbol: 'BTC', amount: 0.1, price: 47235.67, value: 4723.57, fee: 12.50, date: '2023-08-15', time: '10:23 AM' },
  { id: '2', type: 'sell', symbol: 'ETH', amount: 1.2, price: 3345.89, value: 4015.07, fee: 10.25, date: '2023-08-14', time: '09:45 AM' },
  { id: '3', type: 'buy', symbol: 'SOL', amount: 10, price: 113.45, value: 1134.50, fee: 5.75, date: '2023-08-10', time: '14:30 PM' },
  { id: '4', type: 'sell', symbol: 'ADA', amount: 100, price: 1.33, value: 133.00, fee: 1.25, date: '2023-08-05', time: '11:15 AM' },
];

const Portfolio: React.FC = () => {
  const { isConnected, portfolio } = useWebSocket();
  const { config } = usePlatform();
  const { info, error: logError } = useLog();
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Calculate total portfolio value
  const totalPortfolioValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  // Log component mount
  useEffect(() => {
    info('Portfolio component mounted');
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      info('Portfolio component unmounted');
    };
  }, [info]);
  
  // Handle timeframe change
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value);
    info('Portfolio timeframe changed', { timeframe: e.target.value });
  };

  return (
    <LoadingState isLoading={isLoading} error={loadError}>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Portfolio</Heading>
          <HStack>
            <Text>Timeframe:</Text>
            <Select value={timeframe} onChange={handleTimeframeChange} w="100px">
              <option value="1D">1D</option>
              <option value="1W">1W</option>
              <option value="1M">1M</option>
              <option value="3M">3M</option>
              <option value="1Y">1Y</option>
              <option value="ALL">All</option>
            </Select>
          </HStack>
        </Flex>
        
        {/* Portfolio Overview */}
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
          <GridItem colSpan={1}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">Total Value</Heading>
              </CardHeader>
              <CardBody>
                <Stat>
                  <StatNumber fontSize="3xl">${totalPortfolioValue.toLocaleString()}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    8.36% since last month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">24h Change</Heading>
              </CardHeader>
              <CardBody>
                <Stat>
                  <StatNumber fontSize="3xl" color="green.500">+$345.67</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    2.87% in the last 24h
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">Assets</Heading>
              </CardHeader>
              <CardBody>
                <Stat>
                  <StatNumber fontSize="3xl">{mockAssets.length}</StatNumber>
                  <StatHelpText>
                    Across {config.simulationMode ? 'simulated' : 'real'} accounts
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        
        {/* Charts Row */}
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mb={6}>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" h="100%">
              <CardHeader>
                <Heading size="md">Portfolio Value</Heading>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockPortfolioValue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="value" stroke="#3182CE" fill="#3182CE" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" h="100%">
              <CardHeader>
                <Heading size="md">Asset Allocation</Heading>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAssetAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockAssetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        
        {/* Assets and Transactions */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
          <CardHeader p={0}>
            <Tabs variant="enclosed" onChange={(index) => setSelectedTab(index)}>
              <TabList>
                <Tab>Assets</Tab>
                <Tab>Transactions</Tab>
              </TabList>
            </Tabs>
          </CardHeader>
          <CardBody>
            <TabPanels>
              <TabPanel p={0} pt={4}>
                <Box overflowX="auto">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Asset</Th>
                        <Th isNumeric>Balance</Th>
                        <Th isNumeric>Price</Th>
                        <Th isNumeric>Value</Th>
                        <Th isNumeric>24h Change</Th>
                        <Th isNumeric>Allocation</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockAssets.map((asset) => (
                        <Tr key={asset.symbol}>
                          <Td>
                            <HStack>
                              <Text fontWeight="bold">{asset.symbol}</Text>
                              <Text color="gray.500">{asset.name}</Text>
                            </HStack>
                          </Td>
                          <Td isNumeric>{asset.balance}</Td>
                          <Td isNumeric>${asset.price.toLocaleString()}</Td>
                          <Td isNumeric>${asset.value.toLocaleString()}</Td>
                          <Td isNumeric color={asset.change24h >= 0 ? 'green.500' : 'red.500'}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </Td>
                          <Td isNumeric>
                            <Flex align="center" justify="flex-end">
                              <Text mr={2}>{asset.allocation}%</Text>
                              <Box w="100px">
                                <Progress 
                                  value={asset.allocation} 
                                  size="sm" 
                                  colorScheme="blue" 
                                  borderRadius="full"
                                />
                              </Box>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
              <TabPanel p={0} pt={4}>
                <Box overflowX="auto">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Type</Th>
                        <Th>Asset</Th>
                        <Th isNumeric>Amount</Th>
                        <Th isNumeric>Price</Th>
                        <Th isNumeric>Value</Th>
                        <Th isNumeric>Fee</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockTransactions.map((tx) => (
                        <Tr key={tx.id}>
                          <Td>
                            <Badge colorScheme={tx.type === 'buy' ? 'green' : 'red'}>
                              {tx.type.toUpperCase()}
                            </Badge>
                          </Td>
                          <Td>{tx.symbol}</Td>
                          <Td isNumeric>{tx.amount}</Td>
                          <Td isNumeric>${tx.price.toLocaleString()}</Td>
                          <Td isNumeric>${tx.value.toLocaleString()}</Td>
                          <Td isNumeric>${tx.fee.toLocaleString()}</Td>
                          <Td>
                            <VStack spacing={0} align="flex-start">
                              <Text>{tx.date}</Text>
                              <Text fontSize="sm" color="gray.500">{tx.time}</Text>
                            </VStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            </TabPanels>
          </CardBody>
        </Card>
      </Box>
    </LoadingState>
  );
};

export default Portfolio;
