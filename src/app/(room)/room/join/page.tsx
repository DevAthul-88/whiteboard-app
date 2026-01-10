'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  VStack,
  Text,
  Card,
  HStack,
  Skeleton,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toaster } from '@/app/components/ui/toaster';
import { Lock, Users, AlertCircle } from 'lucide-react';

function JoinRoomContent() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const supabase = createClient();

  useEffect(() => {
    if (roomId) {
      loadRoomDetails();
    }
  }, [roomId]);

  const loadRoomDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('drawing_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (error) throw new Error('Room not found');
      setRoom(data);
    } catch (error: any) {
      toaster.create({
        title: 'Room not found',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
      router.push('/dashboard');
    } finally {
      setRoomLoading(false);
    }
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/auth/login?redirect=/room/join?roomId=${roomId}`);
        return;
      }

      // Check password if room has one
      if (room.room_password) {
        if (password !== room.room_password) {
          throw new Error('Invalid password');
        }
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('room_members')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();

      if (!existingMember) {
        // Add as member
        const { error: memberError } = await supabase
          .from('room_members')
          .insert({
            room_id: roomId,
            user_id: user.id,
            role: 'editor',
          });

        if (memberError) throw memberError;
      }

      toaster.create({
        title: 'Successfully joined!',
        description: 'Redirecting to whiteboard...',
        type: 'success',
        duration: 2000,
      });

      router.push(`/room/${roomId}`);
    } catch (error: any) {
      toaster.create({
        title: 'Failed to join room',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!roomId) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Card.Root maxW="md">
          <Card.Body py={10}>
            <VStack gap={4} textAlign="center">
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg="red.100"
                color="red.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _dark={{ bg: 'red.900', color: 'red.300' }}
              >
                <AlertCircle size={32} strokeWidth={2} />
              </Box>
              <Heading size="lg">Invalid Room Link</Heading>
              <Text color="fg.muted" fontSize="sm">
                The room link is invalid or missing
              </Text>
              <Button
                onClick={() => router.push('/dashboard')}
                colorScheme="blue"
                mt={2}
              >
                Go to Dashboard
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      position="relative"
      bg="gray.50"
      _dark={{ bg: 'gray.950' }}
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        inset={0}
        bgImage="linear-gradient(to right, rgb(59 130 246 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgb(59 130 246 / 0.03) 1px, transparent 1px)"
        bgSize="80px 80px"
        _dark={{
          bgImage:
            'linear-gradient(to right, rgb(59 130 246 / 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgb(59 130 246 / 0.02) 1px, transparent 1px)',
        }}
        pointerEvents="none"
      />

      <Container maxW="500px" py={8} position="relative">
        <VStack gap={6} w="full">
          {/* Header */}
          <VStack gap={2} textAlign="center">
            <Box
              w={16}
              h={16}
              borderRadius="full"
              bg="blue.100"
              color="blue.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _dark={{ bg: 'blue.900', color: 'blue.300' }}
            >
              <Users size={32} strokeWidth={2} />
            </Box>
            <Heading
              size={{ base: 'xl', md: '2xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, gray.900, gray.700)"
              bgClip="text"
              _dark={{
                bgGradient: 'linear(to-r, gray.50, gray.400)',
              }}
            >
              Join Whiteboard
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              Enter the password to join this collaborative workspace
            </Text>
          </VStack>

          {/* Room Info Card */}
          {roomLoading ? (
            <Card.Root w="full" size="lg">
              <Card.Body>
                <VStack gap={3}>
                  <Skeleton height="24px" width="70%" />
                  <Skeleton height="16px" width="50%" />
                </VStack>
              </Card.Body>
            </Card.Root>
          ) : (
            room && (
              <Card.Root
                w="full"
                size="lg"
                bg="white"
                _dark={{ bg: 'gray.900' }}
              >
                <Card.Body>
                  <VStack gap={3}>
                    <Heading size="md" fontWeight="semibold">
                      {room.name}
                    </Heading>
                    <HStack color="fg.muted" fontSize="sm" gap={4}>
                      <HStack gap={1}>
                        <Users size={14} strokeWidth={2} />
                        <Text>Max {room.max_users} users</Text>
                      </HStack>
                      {room.room_password && (
                        <HStack gap={1}>
                          <Lock size={14} strokeWidth={2} />
                          <Text>Password protected</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            )
          )}

          {/* Password Form */}
          {room?.room_password && (
            <Card.Root w="full" size="lg" bg="white" _dark={{ bg: 'gray.900' }}>
              <Card.Body px={7} py={7}>
                <form onSubmit={joinRoom}>
                  <VStack gap={5} align="stretch">
                    <Field.Root required>
                      <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                        Room Password
                      </Field.Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        size="lg"
                        autoFocus
                      />
                      <Field.HelperText fontSize="xs" mt={1.5}>
                        Ask the room owner for the password
                      </Field.HelperText>
                    </Field.Root>

                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      loading={loading}
                      colorScheme="blue"
                    >
                      Join Whiteboard
                    </Button>
                  </VStack>
                </form>
              </Card.Body>
            </Card.Root>
          )}

          {/* No Password - Direct Join */}
          {room && !room.room_password && (
            <Card.Root w="full" size="lg" bg="white" _dark={{ bg: 'gray.900' }}>
              <Card.Body px={7} py={7}>
                <VStack gap={4} textAlign="center">
                  <Text color="fg.muted" fontSize="sm">
                    This room has no password protection
                  </Text>
                  <Button
                    size="lg"
                    w="full"
                    loading={loading}
                    colorScheme="blue"
                    onClick={joinRoom}
                  >
                    Join Whiteboard
                  </Button>
                </VStack>
              </Card.Body>
            </Card.Root>
          )}

          {/* Cancel Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            colorScheme="gray"
          >
            Back to Dashboard
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

export default function JoinRoomPage() {
  return (
    <Suspense
      fallback={
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Text>Loading...</Text>
        </Box>
      }
    >
      <JoinRoomContent />
    </Suspense>
  );
}
