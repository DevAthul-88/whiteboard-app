'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  Card,
  HStack,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Logo from '@/app/components/logo';
import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import { toaster } from '@/app/components/ui/toaster';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const supabase = createClient();

  const handleResendEmail = async () => {
    if (!email) {
      toaster.create({
        title: 'Error',
        description: 'Email address not found',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toaster.create({
        title: 'Email sent!',
        description: 'Check your inbox for the verification link.',
        type: 'success',
        duration: 4000,
      });
    } catch (error: any) {
      toaster.create({
        title: 'Failed to resend',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <Box
      colorPalette="blue"
      minH="100vh"
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
      bg="white"
      _dark={{ bg: 'gray.950' }}
    >
      {/* Geometric Grid Background */}
      <Box
        position="absolute"
        inset={0}
        bgImage="linear-gradient(to right, rgb(59 130 246 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(59 130 246 / 0.08) 1px, transparent 1px)"
        bgSize="80px 80px"
        _dark={{
          bgImage:
            'linear-gradient(to right, rgb(59 130 246 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(59 130 246 / 0.05) 1px, transparent 1px)',
        }}
        maskImage="radial-gradient(ellipse 80% 50% at 50% 50%, #000 60%, transparent 100%)"
        WebkitMaskImage="radial-gradient(ellipse 80% 50% at 50% 50%, #000 60%, transparent 100%)"
      />

      {/* Top Gradient Orb */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="600px"
        h="600px"
        borderRadius="full"
        bg="colorPalette.500"
        opacity={0.15}
        filter="blur(80px)"
        _dark={{ opacity: 0.08 }}
        pointerEvents="none"
      />

      {/* Bottom Gradient Orb */}
      <Box
        position="absolute"
        bottom="-30%"
        left="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="purple.500"
        opacity={0.12}
        filter="blur(80px)"
        _dark={{ opacity: 0.06 }}
        pointerEvents="none"
      />

      <Container maxW="500px" w="full" px={4} position="relative" zIndex={1}>
        <VStack gap={6} w="full">
          {/* Logo */}
          <VStack textAlign="center">
             <Link href={'/'}>
            <Logo />
            </Link>
          </VStack>

          {/* Main Card */}
          <Card.Root
            w="full"
            size="lg"
            bg="white/80"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="0 20px 25px -5px rgb(0 0 0 / 0.06), 0 8px 10px -6px rgb(0 0 0 / 0.06)"
            _dark={{
              bg: 'gray.900/50',
              borderColor: 'gray.800',
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
            }}
          >
            <Card.Body px={8} py={10}>
              <VStack gap={5} textAlign="center">
                {/* Icon */}
                <Box
                  w={16}
                  h={16}
                  borderRadius="full"
                  bg="colorPalette.100"
                  color="colorPalette.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _dark={{
                    bg: 'colorPalette.900',
                    color: 'colorPalette.300',
                  }}
                >
                  <Mail size={32} strokeWidth={2} />
                </Box>

                {/* Heading */}
                <VStack gap={2}>
                  <Heading
                    size="xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, gray.900, gray.700)"
                    bgClip="text"
                    _dark={{
                      bgGradient: 'linear(to-r, gray.50, gray.400)',
                    }}
                  >
                    Check your email
                  </Heading>
                  <Text color="fg.muted" fontSize="sm" maxW="380px">
                    We've sent a verification link to{' '}
                    {email && (
                      <Text as="span" fontWeight="semibold" color="fg.default">
                        {email}
                      </Text>
                    )}
                  </Text>
                </VStack>

                {/* Instructions */}
                <Box
                  w="full"
                  p={4}
                  bg="colorPalette.50"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="colorPalette.100"
                  _dark={{
                    bg: 'colorPalette.950/30',
                    borderColor: 'colorPalette.900',
                  }}
                >
                  <VStack gap={2} align="start" fontSize="sm" color="fg.muted">
                    <Text>
                      <Text as="span" fontWeight="semibold" color="fg.default">
                        1.
                      </Text>{' '}
                      Open the email and click the verification link
                    </Text>
                    <Text>
                      <Text as="span" fontWeight="semibold" color="fg.default">
                        2.
                      </Text>{' '}
                      You'll be redirected to complete your setup
                    </Text>
                    <Text>
                      <Text as="span" fontWeight="semibold" color="fg.default">
                        3.
                      </Text>{' '}
                      Start collaborating with your team!
                    </Text>
                  </VStack>
                </Box>

                {/* Resend Button */}
                <VStack gap={3} w="full">
                  <Button
                    variant="outline"
                    size="lg"
                    w="full"
                    colorScheme="blue"
                    onClick={handleResendEmail}
                    loading={resending}
                  >
                    Resend verification email
                  </Button>

                  <Text fontSize="xs" color="fg.muted">
                    Didn't receive the email? Check your spam folder
                  </Text>
                </VStack>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Back to Login */}
          <HStack gap={1} fontSize="sm" color="fg.muted">
            <ArrowLeft size={16} />
            <Link
              asChild
              fontWeight="semibold"
              color="colorPalette.600"
              _dark={{ color: 'colorPalette.400' }}
              _hover={{
                color: 'colorPalette.700',
                _dark: { color: 'colorPalette.300' },
                textDecoration: 'underline',
              }}
            >
              <NextLink href="/auth/login">Back to login</NextLink>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
