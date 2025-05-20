import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLog } from '../../contexts/LogContext';

const AppLayout: React.FC = () => {
  const { info } = useLog();
  
  // Log page navigation
  React.useEffect(() => {
    info('App layout mounted');
    return () => {
      info('App layout unmounted');
    };
  }, [info]);

  return (
    <Flex h="100vh" flexDirection="column">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <Box
        ml={{ base: 0, md: '240px' }}
        pt="60px" // Header height
        flex="1"
        overflowY="auto"
        bg="background"
      >
        {/* Header */}
        <Header />
        
        {/* Page content */}
        <Box as="main" p={4}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AppLayout;
