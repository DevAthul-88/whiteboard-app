'use client';

import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Grid,
    Input,
    Button,
    Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { 
    Search, 
    Zap, 
    Users, 
    Share2, 
    Palette,
    MousePointer,
    Square,
    Download,
    Keyboard
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Logo from './logo';

export default function Documentation() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const sections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: <Zap size={20} />,
            items: [
                { title: 'Create Your First Board', link: '#create-board' },
                { title: 'Navigate the Interface', link: '#navigate' },
            ]
        },
        {
            id: 'drawing-tools',
            title: 'Drawing Tools',
            icon: <Palette size={20} />,
            items: [
                { title: 'Pen & Brush Tools', link: '#pen-tools' },
                { title: 'Shapes & Lines', link: '#shapes' },
                { title: 'Text & Typography', link: '#text' },
                { title: 'Colors & Styles', link: '#colors' },
            ]
        },
        {
            id: 'collaboration',
            title: 'Collaboration',
            icon: <Users size={20} />,
            items: [
                { title: 'Real-time Editing', link: '#realtime' },
                { title: 'Cursors & Presence', link: '#cursors' },
                { title: 'Comments & Feedback', link: '#comments' },
            ]
        },
        {
            id: 'sharing',
            title: 'Sharing & Export',
            icon: <Share2 size={20} />,
            items: [
                { title: 'Share Your Board', link: '#share' },
                { title: 'Export Options', link: '#export' },
                { title: 'Access Permissions', link: '#permissions' },
            ]
        },
    ];

    // Filter sections based on search query
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return sections;
        
        const query = searchQuery.toLowerCase();
        return sections.map(section => ({
            ...section,
            items: section.items.filter(item => 
                item.title.toLowerCase().includes(query) ||
                section.title.toLowerCase().includes(query)
            )
        })).filter(section => section.items.length > 0);
    }, [searchQuery]);

    return (
        <Box minH="100vh">
            {/* Navigation */}
            <Box
                as="nav"
                pos="sticky"
                top={0}
                borderBottomWidth="1px"
                backdropFilter="blur(10px)"
                bg="bg/80"
                zIndex={10}
            >
                <Container maxW="6xl" py={4}>
                    <HStack justify="space-between">
                        <Box cursor="pointer" onClick={() => router.push('/')}>
                            <Logo />
                        </Box>
                        <HStack gap={2}>
                            <Text 
                                fontSize="sm" 
                                color="fg.muted"
                                cursor="pointer"
                                onClick={() => router.push('/')}
                                _hover={{ color: 'blue.500' }}
                                display={{ base: 'none', md: 'block' }}
                            >
                                Back to Home
                            </Text>
                        </HStack>
                    </HStack>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box bg="bg.subtle" py={{ base: 12, md: 16 }} borderBottomWidth="1px">
                <Container maxW="5xl">
                    <VStack gap={6} textAlign="center">
                        <Heading 
                            as="h1" 
                            fontSize={{ base: '3xl', md: '5xl' }} 
                            fontWeight="bold"
                        >
                            Documentation
                        </Heading>
                        <Text 
                            fontSize={{ base: 'lg', md: 'xl' }} 
                            color="fg.muted" 
                            maxW="2xl"
                        >
                            Everything you need to know about using Whiteboard effectively
                        </Text>
                        
                        {/* Search */}
                        <Box w="full" maxW="xl" pt={4}>
                            <Box pos="relative">
                                <Input
                                    placeholder="Search documentation..."
                                    size="lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    ps={12}
                                    bg="bg"
                                />
                                <Box
                                    pos="absolute"
                                    left={4}
                                    top="50%"
                                    transform="translateY(-50%)"
                                    color="fg.muted"
                                >
                                    <Search size={20} />
                                </Box>
                            </Box>
                        </Box>
                    </VStack>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxW="6xl" py={{ base: 12, md: 16 }}>
                <Grid
                    templateColumns={{ base: '1fr', lg: '250px 1fr' }}
                    gap={12}
                >
                    {/* Sidebar Navigation */}
                    <Box display={{ base: 'none', lg: 'block' }}>
                        <Box pos="sticky" top={24}>
                            <VStack align="stretch" gap={6}>
                                {filteredSections.map((section) => (
                                    <VStack key={section.id} align="stretch" gap={2}>
                                        <HStack gap={2} color="fg.emphasized">
                                            {section.icon}
                                            <Text fontWeight="semibold" fontSize="sm">
                                                {section.title}
                                            </Text>
                                        </HStack>
                                        <VStack align="stretch" gap={1} ps={7}>
                                            {section.items.map((item) => (
                                                <Text
                                                    key={item.link}
                                                    fontSize="sm"
                                                    color="fg.muted"
                                                    cursor="pointer"
                                                    _hover={{ color: 'blue.500' }}
                                                    onClick={() => {
                                                        const element = document.querySelector(item.link);
                                                        element?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                >
                                                    {item.title}
                                                </Text>
                                            ))}
                                        </VStack>
                                    </VStack>
                                ))}
                            </VStack>
                        </Box>
                    </Box>

                    {/* Content */}
                    <VStack align="stretch" gap={16}>
                        {/* Getting Started */}
                        <VStack align="stretch" gap={8} id="getting-started">
                            <VStack align="start" gap={3}>
                                <HStack gap={2} color="blue.500">
                                    <Zap size={24} />
                                    <Heading as="h2" fontSize="2xl" fontWeight="bold">
                                        Getting Started
                                    </Heading>
                                </HStack>
                                <Text color="fg.muted" lineHeight="relaxed">
                                    Learn the basics of Whiteboard and create your first collaborative workspace.
                                </Text>
                            </VStack>

                            {/* Create Board */}
                            <Box id="create-board">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Create Your First Board
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Creating a board is simple and takes just a few seconds:
                                    </Text>
                                    <Box 
                                        as="ol" 
                                        ps={6} 
                                        spaceY={2} 
                                        css={{ listStyleType: 'decimal' }}
                                    >
                                        <Box as="li" color="fg.muted">Click the "New Board" button in your dashboard</Box>
                                        <Box as="li" color="fg.muted">Give your board a name and optional description</Box>
                                        <Box as="li" color="fg.muted">Choose between a blank canvas or template</Box>
                                        <Box as="li" color="fg.muted">Click "Create" to start collaborating</Box>
                                    </Box>
                                    <Box 
                                        p={4} 
                                        bg="blue.50" 
                                        _dark={{ bg: 'blue.950/30' }} 
                                        borderRadius="lg"
                                        borderLeftWidth="3px"
                                        borderLeftColor="blue.500"
                                    >
                                        <Text fontSize="sm" color="fg.muted">
                                            <Text as="span" fontWeight="semibold" color="blue.600" _dark={{ color: 'blue.400' }}>Tip:</Text> Use templates for common use cases like brainstorming, wireframing, or project planning.
                                        </Text>
                                    </Box>
                                </VStack>
                            </Box>

                            {/* Navigate */}
                            <Box id="navigate">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Navigate the Interface
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        The Whiteboard interface is designed for intuitive navigation:
                                    </Text>
                                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                                        <Box p={4} bg="bg.subtle" borderRadius="lg" borderWidth="1px">
                                            <VStack align="start" gap={2}>
                                                <HStack gap={2} color="blue.500">
                                                    <MousePointer size={18} />
                                                    <Text fontWeight="semibold" fontSize="sm">Pan & Zoom</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="fg.muted">
                                                    Click and drag to pan. Use scroll wheel or pinch to zoom in/out.
                                                </Text>
                                            </VStack>
                                        </Box>
                                        <Box p={4} bg="bg.subtle" borderRadius="lg" borderWidth="1px">
                                            <VStack align="start" gap={2}>
                                                <HStack gap={2} color="blue.500">
                                                    <Keyboard size={18} />
                                                    <Text fontWeight="semibold" fontSize="sm">Keyboard Shortcuts</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="fg.muted">
                                                    Press "?" to view all keyboard shortcuts and speed up your workflow.
                                                </Text>
                                            </VStack>
                                        </Box>
                                    </Grid>
                                </VStack>
                            </Box>
                        </VStack>

                        {/* Drawing Tools */}
                        <VStack align="stretch" gap={8} id="drawing-tools">
                            <VStack align="start" gap={3}>
                                <HStack gap={2} color="blue.500">
                                    <Palette size={24} />
                                    <Heading as="h2" fontSize="2xl" fontWeight="bold">
                                        Drawing Tools
                                    </Heading>
                                </HStack>
                                <Text color="fg.muted" lineHeight="relaxed">
                                    Master the powerful drawing tools to bring your ideas to life.
                                </Text>
                            </VStack>

                            {/* Pen Tools */}
                            <Box id="pen-tools">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Pen & Brush Tools
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Draw freely with customizable pen and brush tools:
                                    </Text>
                                    <Box as="ul" ps={6} spaceY={2}>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">Pen Tool:</Text> Create precise lines and strokes with adjustable thickness</Box>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">Marker:</Text> Highlight important areas with semi-transparent markers</Box>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">Eraser:</Text> Remove unwanted marks without affecting other elements</Box>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">Highlighter:</Text> Emphasize key sections with bright colors</Box>
                                    </Box>
                                </VStack>
                            </Box>

                            {/* Shapes */}
                            <Box id="shapes">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Shapes & Lines
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Create professional diagrams with smart shapes:
                                    </Text>
                                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={3}>
                                        <Box p={3} bg="bg.subtle" borderRadius="md" textAlign="center">
                                            <Box color="blue.500" display="flex" justifyContent="center" mb={2}>
                                                <Square size={20} />
                                            </Box>
                                            <Text fontSize="sm" fontWeight="medium">Basic Shapes</Text>
                                        </Box>
                                        <Box p={3} bg="bg.subtle" borderRadius="md" textAlign="center">
                                            <Box color="blue.500" display="flex" justifyContent="center" mb={2} fontSize="xl" fontWeight="bold">
                                                →
                                            </Box>
                                            <Text fontSize="sm" fontWeight="medium">Arrows & Lines</Text>
                                        </Box>
                                        <Box p={3} bg="bg.subtle" borderRadius="md" textAlign="center">
                                            <Box color="blue.500" display="flex" justifyContent="center" mb={2} fontSize="xl" fontWeight="bold">
                                                ◇
                                            </Box>
                                            <Text fontSize="sm" fontWeight="medium">Flowchart Items</Text>
                                        </Box>
                                    </Grid>
                                </VStack>
                            </Box>

                            {/* Text */}
                            <Box id="text">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Text & Typography
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Add text anywhere on your board with rich formatting options:
                                    </Text>
                                    <Box as="ul" ps={6} spaceY={2}>
                                        <Box as="li" color="fg.muted">Multiple font sizes and styles (bold, italic, underline)</Box>
                                        <Box as="li" color="fg.muted">Custom colors and background highlights</Box>
                                        <Box as="li" color="fg.muted">Text alignment and list formatting</Box>
                                        <Box as="li" color="fg.muted">Resize and rotate text boxes freely</Box>
                                    </Box>
                                </VStack>
                            </Box>

                            {/* Colors */}
                            <Box id="colors">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Colors & Styles
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Customize your work with a full color palette and styling options. Choose from preset colors or create custom ones to match your brand.
                                    </Text>
                                </VStack>
                            </Box>
                        </VStack>

                        {/* Collaboration */}
                        <VStack align="stretch" gap={8} id="collaboration">
                            <VStack align="start" gap={3}>
                                <HStack gap={2} color="blue.500">
                                    <Users size={24} />
                                    <Heading as="h2" fontSize="2xl" fontWeight="bold">
                                        Collaboration Features
                                    </Heading>
                                </HStack>
                                <Text color="fg.muted" lineHeight="relaxed">
                                    Work together seamlessly with real-time collaboration tools.
                                </Text>
                            </VStack>

                            {/* Real-time */}
                            <Box id="realtime">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Real-time Editing
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        See changes instantly as your team collaborates. All edits are synchronized in real-time with no lag or conflicts.
                                    </Text>
                                </VStack>
                            </Box>

                            {/* Cursors */}
                            <Box id="cursors">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Cursors & Presence
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        See where your teammates are working with colored cursors and name labels. Know who's online and active at any time.
                                    </Text>
                                </VStack>
                            </Box>

                            {/* Comments */}
                            <Box id="comments">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Comments & Feedback
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Leave comments on specific elements or areas of the board. Mention teammates with @ to get their attention and resolve threads when done.
                                    </Text>
                                </VStack>
                            </Box>
                        </VStack>

                        {/* Sharing & Export */}
                        <VStack align="stretch" gap={8} id="sharing">
                            <VStack align="start" gap={3}>
                                <HStack gap={2} color="blue.500">
                                    <Share2 size={24} />
                                    <Heading as="h2" fontSize="2xl" fontWeight="bold">
                                        Sharing & Export
                                    </Heading>
                                </HStack>
                                <Text color="fg.muted" lineHeight="relaxed">
                                    Share your work with anyone and export in multiple formats.
                                </Text>
                            </VStack>

                            {/* Share */}
                            <Box id="share">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Share Your Board
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Sharing your board is simple - just copy the link and share it with anyone:
                                    </Text>
                                    <Box 
                                        as="ol" 
                                        ps={6} 
                                        spaceY={2} 
                                        css={{ listStyleType: 'decimal' }}
                                    >
                                        <Box as="li" color="fg.muted">Click the "Share" button in the top right corner</Box>
                                        <Box as="li" color="fg.muted">Copy the shareable link that's automatically generated</Box>
                                        <Box as="li" color="fg.muted">Share the link via email, chat, or any messaging platform</Box>
                                        <Box as="li" color="fg.muted">Anyone with the link can access your board based on permissions</Box>
                                    </Box>
                                    <Box 
                                        p={4} 
                                        bg="blue.50" 
                                        _dark={{ bg: 'blue.950/30' }} 
                                        borderRadius="lg"
                                        borderLeftWidth="3px"
                                        borderLeftColor="blue.500"
                                    >
                                        <Text fontSize="sm" color="fg.muted">
                                            <Text as="span" fontWeight="semibold" color="blue.600" _dark={{ color: 'blue.400' }}>Tip:</Text> You can revoke access anytime by generating a new link or changing board permissions.
                                        </Text>
                                    </Box>
                                </VStack>
                            </Box>

                            {/* Export */}
                            <Box id="export">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Export Options
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Export your boards in multiple formats:
                                    </Text>
                                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                                        <Box p={4} bg="bg.subtle" borderRadius="lg" borderWidth="1px">
                                            <VStack align="start" gap={2}>
                                                <HStack gap={2} color="blue.500">
                                                    <Download size={18} />
                                                    <Text fontWeight="semibold" fontSize="sm">PNG/JPG</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="fg.muted">
                                                    Export as high-quality images for presentations and documents.
                                                </Text>
                                            </VStack>
                                        </Box>
                                        <Box p={4} bg="bg.subtle" borderRadius="lg" borderWidth="1px">
                                            <VStack align="start" gap={2}>
                                                <HStack gap={2} color="blue.500">
                                                    <Download size={18} />
                                                    <Text fontWeight="semibold" fontSize="sm">PDF</Text>
                                                </HStack>
                                                <Text fontSize="sm" color="fg.muted">
                                                    Create printable PDFs with full resolution and layers.
                                                </Text>
                                            </VStack>
                                        </Box>
                                    </Grid>
                                </VStack>
                            </Box>

                            {/* Permissions */}
                            <Box id="permissions">
                                <VStack align="start" gap={4}>
                                    <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                        Access Permissions
                                    </Heading>
                                    <Text color="fg.muted" lineHeight="relaxed">
                                        Control who can access your boards with granular permissions:
                                    </Text>
                                    <Box as="ul" ps={6} spaceY={2}>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">View:</Text> Can only view the board without making changes</Box>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">Comment:</Text> Can view and leave comments</Box>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">Edit:</Text> Full editing and collaboration access</Box>
                                        <Box as="li" color="fg.muted"><Text as="span" fontWeight="semibold">Admin:</Text> Can manage permissions and delete boards</Box>
                                    </Box>
                                </VStack>
                            </Box>
                        </VStack>

                        {/* Help CTA */}
                        <Box
                            p={8}
                            bg="blue.50"
                            _dark={{ bg: 'blue.950/30' }}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor="blue.200"
                        >
                            <VStack gap={4}>
                                <Heading as="h3" fontSize="xl" fontWeight="semibold">
                                    Need More Help?
                                </Heading>
                                <Text color="fg.muted" textAlign="center" maxW="md">
                                    Can't find what you're looking for? Our support team is here to help you get the most out of Whiteboard.
                                </Text>
                                <Link href="mailto:devathulvinod@gmail.com" _hover={{ textDecoration: 'none' }}>
                                    <Button colorPalette="blue" size="lg">
                                        Contact Support
                                    </Button>
                                </Link>
                            </VStack>
                        </Box>
                    </VStack>
                </Grid>
            </Container>

            {/* Footer */}
            <Box borderTopWidth="1px" py={8} bg="bg.subtle" mt={16}>
                <Container maxW="6xl">
                    <HStack justify="space-between" flexWrap="wrap" gap={4}>
                        <Text fontSize="sm" color="fg.muted">
                            © 2026 Whiteboard. All rights reserved.
                        </Text>
                        <HStack gap={6} fontSize="sm" flexWrap="wrap">
                            <Link 
                                as={NextLink} 
                                href="/privacy-policy" 
                                color="fg.muted"
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                as={NextLink} 
                                href="/terms-of-service" 
                                color="fg.muted"
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                            >
                                Terms of Service
                            </Link>
                            <Link 
                                as={NextLink} 
                                href="/docs" 
                                color="fg.muted"
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                            >
                                Documentation
                            </Link>
                            <Link 
                                href="mailto:devathulvinod@gmail.com" 
                                color="fg.muted"
                                _hover={{ color: 'blue.500', textDecoration: 'none' }}
                            >
                                Contact
                            </Link>
                        </HStack>
                    </HStack>
                </Container>
            </Box>
        </Box>
    );
}
