import React, { useState, useEffect, useRef } from 'react';
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
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Switch,
  IconButton,
  Divider,
  useColorMode,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff, MdSave, MdDelete, MdRefresh } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { usePlatform, ExchangePlatform } from '../contexts/PlatformContext';
import { useLog, LogEntry } from '../contexts/LogContext';
import LoadingState from '../components/common/LoadingState';

const Settings: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { config, updatePlatform, updateSimulationMode, setApiKeys, checkApiKeys } = usePlatform();
  const { logs, clearLogs, info, error: logError } = useLog();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);
  
  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // API Keys form state
  const [selectedPlatform, setSelectedPlatform] = useState<ExchangePlatform>(ExchangePlatform.BINANCE);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showApiSecret, setShowApiSecret] = useState(false);
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Log component mount
  useEffect(() => {
    info('Settings component mounted');
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Set initial form values
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
      }
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      info('Settings component unmounted');
    };
  }, [info, user]);
  
  // Handle tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    info('Settings tab changed', { tabIndex: index });
  };
  
  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      await updateProfile({ name, email });
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      info('Profile updated', { name, email });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      logError(new Error(errorMessage));
      
      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle password change
  const handlePasswordChange = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('All password fields are required');
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      await changePassword(currentPassword, newPassword);
      
      toast({
        title: 'Password Changed',
        description: 'Your password has been changed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      info('Password changed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      logError(new Error(errorMessage));
      
      toast({
        title: 'Password Change Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle platform change
  const handlePlatformChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const platform = e.target.value as ExchangePlatform;
      setSelectedPlatform(platform);
      await updatePlatform(platform);
      
      toast({
        title: 'Platform Updated',
        description: `Platform changed to ${platform}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      info('Platform updated', { platform });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update platform';
      logError(new Error(errorMessage));
      
      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle simulation mode toggle
  const handleSimulationModeToggle = async () => {
    try {
      const newMode = !config.simulationMode;
      await updateSimulationMode(newMode);
      
      toast({
        title: newMode ? 'Simulation Mode Enabled' : 'Live Trading Enabled',
        description: newMode 
          ? 'You are now in simulation mode. No real trades will be executed.' 
          : 'You are now in live trading mode. Real trades will be executed.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      
      info('Simulation mode updated', { simulationMode: newMode });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update simulation mode';
      logError(new Error(errorMessage));
      
      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle API keys save
  const handleSaveApiKeys = async () => {
    try {
      if (!apiKey || !apiSecret) {
        throw new Error('API Key and Secret are required');
      }
      
      await setApiKeys(selectedPlatform, apiKey, apiSecret);
      
      toast({
        title: 'API Keys Saved',
        description: `API keys for ${selectedPlatform} have been saved.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Clear API key fields
      setApiKey('');
      setApiSecret('');
      
      info('API keys saved', { platform: selectedPlatform });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save API keys';
      logError(new Error(errorMessage));
      
      toast({
        title: 'Save Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle check API keys
  const handleCheckApiKeys = async () => {
    try {
      const isValid = await checkApiKeys(selectedPlatform);
      
      toast({
        title: isValid ? 'API Keys Valid' : 'API Keys Invalid',
        description: isValid 
          ? `Your ${selectedPlatform} API keys are valid.` 
          : `Your ${selectedPlatform} API keys are invalid or have insufficient permissions.`,
        status: isValid ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
      
      info('API keys checked', { platform: selectedPlatform, valid: isValid });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check API keys';
      logError(new Error(errorMessage));
      
      toast({
        title: 'Check Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle clear logs
  const handleClearLogs = () => {
    clearLogs();
    
    toast({
      title: 'Logs Cleared',
      description: 'Application logs have been cleared.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    
    info('Logs cleared');
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      info('User logged out');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      logError(new Error(errorMessage));
      
      toast({
        title: 'Logout Failed',
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
          <Heading size="lg">Settings</Heading>
        </Flex>
        
        <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="sm" borderRadius="md">
          <Box>
            <Tabs index={tabIndex} onChange={handleTabChange}>
              <TabList>
                <Tab>Profile</Tab>
                <Tab>Security</Tab>
                <Tab>Trading</Tab>
                <Tab>API Keys</Tab>
                <Tab>Appearance</Tab>
                <Tab>Logs</Tab>
              </TabList>
              <TabPanels>
                {/* Profile Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" mb={4}>Profile Settings</Heading>
                    
                    <FormControl>
                      <FormLabel>Full Name</FormLabel>
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        type="email"
                      />
                    </FormControl>
                    
                    <Button 
                      colorScheme="primary" 
                      alignSelf="flex-start"
                      onClick={handleProfileUpdate}
                    >
                      Save Changes
                    </Button>
                  </VStack>
                </TabPanel>
                
                {/* Security Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" mb={4}>Security Settings</Heading>
                    
                    <Box>
                      <Heading size="sm" mb={4}>Change Password</Heading>
                      
                      <FormControl mb={4}>
                        <FormLabel>Current Password</FormLabel>
                        <InputGroup>
                          <Input 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                              icon={showCurrentPassword ? <MdVisibilityOff /> : <MdVisibility />}
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl mb={4}>
                        <FormLabel>New Password</FormLabel>
                        <InputGroup>
                          <Input 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                              icon={showNewPassword ? <MdVisibilityOff /> : <MdVisibility />}
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                      
                      <FormControl mb={4}>
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                        />
                      </FormControl>
                      
                      <Button 
                        colorScheme="primary" 
                        onClick={handlePasswordChange}
                      >
                        Change Password
                      </Button>
                    </Box>
                    
                    <Divider my={6} />
                    
                    <Box>
                      <Heading size="sm" mb={4}>Account Actions</Heading>
                      
                      <Button 
                        colorScheme="red" 
                        variant="outline"
                        onClick={onOpen}
                      >
                        <Box mr={2}><MdDelete /></Box>
                        Delete Account
                      </Button>
                    </Box>
                  </VStack>
                </TabPanel>
                
                {/* Trading Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" mb={4}>Trading Settings</Heading>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Simulation Mode
                      </FormLabel>
                      <Switch 
                        isChecked={config.simulationMode} 
                        onChange={handleSimulationModeToggle}
                        colorScheme="primary"
                      />
                    </FormControl>
                    
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        {config.simulationMode 
                          ? 'Simulation mode is enabled. No real trades will be executed.' 
                          : 'Live trading is enabled. Real trades will be executed.'}
                      </Text>
                    </Box>
                    
                    <Divider my={4} />
                    
                    <FormControl>
                      <FormLabel>Default Trading Platform</FormLabel>
                      <Select 
                        value={config.platform} 
                        onChange={handlePlatformChange}
                      >
                        <option value={ExchangePlatform.BINANCE}>Binance</option>
                        <option value={ExchangePlatform.KRAKEN}>Kraken</option>
                        <option value={ExchangePlatform.COINBASE}>Coinbase</option>
                        <option value={ExchangePlatform.BITFOREX}>Bitforex</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </TabPanel>
                
                {/* API Keys Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" mb={4}>API Keys</Heading>
                    
                    <FormControl>
                      <FormLabel>Platform</FormLabel>
                      <Select 
                        value={selectedPlatform} 
                        onChange={(e) => setSelectedPlatform(e.target.value as ExchangePlatform)}
                      >
                        <option value={ExchangePlatform.BINANCE}>Binance</option>
                        <option value={ExchangePlatform.KRAKEN}>Kraken</option>
                        <option value={ExchangePlatform.COINBASE}>Coinbase</option>
                        <option value={ExchangePlatform.BITFOREX}>Bitforex</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>API Key</FormLabel>
                      <Input 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>API Secret</FormLabel>
                      <InputGroup>
                        <Input 
                          value={apiSecret} 
                          onChange={(e) => setApiSecret(e.target.value)}
                          type={showApiSecret ? 'text' : 'password'}
                          placeholder="Enter your API secret"
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showApiSecret ? 'Hide secret' : 'Show secret'}
                            icon={showApiSecret ? <MdVisibilityOff /> : <MdVisibility />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowApiSecret(!showApiSecret)}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    
                    <HStack>
                      <Button 
                        colorScheme="primary" 
                        onClick={handleSaveApiKeys}
                      >
                        <Box mr={2}><MdSave /></Box>
                        Save Keys
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCheckApiKeys}
                      >
                        <Box mr={2}><MdRefresh /></Box>
                        Test Connection
                      </Button>
                    </HStack>
                    
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Note: API keys are stored securely and are only used to connect to the selected exchange platform.
                      </Text>
                    </Box>
                  </VStack>
                </TabPanel>
                
                {/* Appearance Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" mb={4}>Appearance Settings</Heading>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Dark Mode
                      </FormLabel>
                      <Switch 
                        isChecked={colorMode === 'dark'} 
                        onChange={toggleColorMode}
                        colorScheme="primary"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>
                
                {/* Logs Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Application Logs</Heading>
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        variant="outline"
                        onClick={handleClearLogs}
                      >
                        Clear Logs
                      </Button>
                    </Flex>
                    
                    <Box 
                      borderWidth="1px" 
                      borderColor={borderColor} 
                      borderRadius="md" 
                      height="400px" 
                      overflowY="auto"
                      p={4}
                    >
                      {logs.length > 0 ? (
                        logs.map((log: LogEntry) => (
                          <Box 
                            key={log.id}
                            p={2} 
                            mb={2} 
                            borderWidth="1px" 
                            borderRadius="md"
                            borderColor={
                              log.level === 'error' ? 'red.500' : 
                              log.level === 'warning' ? 'orange.500' : 
                              'blue.500'
                            }
                          >
                            <Text fontWeight="bold" color={
                              log.level === 'error' ? 'red.500' : 
                              log.level === 'warning' ? 'orange.500' : 
                              'blue.500'
                            }>
                              [{new Date(log.timestamp).toLocaleString()}] [{log.level.toUpperCase()}] {log.context}
                            </Text>
                            <Text>{log.message}</Text>
                            {log.details && (
                              <Text fontSize="sm" mt={1} fontFamily="monospace">
                                {JSON.stringify(log.details)}
                              </Text>
                            )}
                            {log.stack && (
                              <Text fontSize="xs" mt={1} color="gray.500" fontFamily="monospace">
                                {log.stack}
                              </Text>
                            )}
                          </Box>
                        ))
                      ) : (
                        <Text color="gray.500" textAlign="center" py={8}>
                          No logs available
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
        
        {/* Delete Account Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
          leastDestructiveRef={cancelRef as React.RefObject<HTMLButtonElement>}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>
              
              <AlertDialogBody>
                Are you sure you want to delete your account? This action cannot be undone.
              </AlertDialogBody>
              
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={onClose} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </LoadingState>
  );
};

export default Settings;
