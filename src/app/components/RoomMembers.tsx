'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';
import { Box, VStack, HStack, Text, Badge, Heading } from '@chakra-ui/react';
import type { UserPresence } from '../lib/types';

interface RoomMembersProps {
  roomId: string;
}

export default function RoomMembers({ roomId }: RoomMembersProps) {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}:presence`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: UserPresence[] = [];

        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          presences.forEach((presence) => {
            users.push(presence as UserPresence);
          });
        });

        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', user.id)
              .single();

            await channel.track({
              userId: user.id,
              username: profile?.username || user.email,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return (
    <Box
      position="fixed"
      top={20}
      right={4}
      bg="white"
      p={4}
      borderRadius="lg"
      boxShadow="lg"
      maxW="250px"
      zIndex={999}
      _dark={{ bg: 'gray.800' }}
    >
      <Heading size="sm" mb={4}>
        Online Users ({onlineUsers.length})
      </Heading>
      <VStack gap={2} align="stretch">
        {onlineUsers.map((user) => (
          <HStack key={user.userId} gap={3}>
            <Box w={3} h={3} borderRadius="full" bg={user.color} />
            <Text fontSize="sm" truncate>
              {user.username}
            </Text>
            <Badge colorPalette="green" ml="auto">
              Online
            </Badge>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
