'use client';

import {
  Box,
  Button,
  Container,
  HStack,
  IconButton,
  Text,
  Drawer,
  VStack,
  Portal,
  CloseButton,
  Separator,
  Dialog,
  Input,
  Field,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';
import { Menu, Home, Plus, LogOut, User, Edit, Files } from 'lucide-react';
import Logo from './logo';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
  });

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Initialize form data
      if (user) {
        setFormData({
          username: user.user_metadata?.username || '',
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
        });
      }
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          username: formData.username,
          full_name: formData.fullName,
        },
      });

      if (error) throw error;

      // Refresh user data
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();
      setUser(updatedUser);

      setIsEditModalOpen(false);

      // Optional: Show success message
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/room/create', label: 'Create Room', icon: Plus },
    { href: '/docs', label: 'Documentation', icon: Files },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={100}
        bg="white/80"
        backdropFilter="blur(20px)"
        borderBottom="1px solid"
        borderColor="gray.200"
        _dark={{
          bg: 'gray.900/80',
          borderColor: 'gray.800',
        }}
        shadow="sm"
      >
        <Container maxW="1400px" py={4}>
          <HStack justify="space-between">
            {/* Logo - Fixed: Remove nested <a> */}
            <Link href="/dashboard">
              <Box
                display="flex"
                alignItems="center"
                cursor="pointer"
              >
                <Logo />
              </Box>
            </Link>

            {/* Desktop Navigation */}
            <HStack gap={1} display={{ base: 'none', md: 'flex' }}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Button
                    key={link.href}
                    asChild
                    variant={active ? 'subtle' : 'ghost'}
                    size="md"
                    colorScheme={active ? 'blue' : 'gray'}
                    fontWeight={active ? 'semibold' : 'medium'}
                  >
                    <NextLink href={link.href}>
                      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                      {link.label}
                    </NextLink>
                  </Button>
                );
              })}
            </HStack>

            {/* Desktop Actions */}
            <HStack gap={2} display={{ base: 'none', md: 'flex' }}>
              {user && (
                <HStack
                  gap={2}
                  px={3}
                  py={2}
                  borderRadius="md"
                  bg="gray.100"
                  _dark={{ bg: 'gray.800' }}
                  cursor="pointer"
                  onClick={() => setIsEditModalOpen(true)}
                  _hover={{ bg: 'gray.200', _dark: { bg: 'gray.700' } }}
                  transition="background 0.2s"
                >
                  <Box
                    w={6}
                    h={6}
                    borderRadius="full"
                    bg="blue.500"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <User size={14} strokeWidth={2.5} />
                  </Box>
                  <Text fontSize="sm" fontWeight="medium">
                    {user.user_metadata?.username || user.email?.split('@')[0]}
                  </Text>
                  <Edit size={14} />
                </HStack>
              )}
              <IconButton
                onClick={handleSignOut}
                variant="ghost"
                size="md"
                aria-label="Sign out"
                colorScheme="red"
              >
                <LogOut size={18} strokeWidth={2} />
              </IconButton>
            </HStack>

            {/* Mobile Menu Toggle */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={() => setIsOpen(true)}
              variant="ghost"
              size="md"
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={2} />
            </IconButton>
          </HStack>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer.Root
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
        placement="end"
        size="sm"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header borderBottomWidth="1px">
                <HStack justify="space-between" w="full">
                  <Logo />
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </HStack>
              </Drawer.Header>

              <Drawer.Body py={4}>
                <VStack align="stretch" gap={3}>
                  {/* User Info */}
                  {user && (
                    <>
                      <Box
                        p={4}
                        borderRadius="lg"
                        bg="blue.50"
                        _dark={{ bg: 'blue.950' }}
                        cursor="pointer"
                        onClick={() => {
                          setIsOpen(false);
                          setIsEditModalOpen(true);
                        }}
                        _hover={{ bg: 'blue.100', _dark: { bg: 'blue.900' } }}
                        transition="background 0.2s"
                      >
                        <HStack gap={3}>
                          <Box
                            w={10}
                            h={10}
                            borderRadius="full"
                            bg="blue.500"
                            color="white"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <User size={20} strokeWidth={2.5} />
                          </Box>
                          <VStack align="start" gap={0} flex={1} minW={0}>
                            <Text fontWeight="semibold" fontSize="sm" truncate>
                              {user.user_metadata?.full_name ||
                                user.user_metadata?.username ||
                                'User'}
                            </Text>
                            <Text fontSize="xs" color="fg.muted" truncate>
                              {user.email}
                            </Text>
                          </VStack>
                          <Edit size={16} />
                        </HStack>
                      </Box>
                      <Separator />
                    </>
                  )}

                  {/* Mobile Nav Links */}
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Button
                        key={link.href}
                        asChild
                        variant={active ? 'subtle' : 'ghost'}
                        size="lg"
                        justifyContent="start"
                        onClick={() => setIsOpen(false)}
                        colorScheme={active ? 'blue' : 'gray'}
                        fontWeight={active ? 'semibold' : 'medium'}
                      >
                        <NextLink href={link.href}>
                          <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                          {link.label}
                        </NextLink>
                      </Button>
                    );
                  })}

                  <Separator />

                  {/* Sign Out */}
                  <Button
                    variant="ghost"
                    size="lg"
                    justifyContent="start"
                    colorScheme="red"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut size={20} strokeWidth={2} />
                    Sign Out
                  </Button>
                </VStack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* Edit Profile Modal */}
      <Dialog.Root
        open={isEditModalOpen}
        onOpenChange={(e) => setIsEditModalOpen(e.open)}
        size={{ base: 'full', md: 'md' }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Profile</Dialog.Title>
              </Dialog.Header>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>

              <Dialog.Body pb={6}>
                <VStack gap={4} align="stretch">
                  <Field.Root>
                    <Field.Label>Username</Field.Label>
                    <Input
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Enter username"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Full Name</Field.Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Enter full name"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input
                      value={formData.email}
                      disabled
                      bg="gray.50"
                      _dark={{ bg: 'gray.800' }}
                    />
                    <Text fontSize="xs" color="fg.muted" mt={1}>
                      Email cannot be changed here
                    </Text>
                  </Field.Root>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorScheme="blue"
                  onClick={handleUpdateProfile}
                  loading={loading}
                >
                  Save Changes
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
