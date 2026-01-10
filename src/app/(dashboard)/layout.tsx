import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from '../components/navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.950' }}>
      <Navbar />
      {children}
    </Box>
  );
}
