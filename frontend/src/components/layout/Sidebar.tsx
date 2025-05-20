import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Divider,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdShowChart,
  MdAccountBalance,
  MdCode,
  MdStorage,
  MdSettings,
  MdMenu,
} from 'react-icons/md';

// Navigation items
const navItems = [
  { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
  { name: 'Trading', icon: MdShowChart, path: '/trading' },
  { name: 'Portfolio', icon: MdAccountBalance, path: '/portfolio' },
  { name: 'Strategy Editor', icon: MdCode, path: '/strategy-editor' },
  { name: 'Data Management', icon: MdStorage, path: '/data-management' },
  { name: 'Settings', icon: MdSettings, path: '/settings' },
];

// Sidebar component
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Sidebar content
  const SidebarContent = () => (
    <VStack align="stretch" spacing={1} w="full">
      <Box px={4} py={5}>
        <Heading 
          size="md" 
          bgGradient="linear(to-r, primary.500, secondary.500)"
          bgClip="text"
        >
          Crypto Profit Seeker
        </Heading>
      </Box>
      
      <Divider borderColor={borderColor} />
      
      <VStack align="stretch" spacing={1} mt={4}>
        {navItems.map((item) => (
          <NavItem
            key={item.name}
            icon={item.icon}
            path={item.path}
            isActive={location.pathname === item.path}
            onClick={onClose}
          >
            {item.name}
          </NavItem>
        ))}
      </VStack>
    </VStack>
  );
  
  // Mobile menu button
  const MobileNav = () => (
    <Flex
      px={4}
      height="20"
      alignItems="center"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent="space-between"
      display={{ base: 'flex', md: 'none' }}
    >
      <IconButton
        aria-label="Open menu"
        icon={<MdMenu />}
        onClick={onOpen}
        variant="ghost"
      />
      
      <Heading 
        size="md" 
        bgGradient="linear(to-r, primary.500, secondary.500)"
        bgClip="text"
      >
        Crypto Profit Seeker
      </Heading>
      
      <Box w={8} /> {/* Spacer for alignment */}
    </Flex>
  );
  
  return (
    <>
      {/* Mobile nav */}
      <MobileNav />
      
      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Desktop sidebar */}
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        h="100vh"
        w="240px"
        bg={bgColor}
        borderRight="1px"
        borderRightColor={borderColor}
        display={{ base: 'none', md: 'block' }}
        zIndex="sticky"
      >
        <SidebarContent />
      </Box>
    </>
  );
};

// Navigation item component
interface NavItemProps {
  icon: React.ElementType;
  path: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  path,
  isActive,
  children,
  onClick,
}) => {
  // Colors
  const activeBg = useColorModeValue('primary.50', 'primary.900');
  const activeColor = useColorModeValue('primary.700', 'primary.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Box
      as={RouterLink}
      to={path}
      onClick={onClick}
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : 'inherit'}
      _hover={{
        bg: isActive ? activeBg : hoverBg,
        color: isActive ? activeColor : 'inherit',
      }}
      borderRadius="md"
      mx={2}
      role="group"
      cursor="pointer"
      transition="all 0.2s"
    >
      <HStack spacing={3} px={3} py={3}>
        <Icon
          as={icon}
          boxSize={5}
          color={isActive ? 'primary.500' : 'gray.500'}
          _groupHover={{
            color: isActive ? 'primary.500' : 'primary.400',
          }}
        />
        <Text fontWeight={isActive ? 'medium' : 'normal'}>
          {children}
        </Text>
      </HStack>
    </Box>
  );
};

export default Sidebar;
