'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { Box, Spinner, Center, VStack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { toaster } from '@/app/components/ui/toaster';
import Whiteboard from '@/app/components/Whiteboard';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface WhiteboardClientProps {
  roomId: string;
}

export default function WhiteboardClient({ roomId }: WhiteboardClientProps) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAccess();
  }, [roomId]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/auth/login?redirect=/room/${roomId}/whiteboard`);
        return;
      }

      // Check if room exists
      const { data: room, error: roomError } = await supabase
        .from('drawing_rooms')
        .select('id, name, is_locked')
        .eq('id', roomId)
        .single();

      if (roomError || !room) {
        setError('Room not found');
        return;
      }

      // Check if room is locked
      if (room.is_locked) {
        setError('This room is currently locked');
        return;
      }

      // Check if user is a member
      const { data: member, error: memberError } = await supabase
        .from('room_members')
        .select('role')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !member) {
        setError('You do not have access to this room');
        toaster.create({
          title: 'Access Denied',
          description: 'You need to join this room first',
          type: 'error',
          duration: 4000,
        });
        router.push(`/room/${roomId}`);
        return;
      }

      // All checks passed
      setHasAccess(true);
    } catch (error: any) {
      console.error('Access check error:', error);
      setError('Failed to verify access');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Center h="100vh" bg="gray.50" _dark={{ bg: 'gray.950' }}>
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="fg.muted" fontSize="sm">
            Loading whiteboard...
          </Text>
        </VStack>
      </Center>
    );
  }

  // Error State
  if (error || !hasAccess) {
    return (
      <Center h="100vh" bg="gray.50" _dark={{ bg: 'gray.950' }}>
        <VStack gap={6} textAlign="center" maxW="md" px={6}>
          <Box
            w={20}
            h={20}
            borderRadius="full"
            bg="red.100"
            color="red.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _dark={{ bg: 'red.900', color: 'red.300' }}
          >
            <AlertCircle size={40} strokeWidth={2} />
          </Box>
          <VStack gap={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Access Denied
            </Text>
            <Text color="fg.muted" fontSize="sm">
              {error || 'You do not have permission to access this whiteboard'}
            </Text>
          </VStack>
          <Button onClick={() => router.push('/dashboard')} colorScheme="blue" size="lg">
            <ArrowLeft size={18} strokeWidth={2} />
            Back to Dashboard
          </Button>
        </VStack>
      </Center>
    );
  }

  // Render Whiteboard
  return <Whiteboard roomId={roomId} />;
}
