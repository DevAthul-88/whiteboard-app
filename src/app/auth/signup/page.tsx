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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { toaster } from '@/app/components/ui/toaster';
import { Mail, Lock, Eye, EyeOff, User, UserCircle } from 'lucide-react';
import Logo from '@/app/components/logo';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (
    values: {
      username: string;
      fullName: string;
      email: string;
      password: string;
    },
    { setSubmitting }: any
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            full_name: values.fullName,
          },
        },
      });

      if (error) throw error;

      toaster.create({
        title: 'Account created successfully!',
        description: 'Please check your email for verification.',
        type: 'success',
        duration: 5000,
      });

      router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      toaster.create({
        title: 'Signup failed',
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

      <Container maxW="600px" w="full" px={4} position="relative" zIndex={1} py={8}>
        <Formik
          initialValues={{
            username: '',
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
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
                    Create your account
                  </Heading>

                  <Text color="fg.muted" fontSize="sm">
                    Start collaborating with your team today
                  </Text>
                </VStack>

                {/* Signup Card */}
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
                    <VStack gap={4} align="stretch">
                      {/* Row 1: Username and Full Name */}
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        {/* Username Field */}
                        <GridItem>
                          <Field.Root
                            required
                            invalid={!!(touched.username && errors.username)}
                          >
                            <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                              Username
                            </Field.Label>
                            <InputGroup
                              startElement={
                                <User size={18} strokeWidth={2} opacity={0.5} />
                              }
                            >
                              <Input
                                as="input"
                                name="username"
                                type="text"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="johndoe"
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
                            {touched.username && errors.username && (
                              <Field.ErrorText fontSize="sm" mt={1.5}>
                                {errors.username}
                              </Field.ErrorText>
                            )}
                          </Field.Root>
                        </GridItem>

                        {/* Full Name Field */}
                        <GridItem>
                          <Field.Root invalid={!!(touched.fullName && errors.fullName)}>
                            <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                              Full name{' '}
                              <Text as="span" color="fg.muted" fontWeight="normal">
                                (optional)
                              </Text>
                            </Field.Label>
                            <InputGroup
                              startElement={
                                <UserCircle size={18} strokeWidth={2} opacity={0.5} />
                              }
                            >
                              <Input
                                as="input"
                                name="fullName"
                                type="text"
                                value={values.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="John Doe"
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
                            {touched.fullName && errors.fullName && (
                              <Field.ErrorText fontSize="sm" mt={1.5}>
                                {errors.fullName}
                              </Field.ErrorText>
                            )}
                          </Field.Root>
                        </GridItem>
                      </Grid>

                      {/* Email Field - Full Width */}
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

                      {/* Row 2: Password and Confirm Password */}
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        {/* Password Field */}
                        <GridItem>
                          <Field.Root
                            required
                            invalid={!!(touched.password && errors.password)}
                          >
                            <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                              Password
                            </Field.Label>
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
                                placeholder="Min 6 chars"
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
                        </GridItem>

                        {/* Confirm Password Field */}
                        <GridItem>
                          <Field.Root
                            required
                            invalid={!!(touched.confirmPassword && errors.confirmPassword)}
                          >
                            <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                              Confirm password
                            </Field.Label>
                            <InputGroup
                              startElement={
                                <Lock size={18} strokeWidth={2} opacity={0.5} />
                              }
                              endElement={
                                <IconButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  aria-label={
                                    showConfirmPassword ? 'Hide password' : 'Show password'
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff size={18} strokeWidth={2} />
                                  ) : (
                                    <Eye size={18} strokeWidth={2} />
                                  )}
                                </IconButton>
                              }
                            >
                              <Input
                                as="input"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Re-enter password"
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
                            {touched.confirmPassword && errors.confirmPassword && (
                              <Field.ErrorText fontSize="sm" mt={1.5}>
                                {errors.confirmPassword}
                              </Field.ErrorText>
                            )}
                          </Field.Root>
                        </GridItem>
                      </Grid>

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
                        Create account
                      </Button>

                      {/* Terms */}
                      <Text fontSize="xs" color="fg.muted" textAlign="center">
                        By signing up, you agree to our{' '}
                        <Link
                          asChild
                          color="colorPalette.600"
                          _dark={{ color: 'colorPalette.400' }}
                        >
                          <NextLink href="/terms">Terms</NextLink>
                        </Link>{' '}
                        and{' '}
                        <Link
                          asChild
                          color="colorPalette.600"
                          _dark={{ color: 'colorPalette.400' }}
                        >
                          <NextLink href="/privacy">Privacy Policy</NextLink>
                        </Link>
                      </Text>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                {/* Login Link */}
                <HStack
                  gap={1}
                  fontSize="sm"
                  color="fg.muted"
                  justify="center"
                  flexWrap="wrap"
                >
                  <Text>Already have an account?</Text>
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
                    <NextLink href="/auth/login">Sign in</NextLink>
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
