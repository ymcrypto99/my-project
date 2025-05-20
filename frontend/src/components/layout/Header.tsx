import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Heading,
  VStack,
  HStack,
  useColorMode,
  Tooltip,
  Avatar,
} from '@chakra-ui/react';
import { 
  MdNotifications, 
  MdSettings, 
  MdDarkMode, 
  MdLightMode,
  MdWifi,
  MdWifiOff,
  MdLogout,
  MdPerson,
} from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLog } from '../../contexts/LogContext';

// Header component
const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const { logs } = useLog();
  
  // Count error logs for notification badge
  const errorCount = logs.filter(log => log.level === 'error').length;
  
  // Mock connection status (will be replaced with real status from WebSocket context)
  const isConnected = true;
  
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      py={2}
      px={4}
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      borderBottomWidth="1px"
      borderBottomColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      height="60px"
      position="fixed"
      top="0"
      right="0"
      left={{ base: 0, md: '240px' }}
      zIndex="sticky"
    >
      {/* Left side - Page title (can be dynamic based on current route) */}
      <Heading size="md" display={{ base: 'none', md: 'block' }}>
        Dashboard
      </Heading>
      
      {/* Right side actions */}
      <HStack spacing={2}>
        {/* Connection status indicator */}
        <Tooltip label={isConnected ? "Connected" : "Disconnected"}>
          <Box color={isConnected ? "green.500" : "red.500"}>
            {isConnected ? <MdWifi /> : <MdWifiOff />}
          </Box>
        </Tooltip>
        
        {/* Theme toggle */}
        <Tooltip label={`Switch to ${colorMode === 'dark' ? 'Light' : 'Dark'} Mode`}>
          <IconButton
            aria-label={`Switch to ${colorMode === 'dark' ? 'Light' : 'Dark'} Mode`}
            icon={colorMode === 'dark' ? <MdLightMode /> : <MdDarkMode />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        
        {/* Notifications */}
        <Tooltip label="Notifications">
          <Box position="relative">
            <IconButton
              as={RouterLink}
              to="/settings?tab=notifications"
              aria-label="Notifications"
              icon={<MdNotifications />}
              variant="ghost"
              size="sm"
            />
            {errorCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-1px"
                right="-1px"
                fontSize="xs"
                minW="1.5em"
              >
                {errorCount}
              </Badge>
            )}
          </Box>
        </Tooltip>
        
        {/* Settings */}
        <Tooltip label="Settings">
          <IconButton
            as={RouterLink}
            to="/settings"
            aria-label="Settings"
            icon={<MdSettings />}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        
        {/* User menu */}
        <Menu>
          <Tooltip label="User Menu">
            <MenuButton
              as={IconButton}
              aria-label="User menu"
              icon={
                <Avatar 
                  size="sm" 
                  name={user?.name || 'User'} 
                  bg="primary.500"
                />
              }
              variant="ghost"
            />
          </Tooltip>
          <MenuList>
            <MenuItem fontWeight="medium">
              {user?.name || 'User'}
            </MenuItem>
            <MenuDivider />
            <MenuItem 
              as={RouterLink} 
              to="/settings?tab=profile" 
              icon={<MdPerson />}
            >
              Profile Settings
            </MenuItem>
            <MenuItem 
              onClick={logout} 
              icon={<MdLogout />}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Header;
