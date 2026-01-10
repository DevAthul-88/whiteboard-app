'use client';

import { useState } from 'react';
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
  Link,
  Card,
  InputGroup,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { toaster } from '@/app/components/ui/toaster';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Logo from '@/app/components/logo';
import { Formik, Form, Field as FormikField } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (
    values: { email: string; password: string },
    { setSubmitting }: any
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toaster.create({
        title: 'Login successful!',
        type: 'success',
        duration: 2000,
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toaster.create({
        title: 'Login failed',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
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

      <Container maxW="440px" w="full" px={4} position="relative" zIndex={1}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
            <Form>
              <VStack gap={6} w="full">
                {/* Logo/Brand */}
                <VStack textAlign="center">
                     <Link href={'/'}>
                  <Logo />
                  </Link>
                  <Heading
                    size="2xl"
                    fontWeight="bold"
                    letterSpacing="tight"
                    bgGradient="linear(to-r, gray.900, gray.700)"
                    bgClip="text"
                    _dark={{
                      bgGradient: 'linear(to-r, gray.50, gray.400)',
                    }}
                  >
                    Welcome back
                  </Heading>

                  <Text color="fg.muted" fontSize="sm">
                    Enter your credentials to access your account
                  </Text>
                </VStack>

                {/* Login Card */}
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
                  <Card.Body px={7} py={7}>
                    <VStack gap={4.5} align="stretch">
                      {/* Email Field */}
                      <Field.Root
                        required
                        invalid={!!(touched.email && errors.email)}
                      >
                        <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                          Email address
                        </Field.Label>
                        <InputGroup
                          startElement={
                            <Mail size={18} strokeWidth={2} opacity={0.5} />
                          }
                        >
                          <Input
                            as="input"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="name@company.com"
                            size="lg"
                            bg="white"
                            _dark={{ bg: 'gray.950' }}
                            _focus={{
                              borderColor: 'colorPalette.500',
                              boxShadow:
                                '0 0 0 1px var(--chakra-colors-colorPalette-500)',
                              _dark: {
                                borderColor: 'colorPalette.400',
                                boxShadow:
                                  '0 0 0 1px var(--chakra-colors-colorPalette-400)',
                              },
                            }}
                          />
                        </InputGroup>
                        {touched.email && errors.email && (
                          <Field.ErrorText fontSize="sm" mt={1.5}>
                            {errors.email}
                          </Field.ErrorText>
                        )}
                      </Field.Root>

                      {/* Password Field */}
                      <Field.Root
                        required
                        invalid={!!(touched.password && errors.password)}
                      >
                        <Box display="flex" justifyContent="space-between" mb={2}>
                          <Field.Label fontSize="sm" fontWeight="semibold">
                            Password
                          </Field.Label>
                        </Box>
                        <InputGroup
                          startElement={
                            <Lock size={18} strokeWidth={2} opacity={0.5} />
                          }
                          endElement={
                            <IconButton
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                              }
                            >
                              {showPassword ? (
                                <EyeOff size={18} strokeWidth={2} />
                              ) : (
                                <Eye size={18} strokeWidth={2} />
                              )}
                            </IconButton>
                          }
                        >
                          <Input
                            as="input"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your password"
                            size="lg"
                            bg="white"
                            _dark={{ bg: 'gray.950' }}
                            _focus={{
                              borderColor: 'colorPalette.500',
                              boxShadow:
                                '0 0 0 1px var(--chakra-colors-colorPalette-500)',
                              _dark: {
                                borderColor: 'colorPalette.400',
                                boxShadow:
                                  '0 0 0 1px var(--chakra-colors-colorPalette-400)',
                              },
                            }}
                          />
                        </InputGroup>
                        {touched.password && errors.password && (
                          <Field.ErrorText fontSize="sm" mt={1.5}>
                            {errors.password}
                          </Field.ErrorText>
                        )}
                      </Field.Root>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        w="full"
                        loading={isSubmitting}
                        mt={2}
                        color="white"
                        fontWeight="semibold"
                        colorScheme="blue"
                        transition="all 0.2s"
                      >
                        Sign in to your account
                      </Button>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Sign Up Link */}
                <HStack
                  gap={1}
                  fontSize="sm"
                  color="fg.muted"
                  justify="center"
                  flexWrap="wrap"
                >
                  <Text>Don't have an account?</Text>
                  <Link
                    asChild
                    fontWeight="semibold"
                    colorScheme="blue"
                    _dark={{ color: 'colorPalette.400' }}
                    _hover={{
                      color: 'colorPalette.700',
                      _dark: { color: 'colorPalette.300' },
                      textDecoration: 'underline',
                    }}
                  >
                    <NextLink href="/auth/signup">Sign up for free</NextLink>
                  </Link>
                </HStack>
              </VStack>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}
