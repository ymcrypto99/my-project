import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Flex,
  HStack,
  Stack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  useToast,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tabs,
} from '@chakra-ui/react';
import { MdRefresh, MdAdd, MdRemove } from 'react-icons/md';
import { useWebSocket } from '../contexts/WebSocketContext';
import { usePlatform } from '../contexts/PlatformContext';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for initial development
const mockPriceData = [
  { time: '09:00', price: 48235.67 },
  { time: '10:00', price: 48300.45 },
  { time: '11:00', price: 48150.23 },
  { time: '12:00', price: 48400.12 },
  { time: '13:00', price: 48500.34 },
  { time: '14:00', price: 48350.56 },
  { time: '15:00', price: 48450.78 },
  { time: '16:00', price: 48600.90 },
];

const mockOrderBook = {
  asks: [
    [48650.45, 0.5],
    [48600.34, 1.2],
    [48550.23, 0.8],
    [48500.12, 2.5],
    [48450.01, 1.7],
  ],
  bids: [
    [48400.98, 1.3],
    [48350.87, 2.1],
    [48300.76, 0.9],
    [48250.65, 3.2],
    [48200.54, 1.5],
  ],
};

const mockOpenOrders = [
  { id: '1', symbol: 'BTC/USDT', type: 'limit', side: 'buy', price: 48200.00, amount: 0.1, filled: 0, status: 'open', time: '15:30:45' },
  { id: '2', symbol: 'BTC/USDT', type: 'limit', side: 'sell', price: 48700.00, amount: 0.2, filled: 0, status: 'open', time: '14:45:30' },
];

const mockOrderHistory = [
  { id: '3', symbol: 'BTC/USDT', type: 'market', side: 'buy', price: 48350.45, amount: 0.15, filled: 0.15, status: 'filled', time: '13:20:15' },
  { id: '4', symbol: 'BTC/USDT', type: 'limit', side: 'sell', price: 48500.00, amount: 0.25, filled: 0.25, status: 'filled', time: '12:10:05' },
  { id: '5', symbol: 'BTC/USDT', type: 'limit', side: 'buy', price: 48100.00, amount: 0.3, filled: 0, status: 'canceled', time: '11:05:30' },
];

