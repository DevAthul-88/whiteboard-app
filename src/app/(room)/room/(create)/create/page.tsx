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
  Card,
  HStack,
  NumberInput,
  Switch,
  Grid,
  GridItem,
  Separator,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { toaster } from '@/app/components/ui/toaster';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Lock, Users, Globe, Shield, FileText, Info } from 'lucide-react';

// Validation Schema
const CreateRoomSchema = Yup.object().shape({
  roomName: Yup.string()
    .min(3, 'Room name must be at least 3 characters')
    .max(50, 'Room name must be less than 50 characters')
    .required('Room name is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .max(20, 'Password must be less than 20 characters'),
  maxUsers: Yup.number()
    .min(2, 'Minimum 2 users required')
    .max(50, 'Maximum 50 users allowed')
    .required('Max users is required'),
});

export default function CreateRoomPage() {
  const router = useRouter();
  const supabase = createClient();

  const createRoom = async (
    values: {
      roomName: string;
      isPublic: boolean;
      password: string;
      maxUsers: number;
    },
    { setSubmitting }: any
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('drawing_rooms')
        .insert({
          name: values.roomName,
          owner_id: user.id,
          is_public: values.isPublic,
          room_password: values.password || null,
          max_users: values.maxUsers,
          drawing: {},
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('room_members').insert({
        room_id: data.id,
        user_id: user.id,
        role: 'owner',
      });

      toaster.create({
        title: 'Room created successfully!',
        description: 'Redirecting to your new whiteboard...',
        type: 'success',
        duration: 2000,
      });

      router.push(`/room/${data.id}`);
    } catch (error: any) {
      toaster.create({
        title: 'Error creating room',
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
      minH="calc(100vh - 73px)"
      display="flex"
      alignItems="center"
      position="relative"
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

      <Container maxW="1200px" py={8} position="relative">
        <Formik
          initialValues={{
            roomName: '',
            isPublic: false,
            password: '',
            maxUsers: 10,
          }}
          validationSchema={CreateRoomSchema}
          onSubmit={createRoom}
        >
          {({ errors, touched, isSubmitting, values, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <VStack gap={6} w="full">
                {/* Header */}
                <VStack gap={2} textAlign="center">
                  <Heading
                    size={{ base: 'xl', md: '2xl' }}
                    fontWeight="bold"
                    bgGradient="linear(to-r, gray.900, gray.700)"
                    bgClip="text"
                    _dark={{
                      bgGradient: 'linear(to-r, gray.50, gray.400)',
                    }}
                  >
                    Create New Whiteboard
                  </Heading>
                  <Text color="fg.muted" fontSize="sm" maxW="md">
                    Configure your collaborative workspace with custom settings
                  </Text>
                </VStack>

                {/* Two Column Grid Layout */}
                <Grid
                  templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                  gap={6}
                  w="full"
                >
                  {/* LEFT COLUMN */}
                  <GridItem>
                    <Card.Root
                      h="full"
                      size="lg"
                      bg="white"
                      _dark={{ bg: 'gray.900' }}
                    >
                      <Card.Body px={6} py={6}>
                        <VStack gap={6} align="stretch">
                          {/* Section 1: Basic Information */}
                          <VStack align="stretch" gap={5}>
                            <HStack gap={2}>
                              <FileText size={18} strokeWidth={2} />
                              <Heading size="sm" fontWeight="semibold">
                                Basic Information
                              </Heading>
                            </HStack>

                            <Field.Root
                              required
                              invalid={!!(touched.roomName && errors.roomName)}
                            >
                              <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                                Whiteboard Name
                              </Field.Label>
                              <Input
                                name="roomName"
                                value={values.roomName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g., Team Brainstorming Session"
                                size="lg"
                              />
                              {touched.roomName && errors.roomName && (
                                <Field.ErrorText fontSize="sm" mt={1.5}>
                                  {errors.roomName}
                                </Field.ErrorText>
                              )}
                              <Field.HelperText fontSize="xs" mt={1.5}>
                                A clear, descriptive name helps team members identify this whiteboard
                              </Field.HelperText>
                            </Field.Root>
                          </VStack>

                          <Separator />

                          {/* Section 2: Capacity Settings */}
                          <VStack align="stretch" gap={5}>
                            <HStack gap={2}>
                              <Users size={18} strokeWidth={2} />
                              <Heading size="sm" fontWeight="semibold">
                                Capacity Settings
                              </Heading>
                            </HStack>

                            <Field.Root
                              required
                              invalid={!!(touched.maxUsers && errors.maxUsers)}
                            >
                              <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                                Maximum Collaborators
                              </Field.Label>
                              <NumberInput.Root
                                value={values.maxUsers.toString()}
                                onValueChange={(details: { value: string; valueAsNumber: number }) =>
                                  setFieldValue('maxUsers', details.valueAsNumber || 10)
                                }
                                min={2}
                                max={50}
                                size="lg"
                              >
                                <NumberInput.Input />
                              </NumberInput.Root>
                              {touched.maxUsers && errors.maxUsers && (
                                <Field.ErrorText fontSize="sm" mt={1.5}>
                                  {errors.maxUsers}
                                </Field.ErrorText>
                              )}
                              <Field.HelperText fontSize="xs" mt={1.5}>
                                Set the maximum number of people who can collaborate simultaneously (2-50 users)
                              </Field.HelperText>
                            </Field.Root>

                            <Box
                              p={3}
                              borderRadius="md"
                              bg="gray.100"
                              _dark={{ bg: 'gray.800' }}
                            >
                              <VStack align="start" gap={1}>
                                <Text fontSize="xs" fontWeight="semibold">
                                  Current: {values.maxUsers} {values.maxUsers === 1 ? 'user' : 'users'}
                                </Text>
                                <Text fontSize="xs" color="fg.muted">
                                  Recommended: 5-15 for optimal performance
                                </Text>
                              </VStack>
                            </Box>
                          </VStack>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  </GridItem>

                  {/* RIGHT COLUMN */}
                  <GridItem>
                    <Card.Root
                      h="full"
                      size="lg"
                      bg="white"
                      _dark={{ bg: 'gray.900' }}
                    >
                      <Card.Body px={6} py={6}>
                        <VStack gap={6} align="stretch">
                          {/* Section 3: Privacy & Access */}
                          <VStack align="stretch" gap={5}>
                            <HStack gap={2}>
                              <Shield size={18} strokeWidth={2} />
                              <Heading size="sm" fontWeight="semibold">
                                Privacy & Access Control
                              </Heading>
                            </HStack>

                            {/* Public/Private Toggle */}
                            <Box
                              p={4}
                              borderRadius="lg"
                              border="1px solid"
                              borderColor="gray.200"
                              bg="gray.50"
                              _dark={{ borderColor: 'gray.800', bg: 'gray.950' }}
                            >
                              <VStack align="stretch" gap={3}>
                                <HStack justify="space-between">
                                  <HStack gap={3}>
                                    {values.isPublic ? (
                                      <Box
                                        w={10}
                                        h={10}
                                        borderRadius="lg"
                                        bg="green.100"
                                        color="green.600"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        _dark={{ bg: 'green.900', color: 'green.300' }}
                                      >
                                        <Globe size={20} strokeWidth={2} />
                                      </Box>
                                    ) : (
                                      <Box
                                        w={10}
                                        h={10}
                                        borderRadius="lg"
                                        bg="purple.100"
                                        color="purple.600"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        _dark={{ bg: 'purple.900', color: 'purple.300' }}
                                      >
                                        <Lock size={20} strokeWidth={2} />
                                      </Box>
                                    )}
                                    <VStack align="start" gap={0}>
                                      <Text fontWeight="semibold" fontSize="sm">
                                        {values.isPublic ? 'Public Whiteboard' : 'Private Whiteboard'}
                                      </Text>
                                      <Text fontSize="xs" color="fg.muted">
                                        {values.isPublic
                                          ? 'Discoverable by anyone with the link'
                                          : 'Access restricted to invited members only'}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Switch.Root
                                    checked={values.isPublic}
                                    onCheckedChange={(details: { checked: boolean }) =>
                                      setFieldValue('isPublic', details.checked)
                                    }
                                    colorPalette="blue"
                                  >
                                    <Switch.HiddenInput />
                                    <Switch.Control>
                                      <Switch.Thumb />
                                    </Switch.Control>
                                  </Switch.Root>
                                </HStack>

                                {/* Info Box */}
                                <Box
                                  p={3}
                                  borderRadius="md"
                                  bg="blue.50"
                                  borderLeft="3px solid"
                                  borderLeftColor="blue.500"
                                  _dark={{ bg: 'blue.950/30', borderLeftColor: 'blue.400' }}
                                >
                                  <HStack gap={2} align="start">
                                    <Info size={16} strokeWidth={2} />
                                    <Text fontSize="xs" color="fg.muted">
                                      {values.isPublic
                                        ? 'Public whiteboards are perfect for open collaboration and sharing ideas with a wider audience.'
                                        : 'Private whiteboards are ideal for confidential projects and team-specific work.'}
                                    </Text>
                                  </HStack>
                                </Box>
                              </VStack>
                            </Box>

                            {/* Password (Optional) */}
                            <Field.Root invalid={!!(touched.password && errors.password)}>
                              <Field.Label fontSize="sm" fontWeight="semibold" mb={2}>
                                Password Protection{' '}
                                <Text as="span" color="fg.muted" fontWeight="normal">
                                  (optional)
                                </Text>
                              </Field.Label>
                              <Input
                                name="password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Set a secure password"
                                size="lg"
                              />
                              {touched.password && errors.password && (
                                <Field.ErrorText fontSize="sm" mt={1.5}>
                                  {errors.password}
                                </Field.ErrorText>
                              )}
                              <Field.HelperText fontSize="xs" mt={1.5}>
                                Add an extra layer of security. Users will need this password to join the whiteboard
                              </Field.HelperText>
                            </Field.Root>
                          </VStack>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  </GridItem>
                </Grid>

                {/* Action Buttons */}
                <HStack w="full" justify="end" gap={4}>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard')}
                    colorScheme="gray"
                    size="lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    colorScheme="blue"
                    minW="200px"
                  >
                    Create Whiteboard
                  </Button>
                </HStack>
              </VStack>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}
