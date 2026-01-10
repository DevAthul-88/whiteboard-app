import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from '@/app/components/navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Whiteboard | Realtime Whiteboard',
  description: 'Create a new collaborative whiteboard with custom privacy settings, password protection, and capacity controls. Perfect for team brainstorming and real-time collaboration.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RoomLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.950' }}>
      <Navbar />
      {children}
    </Box>
  );
}
