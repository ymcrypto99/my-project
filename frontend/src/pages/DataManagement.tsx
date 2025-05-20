import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  HStack,
  Stack,
  Button,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tabs,
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
  Textarea,
  IconButton,
  useColorModeValue,
  useToast,
  Progress,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { MdUpload, MdDownload, MdDelete, MdAdd, MdRefresh, MdEdit, MdVisibility } from 'react-icons/md';
import { useLog } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for initial development
const mockDataSets = [
  { id: '1', name: 'BTC/USDT Historical Data', source: 'Binance', timeframe: '1h', startDate: '2022-01-01', endDate: '2023-08-01', records: 14256, size: '5.2 MB' },
  { id: '2', name: 'ETH/USDT Historical Data', source: 'Kraken', timeframe: '15m', startDate: '2022-06-01', endDate: '2023-08-01', records: 42768, size: '15.8 MB' },
  { id: '3', name: 'SOL/USDT Historical Data', source: 'Coinbase', timeframe: '1d', startDate: '2021-01-01', endDate: '2023-08-01', records: 943, size: '0.4 MB' },
];

const mockChartData = [
  { date: '2023-01-01', price: 16500 },
  { date: '2023-02-01', price: 23000 },
  { date: '2023-03-01', price: 28000 },
  { date: '2023-04-01', price: 30000 },
  { date: '2023-05-01', price: 27000 },
  { date: '2023-06-01', price: 29000 },
  { date: '2023-07-01', price: 31000 },
  { date: '2023-08-01', price: 29500 },
];

const mockDataStats = {
  open: 16500,
  high: 31000,
  low: 16500,
  close: 29500,
  volume: 1245678,
  volatility: 28.4,
  returns: 78.8,
};

