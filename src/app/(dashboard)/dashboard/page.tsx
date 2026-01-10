'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Grid,
  Card,
  IconButton,
  Skeleton,
  Center,
  Input,
  Field,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseTrigger,
  DrawerTitle,
  DrawerPositioner,
  MenuPositioner,
  Switch,
  NumberInput,
  Separator,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toaster } from '@/app/components/ui/toaster';
import {
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  Globe,
  Calendar,
  FolderOpen,
  Copy,
  Check,
  Edit,
  SortAsc,
  Filter,
  MoreVertical,
  Shield,
  Users,
  FileText,
} from 'lucide-react';
import type { DrawingRoom } from '../../lib/types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Validation Schema for Edit
const EditRoomSchema = Yup.object().shape({
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

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';
type FilterOption = 'all' | 'public' | 'private';

export default function DashboardPage() {
  const [rooms, setRooms] = useState<DrawingRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<DrawingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [editingRoom, setEditingRoom] = useState<DrawingRoom | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [rooms, sortBy, filterBy]);

  const loadRooms = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: memberRooms } = await supabase
        .from('room_members')
        .select('room_id')
        .eq('user_id', user.id);

      const roomIds = memberRooms?.map((m) => m.room_id) || [];

      if (roomIds.length === 0) {
        setRooms([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('drawing_rooms')
        .select('*')
        .in('id', roomIds)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setRooms(data || []);
    } catch (error: any) {
      toaster.create({
        title: 'Error loading rooms',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...rooms];

    if (filterBy === 'public') {
      result = result.filter((room) => room.is_public);
    } else if (filterBy === 'private') {
      result = result.filter((room) => !room.is_public);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'date-asc':
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredRooms(result);
  };

  const deleteRoom = async (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('drawing_rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      toaster.create({
        title: 'Room deleted successfully',
        type: 'success',
        duration: 2000,
      });

      loadRooms();
    } catch (error: any) {
      toaster.create({
        title: 'Error deleting room',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
    }
  };

  const copyRoomLink = async (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/room/${roomId}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(roomId);
      toaster.create({
        title: 'Link copied!',
        description: 'Room link copied to clipboard',
        type: 'success',
        duration: 2000,
      });

      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toaster.create({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const openEditDrawer = (room: DrawingRoom, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRoom(room);
    setIsDrawerOpen(true);
  };

  const updateRoom = async (values: any, { setSubmitting }: any) => {
    if (!editingRoom) return;

    try {
      const { error } = await supabase
        .from('drawing_rooms')
        .update({
          name: values.roomName,
          is_public: values.isPublic,
          room_password: values.password || null,
          max_users: values.maxUsers,
        })
        .eq('id', editingRoom.id);

      if (error) throw error;

      toaster.create({
        title: 'Room updated successfully!',
        type: 'success',
        duration: 2000,
      });

      setIsDrawerOpen(false);
      setEditingRoom(null);
      loadRooms();
    } catch (error: any) {
      toaster.create({
        title: 'Error updating room',
        description: error.message,
        type: 'error',
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Normalize both dates to local midnight
    const startOfDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const startOfNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const diffInMs = startOfNow.getTime() - startOfDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };


  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'date-desc':
        return 'Latest First';
      case 'date-asc':
        return 'Oldest First';
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
    }
  };

  const getFilterLabel = (filter: FilterOption) => {
    switch (filter) {
      case 'all':
        return 'All Rooms';
      case 'public':
        return 'Public Only';
      case 'private':
        return 'Private Only';
    }
  };

  return (
    <Box minH="100vh" position="relative">
      {/* Background Grid */}
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

      <Container maxW="1400px" py={8} position="relative">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={1}>
              <Heading size={{ base: 'xl', md: '2xl' }} fontWeight="bold">
                My Whiteboards
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}{' '}
                {filterBy !== 'all' && `(${getFilterLabel(filterBy)})`}
              </Text>
            </VStack>

            <HStack gap={3} flexWrap="wrap">
              {/* Filter Menu */}
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Filter size={18} strokeWidth={2} />
                    {getFilterLabel(filterBy)}
                  </Button>
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent>
                      <MenuItem value="all" onClick={() => setFilterBy('all')}>
                        All Rooms
                      </MenuItem>
                      <MenuItem value="public" onClick={() => setFilterBy('public')}>
                        <Globe size={16} />
                        Public Only
                      </MenuItem>
                      <MenuItem value="private" onClick={() => setFilterBy('private')}>
                        <Lock size={16} />
                        Private Only
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>

              {/* Sort Menu */}
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button variant="outline" size="lg">
                    <SortAsc size={18} strokeWidth={2} />
                    {getSortLabel(sortBy)}
                  </Button>
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent>
                      <MenuItem value="date-desc" onClick={() => setSortBy('date-desc')}>
                        Latest First
                      </MenuItem>
                      <MenuItem value="date-asc" onClick={() => setSortBy('date-asc')}>
                        Oldest First
                      </MenuItem>
                      <MenuItem value="name-asc" onClick={() => setSortBy('name-asc')}>
                        Name (A-Z)
                      </MenuItem>
                      <MenuItem value="name-desc" onClick={() => setSortBy('name-desc')}>
                        Name (Z-A)
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>

              <Button asChild colorScheme="blue" size="lg">
                <Link href="/room/create">
                  <Plus size={20} strokeWidth={2} />
                  Create Room
                </Link>
              </Button>
            </HStack>
          </HStack>

          {/* Loading State */}
          {loading && (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={6}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card.Root key={i} size="lg">
                  <Card.Body>
                    <VStack gap={4} align="stretch">
                      <Skeleton height="24px" />
                      <Skeleton height="16px" />
                      <HStack>
                        <Skeleton height="36px" flex={1} />
                        <Skeleton height="36px" width="36px" />
                      </HStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Grid>
          )}

          {/* Rooms Grid */}
          {!loading && filteredRooms.length > 0 && (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={6}
            >
              {filteredRooms.map((room) => (
                <Card.Root
                  key={room.id}
                  size="lg"
                  cursor="pointer"
                  onClick={() => router.push(`/room/${room.id}`)}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                >
                  <Card.Body>
                    <VStack gap={4} align="stretch">
                      {/* Title and Menu */}
                      <HStack justify="space-between" align="start">
                        <Heading
                          size="md"
                          fontWeight="semibold"
                          flex={1}
                          lineClamp={2}
                        >
                          {room.name}
                        </Heading>
                        <HStack gap={2}>
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
                          <MenuRoot>
                            <MenuTrigger asChild>
                              <IconButton
                                size="sm"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="More options"
                              >
                                <MoreVertical size={18} />
                              </IconButton>
                            </MenuTrigger>
                            <Portal>
                              <MenuPositioner>
                                <MenuContent>
                                  <MenuItem
                                    value="edit"
                                    onClick={(e) => openEditDrawer(room, e as any)}
                                  >
                                    <Edit size={16} />
                                    Edit Room
                                  </MenuItem>
                                  <MenuItem
                                    value="copy"
                                    onClick={(e) => copyRoomLink(room.id, e as any)}
                                  >
                                    <Copy size={16} />
                                    Copy Link
                                  </MenuItem>
                                  <MenuItem
                                    value="delete"
                                    onClick={(e) => deleteRoom(room.id, e as any)}
                                    color="red.500"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </MenuItem>
                                </MenuContent>
                              </MenuPositioner>
                            </Portal>
                          </MenuRoot>
                        </HStack>
                      </HStack>

                      {/* Meta Info */}
                      <HStack color="fg.muted" fontSize="xs" gap={3}>
                        <HStack gap={1}>
                          <Calendar size={14} strokeWidth={2} />
                          <Text>{formatDate(room.updated_at)}</Text>
                        </HStack>
                        <HStack gap={1}>
                          <Users size={14} strokeWidth={2} />
                          <Text>Max {room.max_users}</Text>
                        </HStack>
                      </HStack>

                      {/* Actions */}
                      <HStack gap={2} pt={2}>
                        <Button
                          size="md"
                          colorScheme="blue"
                          flex={1}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/room/${room.id}`);
                          }}
                        >
                          Open
                          <ExternalLink size={16} strokeWidth={2} />
                        </Button>
                        <IconButton
                          size="md"
                          colorScheme={copiedId === room.id ? 'green' : 'gray'}
                          variant="outline"
                          onClick={(e) => copyRoomLink(room.id, e)}
                          aria-label="Copy link"
                        >
                          {copiedId === room.id ? (
                            <Check size={16} strokeWidth={2} />
                          ) : (
                            <Copy size={16} strokeWidth={2} />
                          )}
                        </IconButton>
                      </HStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Grid>
          )}

          {/* Empty State - Filter */}
          {!loading && filteredRooms.length === 0 && rooms.length > 0 && (
            <Card.Root size="lg" mt={8}>
              <Card.Body py={16}>
                <Center>
                  <VStack gap={6} textAlign="center" maxW="md">
                    <Box
                      w={20}
                      h={20}
                      borderRadius="full"
                      bg="gray.100"
                      color="gray.400"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      _dark={{ bg: 'gray.800', color: 'gray.600' }}
                    >
                      <Filter size={40} strokeWidth={1.5} />
                    </Box>
                    <VStack gap={2}>
                      <Heading size="lg" fontWeight="semibold">
                        No rooms match your filter
                      </Heading>
                      <Text color="fg.muted" fontSize="sm">
                        Try changing your filter settings to see more rooms
                      </Text>
                    </VStack>
                    <Button onClick={() => setFilterBy('all')} colorScheme="blue" size="lg">
                      Clear Filters
                    </Button>
                  </VStack>
                </Center>
              </Card.Body>
            </Card.Root>
          )}

          {/* Empty State - No Rooms */}
          {!loading && rooms.length === 0 && (
            <Card.Root size="lg" mt={8}>
              <Card.Body py={16}>
                <Center>
                  <VStack gap={6} textAlign="center" maxW="md">
                    <Box
                      w={20}
                      h={20}
                      borderRadius="full"
                      bg="gray.100"
                      color="gray.400"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      _dark={{ bg: 'gray.800', color: 'gray.600' }}
                    >
                      <FolderOpen size={40} strokeWidth={1.5} />
                    </Box>
                    <VStack gap={2}>
                      <Heading size="lg" fontWeight="semibold">
                        No whiteboards yet
                      </Heading>
                      <Text color="fg.muted" fontSize="sm">
                        Create your first whiteboard to start collaborating with your team in
                        real-time
                      </Text>
                    </VStack>
                    <Button asChild colorScheme="blue" size="lg">
                      <Link href="/room/create">
                        <Plus size={20} strokeWidth={2} />
                        Create Your First Room
                      </Link>
                    </Button>
                  </VStack>
                </Center>
              </Card.Body>
            </Card.Root>
          )}
        </VStack>
      </Container>

      {/* Edit Room Drawer */}
      <DrawerRoot
        open={isDrawerOpen}
        onOpenChange={(e) => setIsDrawerOpen(e.open)}
        size="md"
        placement="end"
      >
        <Portal>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  <HStack gap={2}>
                    <Edit size={20} />
                    <Text>Edit Whiteboard</Text>
                  </HStack>
                </DrawerTitle>
              </DrawerHeader>

              {editingRoom && (
                <Formik
                  initialValues={{
                    roomName: editingRoom.name,
                    isPublic: editingRoom.is_public,
                    password: editingRoom.room_password || '',
                    maxUsers: editingRoom.max_users,
                  }}
                  validationSchema={EditRoomSchema}
                  onSubmit={updateRoom}
                >
                  {({
                    errors,
                    touched,
                    isSubmitting,
                    values,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                  }) => (
                    <Form>
                      <DrawerBody>
                        <VStack gap={6} align="stretch">
                          {/* Basic Information */}
                          <VStack align="stretch" gap={4}>
                            <HStack gap={2}>
                              <FileText size={16} strokeWidth={2} />
                              <Heading size="sm" fontWeight="semibold">
                                Basic Information
                              </Heading>
                            </HStack>

                            <Field.Root
                              required
                              invalid={!!(touched.roomName && errors.roomName)}
                            >
                              <Field.Label fontSize="sm" fontWeight="medium">
                                Whiteboard Name
                              </Field.Label>
                              <Input
                                name="roomName"
                                value={values.roomName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Room name"
                                size="lg"
                              />
                              {touched.roomName && errors.roomName && (
                                <Field.ErrorText fontSize="sm">
                                  {errors.roomName}
                                </Field.ErrorText>
                              )}
                            </Field.Root>
                          </VStack>

                          <Separator />

                          {/* Privacy Settings */}
                          <VStack align="stretch" gap={4}>
                            <HStack gap={2}>
                              <Shield size={16} strokeWidth={2} />
                              <Heading size="sm" fontWeight="semibold">
                                Privacy Settings
                              </Heading>
                            </HStack>

                            <HStack justify="space-between">
                              <VStack align="start" gap={0}>
                                <Text fontWeight="medium" fontSize="sm">
                                  Public Whiteboard
                                </Text>
                                <Text fontSize="xs" color="fg.muted">
                                  Anyone with the link can access
                                </Text>
                              </VStack>
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

                            <Field.Root invalid={!!(touched.password && errors.password)}>
                              <Field.Label fontSize="sm" fontWeight="medium">
                                Password (optional)
                              </Field.Label>
                              <Input
                                name="password"
                                type="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Room password"
                                size="lg"
                              />
                              {touched.password && errors.password && (
                                <Field.ErrorText fontSize="sm">
                                  {errors.password}
                                </Field.ErrorText>
                              )}
                            </Field.Root>
                          </VStack>

                          <Separator />

                          {/* Capacity */}
                          <VStack align="stretch" gap={4}>
                            <HStack gap={2}>
                              <Users size={16} strokeWidth={2} />
                              <Heading size="sm" fontWeight="semibold">
                                Capacity
                              </Heading>
                            </HStack>

                            <Field.Root
                              required
                              invalid={!!(touched.maxUsers && errors.maxUsers)}
                            >
                              <Field.Label fontSize="sm" fontWeight="medium">
                                Maximum Users
                              </Field.Label>
                              <NumberInput.Root
                                value={values.maxUsers.toString()}
                                onValueChange={(details: {
                                  value: string;
                                  valueAsNumber: number;
                                }) => setFieldValue('maxUsers', details.valueAsNumber || 10)}
                                min={2}
                                max={50}
                                size="lg"
                              >
                                <NumberInput.Input />
                              </NumberInput.Root>
                              {touched.maxUsers && errors.maxUsers && (
                                <Field.ErrorText fontSize="sm">
                                  {errors.maxUsers}
                                </Field.ErrorText>
                              )}
                            </Field.Root>
                          </VStack>
                        </VStack>
                      </DrawerBody>

                      <DrawerFooter>
                        <HStack w="full" gap={3}>
                          <Button
                            variant="outline"
                            flex={1}
                            onClick={() => setIsDrawerOpen(false)}
                            size="lg"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            colorScheme="blue"
                            flex={1}
                            loading={isSubmitting}
                            size="lg"
                          >
                            Save Changes
                          </Button>
                        </HStack>
                      </DrawerFooter>
                    </Form>
                  )}
                </Formik>
              )}

              <DrawerCloseTrigger asChild>
                <CloseButton size="sm" />
              </DrawerCloseTrigger>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </Box>
  );
}
