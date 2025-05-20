import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Flex,
  Select,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { usePlatform } from '../contexts/PlatformContext';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for initial development
const mockPortfolioData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const mockAssetAllocation = [
  { name: 'BTC', value: 45 },
  { name: 'ETH', value: 25 },
  { name: 'SOL', value: 15 },
  { name: 'ADA', value: 10 },
  { name: 'Other', value: 5 },
];

const mockMarketData = [
  { symbol: 'BTC/USDT', price: 48235.67, change: 2.34 },
  { symbol: 'ETH/USDT', price: 3245.89, change: -1.23 },
  { symbol: 'SOL/USDT', price: 123.45, change: 5.67 },
  { symbol: 'ADA/USDT', price: 1.23, change: 0.45 },
  { symbol: 'DOT/USDT', price: 21.34, change: -2.56 },
  { symbol: 'AVAX/USDT', price: 34.56, change: 3.21 },
];

const mockRecentActivity = [
  { id: 1, type: 'buy', symbol: 'BTC/USDT', amount: 0.05, price: 48235.67, time: '10:23 AM' },
  { id: 2, type: 'sell', symbol: 'ETH/USDT', amount: 1.2, price: 3245.89, time: '09:45 AM' },
  { id: 3, type: 'buy', symbol: 'SOL/USDT', amount: 10, price: 123.45, time: 'Yesterday' },
  { id: 4, type: 'sell', symbol: 'ADA/USDT', amount: 100, price: 1.23, time: 'Yesterday' },
];

const Dashboard: React.FC = () => {
  const { isConnected, marketData } = useWebSocket();
  const { config } = usePlatform();
  const { info, error } = useLog();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('1M');
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Log component mount
  useEffect(() => {
    info('Dashboard component mounted');
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      info('Dashboard component unmounted');
    };
  }, [info]);
  
  // Handle timeframe change
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value);
    info('Dashboard timeframe changed', { timeframe: e.target.value });
  };

  return (
    <LoadingState isLoading={isLoading} error={loadError}>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Dashboard</Heading>
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
                <Heading size="md">Total Balance</Heading>
              </CardHeader>
              <CardBody>
                <Stat>
                  <StatNumber fontSize="3xl">$12,345.67</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.36%
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">24h Profit/Loss</Heading>
              </CardHeader>
              <CardBody>
                <Stat>
                  <StatNumber fontSize="3xl" color="green.500">+$345.67</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    2.87%
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">Active Positions</Heading>
              </CardHeader>
              <CardBody>
                <Stat>
                  <StatNumber fontSize="3xl">5</StatNumber>
                  <StatHelpText>
                    2 profitable, 3 at loss
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
                <Heading size="md">Portfolio Performance</Heading>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockPortfolioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
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
                    <BarChart data={mockAssetAllocation} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={40} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3182CE" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        
        {/* Market Data */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" mb={6}>
          <CardHeader>
            <Heading size="md">Market Overview</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
              {mockMarketData.map((item) => (
                <Box key={item.symbol} p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                  <Text fontWeight="medium">{item.symbol}</Text>
                  <Text fontSize="xl" fontWeight="bold">${item.price.toLocaleString()}</Text>
                  <Text 
                    color={item.change >= 0 ? 'green.500' : 'red.500'}
                    fontSize="sm"
                  >
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
        
        {/* Recent Activity */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            <Box>
              {mockRecentActivity.map((activity) => (
                <Flex 
                  key={activity.id} 
                  py={3} 
                  borderBottomWidth={activity.id !== mockRecentActivity.length ? "1px" : "0"}
                  borderColor={borderColor}
                  justify="space-between"
                  align="center"
                >
                  <HStack spacing={3}>
                    <Badge colorScheme={activity.type === 'buy' ? 'green' : 'red'}>
                      {activity.type.toUpperCase()}
                    </Badge>
                    <Box>
                      <Text fontWeight="medium">{activity.symbol}</Text>
                      <Text fontSize="sm" color="gray.500">{activity.time}</Text>
                    </Box>
                  </HStack>
                  <Box textAlign="right">
                    <Text fontWeight="medium">{activity.amount} @ ${activity.price}</Text>
                    <Text fontSize="sm" color="gray.500">
                      ${(activity.amount * activity.price).toLocaleString()}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Box>
          </CardBody>
        </Card>
      </Box>
    </LoadingState>
  );
};

export default Dashboard;
