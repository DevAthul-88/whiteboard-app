'use client';

import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Grid,
    Stack,
} from '@chakra-ui/react';
import { Sparkles, Users, Lock, Zap, Share2, Palette, ArrowRight, Check, Target, Workflow, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from './logo';
import Link from 'next/link';

export default function LandingPage() {
    const router = useRouter();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Height of navbar
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    const features = [
        {
            icon: <Zap size={24} />,
            title: 'Real-time Collaboration',
            description: 'Work together seamlessly with your team in real-time.',
        },
        {
            icon: <Lock size={24} />,
            title: 'Secure & Encrypted',
            description: 'Your data is protected with end-to-end encryption.',
        },
        {
            icon: <Palette size={24} />,
            title: 'Powerful Tools',
            description: 'Full-featured drawing tools to bring ideas to life.',
        },
        {
            icon: <Share2 size={24} />,
            title: 'Easy Sharing',
            description: 'Share your whiteboards with a simple link.',
        },
        {
            icon: <Users size={24} />,
            title: 'Team Workspaces',
            description: 'Organize your work with dedicated team spaces.',
        },
        {
            icon: <Sparkles size={24} />,
            title: 'Intuitive Design',
            description: 'Beautiful, clean interface that gets out of your way.',
        },
    ];

    return (
        <Box minH="100vh" css={{ scrollBehavior: 'smooth' }}>
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
                        <Logo />
                        <HStack gap={2}>
                            <Button
                                variant="ghost"
                                size="sm"
                                display={{ base: 'none', md: 'inline-flex' }}
                                onClick={() => scrollToSection('features')}
                            >
                                Features
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                display={{ base: 'none', md: 'inline-flex' }}
                                onClick={() => scrollToSection('about')}
                            >
                                About
                            </Button>
                            <Button
                                colorPalette="blue"
                                size="sm"
                                onClick={() => router.push('/auth/login')}
                            >
                                Get Started
                            </Button>
                        </HStack>
                    </HStack>
                </Container>
            </Box>

            {/* Hero Section */}
            <Box pos="relative" minH="90vh" display="flex" alignItems="center" overflow="hidden">
                {/* Enhanced Grid Pattern - Primary */}
                <Box
                    pos="absolute"
                    inset={0}
                    opacity={0.5}
                    _dark={{ opacity: 0.3 }}
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Secondary Grid Pattern - Smaller */}
                <Box
                    pos="absolute"
                    inset={0}
                    opacity={0.3}
                    _dark={{ opacity: 0.15 }}
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* Gradient Overlay */}
                <Box
                    pos="absolute"
                    inset={0}
                    bgGradient="to-b"
                    gradientFrom="transparent"
                    gradientVia="transparent"
                    gradientTo="bg"
                    pointerEvents="none"
                />

                {/* Radial Gradient Glow */}
                <Box
                    pos="absolute"
                    top="0"
                    left="50%"
                    transform="translateX(-50%)"
                    w="800px"
                    h="800px"
                    borderRadius="full"
                    bg="blue.500"
                    opacity={0.06}
                    _dark={{ opacity: 0.04 }}
                    filter="blur(140px)"
                    pointerEvents="none"
                />

                <Container maxW="5xl" pos="relative" py={{ base: 16, md: 20 }}>
                    <VStack gap={8} textAlign="center">
                        {/* Badge */}
                        <HStack
                            px={3}
                            py={1.5}
                            bg="blue.50"
                            _dark={{ bg: 'blue.950/30' }}
                            borderRadius="full"
                            gap={1.5}
                            fontSize="sm"
                        >
                            <Box w={2} h={2} borderRadius="full" bg="blue.500" />
                            <Text fontWeight="medium" color="blue.700" _dark={{ color: 'blue.300' }}>
                                Join 10,000+ teams collaborating
                            </Text>
                        </HStack>

                        {/* Heading */}
                        <VStack gap={4}>
                            <Heading
                                as="h1"
                                fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}
                                fontWeight="bold"
                                lineHeight="1"
                                letterSpacing="tight"
                            >
                                Collaborate visually,
                            </Heading>
                            <Heading
                                as="h1"
                                fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}
                                fontWeight="bold"
                                lineHeight="1"
                                letterSpacing="tight"
                                color="blue.500"
                            >
                                ship faster
                            </Heading>
                        </VStack>

                        {/* Description */}
                        <Text
                            fontSize={{ base: 'lg', md: 'xl' }}
                            color="fg.muted"
                            maxW="2xl"
                            lineHeight="relaxed"
                        >
                            The infinite canvas for your team's best work. Brainstorm, plan, and create together in real-time.
                        </Text>

                        {/* CTA Buttons */}
                        <HStack gap={3} pt={2}>
                            <Button
                                colorPalette="blue"
                                size={{ base: 'lg', md: 'xl' }}
                                px={8}
                                onClick={() => router.push('/auth/login')}
                            >
                                Start for free
                            </Button>

                            <Button
                                variant="outline"
                                size={{ base: 'lg', md: 'xl' }}
                                px={8}
                                onClick={() => router.push('/docs')}
                            >
                                See how it works
                            </Button>

                        </HStack>

                        {/* Benefits */}
                        <HStack
                            gap={{ base: 4, md: 6 }}
                            pt={4}
                            fontSize="sm"
                            color="fg.muted"
                            flexWrap="wrap"
                            justify="center"
                        >
                            <HStack gap={1.5}>
                                <Check size={16} strokeWidth={3} />
                                <Text>Free forever</Text>
                            </HStack>

                            <HStack gap={1.5}>
                                <Check size={16} strokeWidth={3} />
                                <Text>Secure & fully synced</Text>
                            </HStack>

                            <HStack gap={1.5}>
                                <Check size={16} strokeWidth={3} />
                                <Text>No credit card</Text>
                            </HStack>

                        </HStack>
                    </VStack>
                </Container>
            </Box>

            {/* About the Tool Section */}
            <Box id="about" py={{ base: 16, md: 24 }}>
                <Container maxW="6xl">
                    <Grid
                        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                        gap={12}
                        alignItems="center"
                    >
                        {/* Left Column - Content */}
                        <VStack align="start" gap={6}>
                            <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color="blue.500"
                                textTransform="uppercase"
                                letterSpacing="wide"
                            >
                                About the tool
                            </Text>
                            <Heading
                                as="h2"
                                fontSize={{ base: '3xl', md: '4xl' }}
                                fontWeight="bold"
                                lineHeight="1.2"
                            >
                                Built for teams that think visually
                            </Heading>
                            <Text fontSize="lg" color="fg.muted" lineHeight="relaxed">
                                Whiteboard transforms how teams collaborate by providing an infinite canvas where ideas flow freely. Whether you're brainstorming product features, mapping user journeys, or planning sprints, our tool adapts to your workflow without getting in the way.
                            </Text>
                            <Text fontSize="lg" color="fg.muted" lineHeight="relaxed">
                                Designed with modern teams in mind, Whiteboard combines powerful drawing tools with real-time collaboration features, making remote teamwork feel as natural as working side-by-side.
                            </Text>
                            <Button
                                colorPalette="blue"
                                size="lg"
                                onClick={() => scrollToSection("features")}
                            >
                                <HStack gap={2}>
                                    <Text>Learn more</Text>
                                    <ArrowRight size={18} />
                                </HStack>
                            </Button>
                        </VStack>

                        {/* Right Column - Stats/Features Grid */}
                        <Grid
                            templateColumns="repeat(2, 1fr)"
                            gap={6}
                        >
                            <Box
                                p={6}
                                bg="bg.subtle"
                                borderRadius="xl"
                                borderWidth="1px"
                            >
                                <VStack align="start" gap={3}>
                                    <Box
                                        p={2}
                                        bg="blue.50"
                                        _dark={{ bg: 'blue.950/30' }}
                                        borderRadius="lg"
                                        color="blue.500"
                                    >
                                        <Target size={20} />
                                    </Box>
                                    <Heading as="h3" fontSize="2xl" fontWeight="bold">
                                        10,000+
                                    </Heading>
                                    <Text fontSize="sm" color="fg.muted">
                                        Active teams using our platform daily
                                    </Text>
                                </VStack>
                            </Box>

                            <Box
                                p={6}
                                bg="bg.subtle"
                                borderRadius="xl"
                                borderWidth="1px"
                            >
                                <VStack align="start" gap={3}>
                                    <Box
                                        p={2}
                                        bg="blue.50"
                                        _dark={{ bg: 'blue.950/30' }}
                                        borderRadius="lg"
                                        color="blue.500"
                                    >
                                        <Workflow size={20} />
                                    </Box>
                                    <Heading as="h3" fontSize="2xl" fontWeight="bold">
                                        50M+
                                    </Heading>
                                    <Text fontSize="sm" color="fg.muted">
                                        Ideas captured and brought to life
                                    </Text>
                                </VStack>
                            </Box>

                            <Box
                                p={6}
                                bg="bg.subtle"
                                borderRadius="xl"
                                borderWidth="1px"
                            >
                                <VStack align="start" gap={3}>
                                    <Box
                                        p={2}
                                        bg="blue.50"
                                        _dark={{ bg: 'blue.950/30' }}
                                        borderRadius="lg"
                                        color="blue.500"
                                    >
                                        <Clock size={20} />
                                    </Box>
                                    <Heading as="h3" fontSize="2xl" fontWeight="bold">
                                        40%
                                    </Heading>
                                    <Text fontSize="sm" color="fg.muted">
                                        Faster project completion time
                                    </Text>
                                </VStack>
                            </Box>

                            <Box
                                p={6}
                                bg="bg.subtle"
                                borderRadius="xl"
                                borderWidth="1px"
                            >
                                <VStack align="start" gap={3}>
                                    <Box
                                        p={2}
                                        bg="blue.50"
                                        _dark={{ bg: 'blue.950/30' }}
                                        borderRadius="lg"
                                        color="blue.500"
                                    >
                                        <Users size={20} />
                                    </Box>
                                    <Heading as="h3" fontSize="2xl" fontWeight="bold">
                                        99.9%
                                    </Heading>
                                    <Text fontSize="sm" color="fg.muted">
                                        Uptime for reliable collaboration
                                    </Text>
                                </VStack>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box id="features" py={{ base: 16, md: 24 }} bg="bg.subtle">
                <Container maxW="6xl">
                    <VStack gap={3} textAlign="center" mb={16}>
                        <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="blue.500"
                            textTransform="uppercase"
                            letterSpacing="wide"
                        >
                            Features
                        </Text>
                        <Heading
                            as="h2"
                            fontSize={{ base: '3xl', md: '4xl' }}
                            fontWeight="bold"
                            maxW="2xl"
                        >
                            Everything you need in one place
                        </Heading>
                        <Text fontSize="lg" color="fg.muted" maxW="xl">
                            Built for modern teams who want to move fast without compromise
                        </Text>
                    </VStack>

                    <Grid
                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                        gap={6}
                    >
                        {features.map((feature, index) => (
                            <Box
                                key={index}
                                p={6}
                                bg="bg"
                                borderRadius="xl"
                                borderWidth="1px"
                                borderColor="border"
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: 'blue.500',
                                    shadow: 'md',
                                    transform: 'translateY(-2px)',
                                }}
                            >
                                <VStack align="start" gap={4}>
                                    <Box
                                        p={2.5}
                                        bg="blue.50"
                                        _dark={{ bg: 'blue.950/30' }}
                                        borderRadius="lg"
                                        color="blue.500"
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Heading as="h3" fontSize="lg" fontWeight="semibold">
                                        {feature.title}
                                    </Heading>
                                    <Text fontSize="sm" color="fg.muted" lineHeight="relaxed">
                                        {feature.description}
                                    </Text>
                                </VStack>
                            </Box>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box py={{ base: 16, md: 24 }}>
                <Container maxW="6xl">
                    <Box
                        p={{ base: 12, md: 16 }}
                        bg="blue.500"
                        borderRadius="2xl"
                        pos="relative"
                        overflow="hidden"
                    >
                        {/* Grid Pattern */}
                        <Box
                            pos="absolute"
                            inset={0}
                            opacity={0.1}
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: '32px 32px',
                            }}
                        />

                        <VStack gap={6} textAlign="center" pos="relative" maxW="2xl" mx="auto">
                            <Heading
                                as="h2"
                                fontSize={{ base: '3xl', md: '4xl' }}
                                fontWeight="bold"
                                color="white"
                            >
                                Ready to transform how your team works?
                            </Heading>
                            <Text fontSize="lg" color="blue.50" lineHeight="relaxed">
                                Join thousands of teams building better products with our collaborative whiteboard.
                            </Text>
                            <HStack gap={3} pt={4}>
                                <Button
                                    size="lg"
                                    px={8}
                                    bg="white"
                                    color="blue.600"
                                    _hover={{ bg: 'gray.50' }}
                                    onClick={() => router.push('/auth/login')}
                                >
                                    Get started free
                                </Button>
                                <Link href="mailto:devathulvinod@gmail.com">
                                    <Button
                                        size="lg"
                                        px={8}
                                        variant="outline"
                                        color="white"
                                        borderColor="white"
                                        _hover={{ bg: "whiteAlpha.200" }}
                                    >
                                        Contact me
                                    </Button>
                                </Link>
                            </HStack>
                        </VStack>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box borderTopWidth="1px" py={8} bg="bg.subtle">
                <Container maxW="6xl">
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        justify="space-between"
                        align="center"
                        gap={4}
                    >
                        <Text fontSize="sm" color="fg.muted">
                            © 2026 Whiteboard. All rights reserved.
                        </Text>
                        <HStack gap={6} fontSize="sm">
                            <Link href={'/privacy'}>
                                <Text cursor="pointer" _hover={{ color: 'blue.500' }}>
                                    Privacy Policy
                                </Text>
                            </Link>
                            <Link href={'/terms'}>
                                <Text cursor="pointer" _hover={{ color: 'blue.500' }}>
                                    Terms of Service
                                </Text>
                            </Link>
                            <Link href="mailto:devathulvinod@gmail.com">
                                <Text cursor="pointer" _hover={{ color: 'blue.500' }}>
                                    Contact
                                </Text>
                            </Link>
                            <Link href={'/docs'}>
                                <Text cursor="pointer" _hover={{ color: 'blue.500' }}>
                                    Documentation
                                </Text>
                            </Link>
                        </HStack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