const DataManagement: React.FC = () => {
  const { logInfo: info, logError } = useLog();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDataSet, setSelectedDataSet] = useState('1');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Log component mount
  useEffect(() => {
    info('Data Management component mounted');
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Set mock data preview
      setDataPreview([
        { timestamp: '2023-08-01 00:00:00', open: 29300, high: 29800, low: 29100, close: 29500, volume: 12456 },
        { timestamp: '2023-07-31 00:00:00', open: 29100, high: 29400, low: 28900, close: 29300, volume: 10234 },
        { timestamp: '2023-07-30 00:00:00', open: 29200, high: 29500, low: 28800, close: 29100, volume: 11345 },
      ]);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      info('Data Management component unmounted');
    };
  }, [info]);
  
  // Handle dataset selection
  const handleDataSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dataSetId = e.target.value;
    setSelectedDataSet(dataSetId);
    info('Dataset changed');
  };
  
  // Handle import data
  const handleImportData = () => {
    try {
      setIsImporting(true);
      setImportProgress(0);
      info('Data import started');
      
      // Simulate import progress
      const interval = setInterval(() => {
        setImportProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsImporting(false);
            
            toast({
              title: 'Import Completed',
              description: 'Data has been imported successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            
            info('Data import completed');
            return 100;
          }
          return newProgress;
        });
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import data';
      logError(err instanceof Error ? err : new Error(errorMessage), 'Data import failed');
      
      setIsImporting(false);
      
      toast({
        title: 'Import Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle delete dataset
  const handleDeleteDataSet = () => {
    try {
      info('Dataset deleted');
      
      toast({
        title: 'Dataset Deleted',
        description: 'The selected dataset has been deleted.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      
      // In a real app, we would update the list of datasets
      // For now, just select the first dataset
      if (mockDataSets.length > 0) {
        setSelectedDataSet(mockDataSets[0].id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete dataset';
      logError(err instanceof Error ? err : new Error(errorMessage), 'Dataset deletion failed');
      
      toast({
        title: 'Deletion Failed',
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
          <Heading size="lg">Data Management</Heading>
          <HStack>
            <Select 
              value={selectedDataSet} 
              onChange={handleDataSetChange} 
              w="250px"
            >
              {mockDataSets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
              ))}
            </Select>
            <Button 
              onClick={onOpen}
              colorScheme="primary"
            >
              <Box mr={2}><MdUpload /></Box>
              Import
            </Button>
          </HStack>
        </Flex>
        
        {/* Dataset Details */}
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={4} mb={6}>
          {mockDataSets
            .filter(dataset => dataset.id === selectedDataSet)
            .map(dataset => (
              <React.Fragment key={dataset.id}>
                <GridItem colSpan={1}>
                  <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" borderRadius="md" p={4}>
                    <Heading size="md" mb={4}>Dataset Info</Heading>
                    <Stack direction="column" spacing={2}>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Source:</Text>
                        <Text>{dataset.source}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Timeframe:</Text>
                        <Text>{dataset.timeframe}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Period:</Text>
                        <Text>{dataset.startDate} to {dataset.endDate}</Text>
                      </Flex>
                    </Stack>
                  </Box>
                </GridItem>
                <GridItem colSpan={1}>
                  <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" borderRadius="md" p={4}>
                    <Heading size="md" mb={4}>Records</Heading>
                    <Stack direction="column" spacing={2}>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Total Records:</Text>
                        <Text>{dataset.records.toLocaleString()}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Size:</Text>
                        <Text>{dataset.size}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="medium">Last Updated:</Text>
                        <Text>Today, 10:23 AM</Text>
                      </Flex>
                    </Stack>
                  </Box>
                </GridItem>
                <GridItem colSpan={1}>
                  <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" borderRadius="md" p={4}>
                    <Heading size="md" mb={4}>Actions</Heading>
                    <Stack direction="column" spacing={3}>
                      <Button colorScheme="primary" w="full">
                        <Box mr={2}><MdDownload /></Box>
                        Export
                      </Button>
                      <Button w="full">
                        <Box mr={2}><MdRefresh /></Box>
                        Update
                      </Button>
                      <Button 
                        colorScheme="red" 
                        variant="outline" 
                        w="full"
                        onClick={handleDeleteDataSet}
                      >
                        <Box mr={2}><MdDelete /></Box>
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                </GridItem>
              </React.Fragment>
            ))}
        </Grid>
        
        {/* Data Visualization */}
        <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" borderRadius="md" p={4} mb={6}>
          <Heading size="md" mb={4}>Data Visualization</Heading>
          <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            <GridItem colSpan={{ base: 1, lg: 3 }}>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="price" stroke="#3182CE" fill="#3182CE" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Stack direction="column" spacing={3}>
                <Heading size="sm">Statistics</Heading>
                <Divider />
                <Flex justify="space-between">
                  <Text fontWeight="medium">Open:</Text>
                  <Text>${mockDataStats.open.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="medium">High:</Text>
                  <Text>${mockDataStats.high.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Low:</Text>
                  <Text>${mockDataStats.low.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Close:</Text>
                  <Text>${mockDataStats.close.toLocaleString()}</Text>
                </Flex>
                <Divider />
                <Flex justify="space-between">
                  <Text fontWeight="medium">Volume:</Text>
                  <Text>{mockDataStats.volume.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Volatility:</Text>
                  <Text>{mockDataStats.volatility}%</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Returns:</Text>
                  <Text color="green.500">+{mockDataStats.returns}%</Text>
                </Flex>
              </Stack>
            </GridItem>
          </Grid>
        </Box>
        
        {/* Data Preview */}
        <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" borderRadius="md" p={4}>
          <Heading size="md" mb={4}>Data Preview</Heading>
          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Timestamp</Th>
                  <Th isNumeric>Open</Th>
                  <Th isNumeric>High</Th>
                  <Th isNumeric>Low</Th>
                  <Th isNumeric>Close</Th>
                  <Th isNumeric>Volume</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataPreview.map((row, index) => (
                  <Tr key={index}>
                    <Td>{row.timestamp}</Td>
                    <Td isNumeric>${row.open.toLocaleString()}</Td>
                    <Td isNumeric>${row.high.toLocaleString()}</Td>
                    <Td isNumeric>${row.low.toLocaleString()}</Td>
                    <Td isNumeric>${row.close.toLocaleString()}</Td>
                    <Td isNumeric>{row.volume.toLocaleString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
        
        {/* Import Data Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Import Data</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack direction="column" spacing={4}>
                <FormControl>
                  <FormLabel>Data Source</FormLabel>
                  <Select defaultValue="binance">
                    <option value="binance">Binance</option>
                    <option value="kraken">Kraken</option>
                    <option value="coinbase">Coinbase</option>
                    <option value="bitforex">Bitforex</option>
                    <option value="file">Local File</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Symbol</FormLabel>
                  <Select defaultValue="btcusdt">
                    <option value="btcusdt">BTC/USDT</option>
                    <option value="ethusdt">ETH/USDT</option>
                    <option value="solusdt">SOL/USDT</option>
                    <option value="adausdt">ADA/USDT</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Timeframe</FormLabel>
                  <Select defaultValue="1h">
                    <option value="1m">1 minute</option>
                    <option value="5m">5 minutes</option>
                    <option value="15m">15 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="4h">4 hours</option>
                    <option value="1d">1 day</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Date Range</FormLabel>
                  <Flex gap={4}>
                    <Input type="date" defaultValue="2023-01-01" />
                    <Input type="date" defaultValue="2023-08-01" />
                  </Flex>
                </FormControl>
                
                {isImporting && (
                  <Box>
                    <Text mb={2}>Importing data... {importProgress}%</Text>
                    <Progress value={importProgress} size="sm" colorScheme="primary" />
                  </Box>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="primary" 
                onClick={handleImportData}
                isLoading={isImporting}
                loadingText="Importing"
              >
                Import Data
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </LoadingState>
  );
};

export default DataManagement;