const Trading: React.FC = () => {
  const { isConnected, marketData, orderBooks, recentTrades } = useWebSocket();
  const { config } = usePlatform();
  const { logInfo: info, logError } = useLog();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState('limit');
  const [orderSide, setOrderSide] = useState('buy');
  const [orderPrice, setOrderPrice] = useState(48400);
  const [orderAmount, setOrderAmount] = useState(0.1);
  const [orderTotal, setOrderTotal] = useState(4840);
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const askColor = useColorModeValue('red.500', 'red.300');
  const bidColor = useColorModeValue('green.500', 'green.300');
  
  // Log component mount
  useEffect(() => {
    info('Trading component mounted');
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      info('Trading component unmounted');
    };
  }, [info]);
  
  // Update total when price or amount changes
  useEffect(() => {
    setOrderTotal(orderPrice * orderAmount);
  }, [orderPrice, orderAmount]);
  
  // Handle symbol change
  const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSymbol(e.target.value);
    info('Trading symbol changed');
  };
  
  // Handle order submission
  const handleSubmitOrder = () => {
    try {
      info('Order submitted');
      
      toast({
        title: 'Order Submitted',
        description: `${orderSide.toUpperCase()} ${orderAmount} ${selectedSymbol.split('/')[0]} at ${orderPrice}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form for market orders
      if (orderType === 'market') {
        setOrderAmount(0.1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit order';
      logError(err instanceof Error ? err : new Error(errorMessage), 'Order submission failed');
      
      toast({
        title: 'Order Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle order cancellation
  const handleCancelOrder = (orderId: string) => {
    try {
      info('Order canceled');
      
      toast({
        title: 'Order Canceled',
        description: `Order ${orderId} has been canceled`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      logError(err instanceof Error ? err : new Error(errorMessage), 'Order cancellation failed');
      
      toast({
        title: 'Cancellation Failed',
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
          <Heading size="lg">Trading</Heading>
          <HStack>
            <Text>Symbol:</Text>
            <Select value={selectedSymbol} onChange={handleSymbolChange} w="150px">
              <option value="BTC/USDT">BTC/USDT</option>
              <option value="ETH/USDT">ETH/USDT</option>
              <option value="SOL/USDT">SOL/USDT</option>
              <option value="ADA/USDT">ADA/USDT</option>
            </Select>
          </HStack>
        </Flex>
        
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {/* Left Column - Chart */}
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" mb={6} p={4} borderRadius="md">
              <Heading size="md" mb={4}>Price Chart</Heading>
              <Box h="400px">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPriceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#3182CE" fill="#3182CE" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
            
            {/* Order History */}
            <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" borderRadius="md">
              <Box p={4}>
                <Tabs variant="enclosed" size="sm">
                  <TabList>
                    <Tab>Open Orders</Tab>
                    <Tab>Order History</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0} pt={4}>
                      {mockOpenOrders.length > 0 ? (
                        <Box overflowX="auto">
                          <Table size="sm">
                            <Thead>
                              <Tr>
                                <Th>Type</Th>
                                <Th>Side</Th>
                                <Th>Price</Th>
                                <Th>Amount</Th>
                                <Th>Filled</Th>
                                <Th>Time</Th>
                                <Th>Action</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {mockOpenOrders.map((order) => (
                                <Tr key={order.id}>
                                  <Td>{order.type}</Td>
                                  <Td>
                                    <Badge colorScheme={order.side === 'buy' ? 'green' : 'red'}>
                                      {order.side}
                                    </Badge>
                                  </Td>
                                  <Td>{order.price.toFixed(2)}</Td>
                                  <Td>{order.amount}</Td>
                                  <Td>{order.filled}</Td>
                                  <Td>{order.time}</Td>
                                  <Td>
                                    <Button 
                                      size="xs" 
                                      colorScheme="red" 
                                      variant="outline"
                                      onClick={() => handleCancelOrder(order.id)}
                                    >
                                      Cancel
                                    </Button>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      ) : (
                        <Text textAlign="center" py={4} color="gray.500">No open orders</Text>
                      )}
                    </TabPanel>
                    <TabPanel p={0} pt={4}>
                      {mockOrderHistory.length > 0 ? (
                        <Box overflowX="auto">
                          <Table size="sm">
                            <Thead>
                              <Tr>
                                <Th>Type</Th>
                                <Th>Side</Th>
                                <Th>Price</Th>
                                <Th>Amount</Th>
                                <Th>Status</Th>
                                <Th>Time</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {mockOrderHistory.map((order) => (
                                <Tr key={order.id}>
                                  <Td>{order.type}</Td>
                                  <Td>
                                    <Badge colorScheme={order.side === 'buy' ? 'green' : 'red'}>
                                      {order.side}
                                    </Badge>
                                  </Td>
                                  <Td>{order.price.toFixed(2)}</Td>
                                  <Td>{order.amount}</Td>
                                  <Td>
                                    <Badge 
                                      colorScheme={
                                        order.status === 'filled' ? 'green' : 
                                        order.status === 'canceled' ? 'gray' : 'yellow'
                                      }
                                    >
                                      {order.status}
                                    </Badge>
                                  </Td>
                                  <Td>{order.time}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      ) : (
                        <Text textAlign="center" py={4} color="gray.500">No order history</Text>
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
          </GridItem>
          
          {/* Right Column - Order Book & Order Form */}
          <GridItem colSpan={1}>
            {/* Order Book */}
            <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" mb={6} p={4} borderRadius="md">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Order Book</Heading>
                <Button size="sm" variant="ghost">
                  <Box mr={2}><MdRefresh /></Box>
                  Refresh
                </Button>
              </Flex>
              <Stack spacing={4}>
                {/* Asks (Sell Orders) */}
                <Box>
                  <Text fontWeight="medium" mb={2}>Asks (Sell Orders)</Text>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Price</Th>
                        <Th>Amount</Th>
                        <Th>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockOrderBook.asks.map((ask, index) => (
                        <Tr key={index}>
                          <Td color={askColor}>{ask[0].toFixed(2)}</Td>
                          <Td>{ask[1]}</Td>
                          <Td>{(ask[0] * ask[1]).toFixed(2)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                
                {/* Current Price */}
                <Box textAlign="center" py={2} bg="gray.100" _dark={{ bg: 'gray.700' }} borderRadius="md">
                  <Text fontSize="xl" fontWeight="bold">
                    {mockPriceData[mockPriceData.length - 1].price.toFixed(2)}
                  </Text>
                </Box>
                
                {/* Bids (Buy Orders) */}
                <Box>
                  <Text fontWeight="medium" mb={2}>Bids (Buy Orders)</Text>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Price</Th>
                        <Th>Amount</Th>
                        <Th>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockOrderBook.bids.map((bid, index) => (
                        <Tr key={index}>
                          <Td color={bidColor}>{bid[0].toFixed(2)}</Td>
                          <Td>{bid[1]}</Td>
                          <Td>{(bid[0] * bid[1]).toFixed(2)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Stack>
            </Box>
            
            {/* Order Form */}
            <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" p={4} borderRadius="md">
              <Heading size="md" mb={4}>Place Order</Heading>
              <Stack spacing={4}>
                {/* Order Type */}
                <FormControl>
                  <FormLabel>Order Type</FormLabel>
                  <Select 
                    value={orderType} 
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <option value="limit">Limit</option>
                    <option value="market">Market</option>
                    <option value="stop">Stop</option>
                  </Select>
                </FormControl>
                
                {/* Buy/Sell Tabs */}
                <Tabs 
                  variant="solid-rounded" 
                  colorScheme="primary"
                  onChange={(index) => setOrderSide(index === 0 ? 'buy' : 'sell')}
                  index={orderSide === 'buy' ? 0 : 1}
                >
                  <TabList>
                    <Tab w="50%">Buy</Tab>
                    <Tab w="50%">Sell</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0} pt={4}>
                      {/* Buy Form */}
                      <Stack spacing={4}>
                        {/* Price */}
                        <FormControl>
                          <FormLabel>Price</FormLabel>
                          <Input
                            type="number"
                            value={orderPrice}
                            onChange={(e) => setOrderPrice(parseFloat(e.target.value))}
                            disabled={orderType === 'market'}
                          />
                        </FormControl>
                        
                        {/* Amount */}
                        <FormControl>
                          <FormLabel>Amount</FormLabel>
                          <Input
                            type="number"
                            value={orderAmount}
                            onChange={(e) => setOrderAmount(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        
                        {/* Total */}
                        <FormControl>
                          <FormLabel>Total</FormLabel>
                          <Input
                            type="number"
                            value={orderTotal}
                            readOnly
                          />
                        </FormControl>
                        
                        {/* Simulation Mode Warning */}
                        <Box p={3} bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="md">
                          <Flex align="center" justify="space-between">
                            <Text>Simulation Mode</Text>
                            <FormControl display="flex" alignItems="center" width="auto">
                              <FormLabel htmlFor="simulation-mode" mb="0">
                                On
                              </FormLabel>
                              <input
                                id="simulation-mode"
                                type="checkbox"
                                checked={true}
                                onChange={() => {}}
                              />
                            </FormControl>
                          </Flex>
                        </Box>
                        
                        {/* Submit Button */}
                        <Button 
                          colorScheme="green" 
                          size="lg" 
                          onClick={handleSubmitOrder}
                        >
                          <Box mr={2}><MdAdd /></Box>
                          Buy {selectedSymbol.split('/')[0]}
                        </Button>
                      </Stack>
                    </TabPanel>
                    <TabPanel p={0} pt={4}>
                      {/* Sell Form - Same structure as Buy Form */}
                      <Stack spacing={4}>
                        {/* Price */}
                        <FormControl>
                          <FormLabel>Price</FormLabel>
                          <Input
                            type="number"
                            value={orderPrice}
                            onChange={(e) => setOrderPrice(parseFloat(e.target.value))}
                            disabled={orderType === 'market'}
                          />
                        </FormControl>
                        
                        {/* Amount */}
                        <FormControl>
                          <FormLabel>Amount</FormLabel>
                          <Input
                            type="number"
                            value={orderAmount}
                            onChange={(e) => setOrderAmount(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        
                        {/* Total */}
                        <FormControl>
                          <FormLabel>Total</FormLabel>
                          <Input
                            type="number"
                            value={orderTotal}
                            readOnly
                          />
                        </FormControl>
                        
                        {/* Simulation Mode Warning */}
                        <Box p={3} bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="md">
                          <Flex align="center" justify="space-between">
                            <Text>Simulation Mode</Text>
                            <FormControl display="flex" alignItems="center" width="auto">
                              <FormLabel htmlFor="simulation-mode-sell" mb="0">
                                On
                              </FormLabel>
                              <input
                                id="simulation-mode-sell"
                                type="checkbox"
                                checked={true}
                                onChange={() => {}}
                              />
                            </FormControl>
                          </Flex>
                        </Box>
                        
                        {/* Submit Button */}
                        <Button 
                          colorScheme="red" 
                          size="lg" 
                          onClick={handleSubmitOrder}
                        >
                          <Box mr={2}><MdRemove /></Box>
                          Sell {selectedSymbol.split('/')[0]}
                        </Button>
                      </Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </LoadingState>
  );
};

export default Trading;
