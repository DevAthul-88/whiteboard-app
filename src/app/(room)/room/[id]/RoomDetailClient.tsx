'use client';

import { useEffect, useState } from 'react';
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
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { toaster } from '@/app/components/ui/toaster';
import {
  Lock,
  Users,
  Globe,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { DrawingRoom } from '@/app/lib/types';

interface RoomDetailClientProps {
  roomId: string;
}

export default function RoomDetailClient({ roomId }: RoomDetailClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<DrawingRoom | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    if (roomId) {
      checkRoomAccess();
    }
  }, [roomId]);

  const checkRoomAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/auth/login?redirect=/room/${roomId}`);
        return;
      }

      // Get room details
      const { data: roomData, error: roomError } = await supabase
        .from('drawing_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) {
        setError('Room not found or you do not have access');
        return;
      }

      setRoom(roomData);

      // Get current member count
      const { count } = await supabase
        .from('room_members')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId);

      setMemberCount(count || 0);

      // Check if user is already a member
      const { data: memberData } = await supabase
        .from('room_members')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();

      if (memberData) {
        // User is already a member, redirect to whiteboard
        router.push(`/room/${roomId}/whiteboard`);
        return;
      }

      // Check if room requires password
      if (roomData.room_password) {
        setRequiresPassword(true);
      } else {
        // No password required, add user directly
        await joinRoomDirectly(user.id, roomData);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  const joinRoomDirectly = async (userId: string, roomData: DrawingRoom) => {
    try {
      // Check if room is full
      if (memberCount >= roomData.max_users) {
        setError(`Room is full (${memberCount}/${roomData.max_users} members)`);
        return;
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('room_members')
        .insert({
          room_id: roomId,
          user_id: userId,
          role: 'editor',
        });

      if (memberError) throw memberError;

      toaster.create({
        title: 'Joined successfully!',
        description: 'Redirecting to whiteboard...',
        type: 'success',
        duration: 2000,
      });

      router.push(`/room/${roomId}/whiteboard`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !room) return;

      // Verify password
      if (password !== room.room_password) {
        setError('Incorrect password. Please try again.');
        setPassword('');
        setVerifying(false);
        return;
      }

      // Check if room is full
      if (memberCount >= room.max_users) {
        setError(`Room is full (${memberCount}/${room.max_users} members)`);
        setVerifying(false);
        return;
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('room_members')
        .insert({
          room_id: roomId,
          user_id: user.id,
          role: 'editor',
        });

      if (memberError) throw memberError;

      toaster.create({
        title: 'Access granted!',
        description: 'Welcome to the whiteboard...',
        type: 'success',
        duration: 2000,
      });

      router.push(`/room/${roomId}/whiteboard`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setVerifying(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="fg.muted">Loading room details...</Text>
        </VStack>
      </Box>
    );
  }

  // Error State
  if (error && !room) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        _dark={{ bg: 'gray.950' }}
      >
        <Container maxW="500px">
          <Card.Root size="lg">
            <Card.Body py={10}>
              <VStack gap={6} textAlign="center">
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
                  <Heading size="lg">Room Not Found</Heading>
                  <Text color="fg.muted" fontSize="sm">
                    {error}
                  </Text>
                </VStack>
                <Button onClick={() => router.push('/dashboard')} colorScheme="blue" size="lg">
                  <ArrowLeft size={18} strokeWidth={2} />
                  Back to Dashboard
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Container>
      </Box>
    );
  }

  // Password Required State
  if (requiresPassword && room) {
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

        <Container maxW="550px" py={8} position="relative">
          <VStack gap={6} w="full">
            {/* Back Button */}
            <Button
              variant="ghost"
              alignSelf="start"
              onClick={() => router.push('/dashboard')}
              colorScheme="gray"
            >
              <ArrowLeft size={18} strokeWidth={2} />
              Back to Dashboard
            </Button>

            {/* Header */}
            <VStack gap={3} textAlign="center" w="full">
              <Box
                w={20}
                h={20}
                borderRadius="full"
                bg="blue.100"
                color="blue.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _dark={{ bg: 'blue.900', color: 'blue.300' }}
              >
                <Shield size={40} strokeWidth={2} />
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
                Protected Whiteboard
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                This whiteboard requires a password to access
              </Text>
            </VStack>

            {/* Room Info Card */}
            <Card.Root w="full" size="lg" bg="white" _dark={{ bg: 'gray.900' }}>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <VStack gap={2} align="start">
                    <Heading size="md" fontWeight="semibold">
                      {room.name}
                    </Heading>
                    <HStack gap={3} flexWrap="wrap">
                      <Badge
                        colorScheme={room.is_public ? 'green' : 'purple'}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        {room.is_public ? (
                          <Globe size={12} strokeWidth={2.5} />
                        ) : (
                          <Lock size={12} strokeWidth={2.5} />
                        )}
                        {room.is_public ? 'Public' : 'Private'}
                      </Badge>
                      <Badge colorScheme="blue" display="flex" alignItems="center" gap={1}>
                        <Users size={12} strokeWidth={2.5} />
                        {memberCount}/{room.max_users} members
                      </Badge>
                    </HStack>
                  </VStack>

                  {/* Password Form */}
                  <form onSubmit={handlePasswordSubmit}>
                    <VStack gap={4} align="stretch" pt={4}>
                      <Field.Root required invalid={!!error}>
                        <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                          Enter Password
                        </Field.Label>
                        <Box position="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter room password"
                            size="lg"
                            pr="50px"
                            autoFocus
                          />
                          <Box
                            position="absolute"
                            right={3}
                            top="50%"
                            transform="translateY(-50%)"
                            cursor="pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            color="fg.muted"
                            _hover={{ color: 'fg' }}
                          >
                            {showPassword ? (
                              <EyeOff size={20} strokeWidth={2} />
                            ) : (
                              <Eye size={20} strokeWidth={2} />
                            )}
                          </Box>
                        </Box>
                        {error && (
                          <Field.ErrorText fontSize="sm" mt={1.5}>
                            {error}
                          </Field.ErrorText>
                        )}
                        <Field.HelperText fontSize="xs" mt={1.5}>
                          Ask the room owner for the password
                        </Field.HelperText>
                      </Field.Root>

                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        loading={verifying}
                        colorScheme="blue"
                      >
                        <CheckCircle size={18} strokeWidth={2} />
                        Verify & Join
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Security Note */}
            <Card.Root
              w="full"
              size="sm"
              bg="blue.50"
              borderLeft="3px solid"
              borderLeftColor="blue.500"
              _dark={{ bg: 'blue.950/30', borderLeftColor: 'blue.400' }}
            >
              <Card.Body py={3} px={4}>
                <HStack gap={2} align="start">
                  <Lock size={16} strokeWidth={2} />
                  <Text fontSize="xs" color="fg.muted">
                    Your access is secured. Only users with the correct password can join this
                    collaborative workspace.
                  </Text>
                </HStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Container>
      </Box>
    );
  }

  return null;
}
