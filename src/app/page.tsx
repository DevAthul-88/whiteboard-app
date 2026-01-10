'use client';

import { useEffect, useState } from 'react';
import { createClient } from './lib/supabase/client';
import { Container, Heading, VStack, Button, Text, Box, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import LandingPage from './components/LandingPage';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // Handle hash fragment from email verification
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // If there are tokens in the URL, set the session
      if (accessToken && refreshToken && type === 'signup') {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error) {
          // Clear the hash and redirect to dashboard
          window.history.replaceState(null, '', window.location.pathname);
          router.push('/dashboard');
          return;
        }
      }

      // Check if user is already logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color="fg.muted">
            Loading...
          </Text>
        </VStack>
      </Box>
    );
  }


  return (
    <div>
      <LandingPage />
    </div>
  );
}
