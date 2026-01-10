'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '../lib/supabase/client';

interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

interface WhiteboardChatProps {
  roomId: string;
  currentUserName: string;
  isDarkMode: boolean;
}

export default function WhiteboardChat({
  roomId,
  currentUserName,
  isDarkMode,
}: WhiteboardChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const bgColor = isDarkMode ? '#2d3748' : 'white';
  const borderColor = isDarkMode ? '#4a5568' : '#e2e8f0';
  const messageBg = isDarkMode ? '#1a202c' : '#f7fafc';
  const ownMessageBg = isDarkMode ? '#2563eb' : '#3b82f6';
  const textColor = isDarkMode ? '#e2e8f0' : '#1a202c';
  const mutedTextColor = isDarkMode ? '#a0aec0' : '#718096';
  const iconColor = isDarkMode ? '#e2e8f0' : '#2d3748';
  const scrollbarTrack = isDarkMode ? '#1a202c' : '#f7fafc';
  const scrollbarThumb = isDarkMode ? '#4a5568' : '#cbd5e0';

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data || []);
    };

    loadMessages();
  }, [roomId]);

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
          
          // Increment unread count if chat is closed or minimized
          if (!isOpen || isMinimized) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, isOpen, isMinimized]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('chat_messages').insert({
      room_id: roomId,
      user_id: user.id,
      user_name: currentUserName,
      message: newMessage.trim(),
    });

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setUnreadCount(0);
    }
  };

  // Chat toggle button (when closed)
  if (!isOpen) {
    return (
      <Button
        position="fixed"
        bottom={4}
        right={4}
        zIndex={1000}
        colorPalette="blue"
        variant="solid"
        size="lg"
        onClick={handleOpen}
        boxShadow="lg"
      >
        <MessageCircle size={20} />
        Chat
        {unreadCount > 0 && (
          <Box
            position="absolute"
            top="-8px"
            right="-8px"
            bg="red.500"
            color="white"
            borderRadius="full"
            w="24px"
            h="24px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Box>
        )}
      </Button>
    );
  }

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      w={{ base: '90vw', sm: '380px' }}
      h={isMinimized ? 'auto' : '500px'}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="2xl"
      border="1px solid"
      borderColor={borderColor}
      zIndex={1000}
      display="flex"
      flexDirection="column"
      transition="all 0.3s ease"
    >
      {/* Header */}
      <HStack
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor={borderColor}
        justifyContent="space-between"
      >
        <HStack gap={2}>
          <Box color={iconColor}>
            <MessageCircle size={18} />
          </Box>
          <Text fontWeight="semibold" fontSize="sm" color={textColor}>
            Chat
          </Text>
          {unreadCount > 0 && isMinimized && (
            <Box
              bg="red.500"
              color="white"
              borderRadius="full"
              px={2}
              py={0.5}
              fontSize="xs"
              fontWeight="bold"
            >
              {unreadCount}
            </Box>
          )}
        </HStack>
        <HStack gap={1}>
          <IconButton
            aria-label="Minimize"
            size="sm"
            variant="ghost"
            onClick={handleMinimize}
            color={iconColor}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </IconButton>
          <IconButton
            aria-label="Close"
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            color={iconColor}
          >
            <X size={16} />
          </IconButton>
        </HStack>
      </HStack>

      {/* Messages */}
      {!isMinimized && (
        <>
          <VStack
            flex={1}
            overflowY="auto"
            px={4}
            py={3}
            gap={2}
            align="stretch"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: scrollbarTrack,
              },
              '&::-webkit-scrollbar-thumb': {
                background: scrollbarThumb,
                borderRadius: '3px',
              },
            }}
          >
            {messages.length === 0 && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100%"
                color={mutedTextColor}
              >
                <Text fontSize="sm">No messages yet. Start chatting!</Text>
              </Box>
            )}

            {messages.map((msg) => {
              const isOwnMessage = msg.user_name === currentUserName;
              return (
                <Box
                  key={msg.id}
                  alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                  maxW="75%"
                >
                  {!isOwnMessage && (
                    <Text fontSize="xs" color={mutedTextColor} mb={1}>
                      {msg.user_name}
                    </Text>
                  )}
                  <Box
                    bg={isOwnMessage ? ownMessageBg : messageBg}
                    color={isOwnMessage ? 'white' : textColor}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    wordBreak="break-word"
                  >
                    <Text fontSize="sm">{msg.message}</Text>
                  </Box>
                  <Text fontSize="xs" color={mutedTextColor} mt={1}>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <HStack
            px={4}
            py={3}
            borderTop="1px solid"
            borderColor={borderColor}
            gap={2}
          >
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              size="sm"
              maxLength={1000}
              color={textColor}
              _placeholder={{ color: mutedTextColor }}
            />
            <IconButton
              aria-label="Send message"
              colorPalette="blue"
              size="sm"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={16} />
            </IconButton>
          </HStack>
        </>
      )}
    </Box>
  );
}