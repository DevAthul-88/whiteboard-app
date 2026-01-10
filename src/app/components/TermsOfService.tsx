'use client';

import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Logo from '../components/logo';

export default function TermsOfService() {
    const router = useRouter();

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
                    <Stack direction="row" justify="space-between" align="center">
                        <Box cursor="pointer" onClick={() => router.push('/')}>
                            <Logo />
                        </Box>
                        <Text 
                            fontSize="sm" 
                            color="fg.muted"
                            cursor="pointer"
                            onClick={() => router.push('/')}
                            _hover={{ color: 'blue.500' }}
                        >
                            Back to Home
                        </Text>
                    </Stack>
                </Container>
            </Box>

            {/* Content */}
            <Container maxW="4xl" py={{ base: 12, md: 16 }}>
                <VStack align="start" gap={8}>
                    {/* Header */}
                    <VStack align="start" gap={4}>
                        <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold">
                            Terms of Service
                        </Heading>
                        <Text fontSize="md" color="fg.muted">
                            Last updated: January 10, 2026
                        </Text>
                        <Text fontSize="lg" color="fg.muted" lineHeight="relaxed">
                            Please read these Terms of Service carefully before using Whiteboard. By accessing or using our Service, you agree to be bound by these Terms.
                        </Text>
                    </VStack>

                    {/* Section 1 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            1. Acceptance of Terms
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            By creating an account, accessing, or using Whiteboard, you agree to comply with and be legally bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.
                        </Text>
                    </VStack>

                    {/* Section 2 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            2. Description of Service
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            Whiteboard is a collaborative visual platform that enables users to create, share, and collaborate on interactive whiteboards in real-time. The Service includes access to drawing tools, team workspaces, and collaboration features.
                        </Text>
                    </VStack>

                    {/* Section 3 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            3. User Accounts
                        </Heading>
                        
                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={2}>
                            Account Creation
                        </Heading>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">You must provide accurate and complete information when creating an account</Box>
                            <Box as="li" color="fg.muted">You are responsible for maintaining the security of your account credentials</Box>
                            <Box as="li" color="fg.muted">You must be at least 13 years old to use the Service</Box>
                            <Box as="li" color="fg.muted">One person or legal entity may not maintain more than one free account</Box>
                        </Box>

                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={4}>
                            Account Responsibilities
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            You are responsible for all activity that occurs under your account. You must notify us immediately of any unauthorized access or security breach.
                        </Text>
                    </VStack>

                    {/* Section 4 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            4. Acceptable Use
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
                        </Text>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">Violate any applicable laws or regulations</Box>
                            <Box as="li" color="fg.muted">Infringe upon the intellectual property rights of others</Box>
                            <Box as="li" color="fg.muted">Upload malicious code, viruses, or harmful content</Box>
                            <Box as="li" color="fg.muted">Attempt to gain unauthorized access to the Service or other users' accounts</Box>
                            <Box as="li" color="fg.muted">Use the Service to harass, abuse, or harm others</Box>
                            <Box as="li" color="fg.muted">Engage in any activity that disrupts or interferes with the Service</Box>
                            <Box as="li" color="fg.muted">Use automated systems to access the Service without permission</Box>
                            <Box as="li" color="fg.muted">Resell or redistribute the Service without authorization</Box>
                        </Box>
                    </VStack>

                    {/* Section 5 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            5. User Content
                        </Heading>
                        
                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={2}>
                            Ownership
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            You retain all ownership rights to the content you create and upload to Whiteboard ("User Content"). You grant us a limited license to host, store, and display your User Content solely to provide the Service.
                        </Text>

                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={4}>
                            Responsibility
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            You are solely responsible for your User Content and the consequences of posting it. You represent and warrant that you own or have the necessary rights to all User Content you submit.
                        </Text>

                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={4}>
                            Content Removal
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We reserve the right to remove or disable access to any User Content that violates these Terms or is otherwise objectionable, without prior notice.
                        </Text>
                    </VStack>

                    {/* Section 6 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            6. Subscription and Payment
                        </Heading>
                        
                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={2}>
                            Pricing
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            Whiteboard offers both free and paid subscription plans. Pricing details are available on our website and may be updated from time to time with reasonable notice.
                        </Text>

                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={4}>
                            Billing
                        </Heading>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">Paid subscriptions are billed in advance on a recurring basis</Box>
                            <Box as="li" color="fg.muted">You authorize us to charge your payment method for all fees</Box>
                            <Box as="li" color="fg.muted">All fees are non-refundable unless required by law</Box>
                            <Box as="li" color="fg.muted">Failure to pay may result in suspension or termination of your account</Box>
                        </Box>

                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={4}>
                            Cancellation
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period. You will not receive a refund for the remaining time in your billing period.
                        </Text>
                    </VStack>

                    {/* Section 7 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            7. Intellectual Property
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            The Service, including its software, features, design, and content (excluding User Content), is owned by Whiteboard and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on the Service without our written permission.
                        </Text>
                    </VStack>

                    {/* Section 8 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            8. Privacy and Data Protection
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you consent to our data practices as described in the Privacy Policy.
                        </Text>
                    </VStack>

                    {/* Section 9 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            9. Service Availability
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We strive to maintain high availability but do not guarantee uninterrupted access to the Service. We may suspend or discontinue any part of the Service at any time, with or without notice. We are not liable for any interruption or cessation of the Service.
                        </Text>
                    </VStack>

                    {/* Section 10 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            10. Disclaimer of Warranties
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                        </Text>
                    </VStack>

                    {/* Section 11 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            11. Limitation of Liability
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WHITEBOARD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
                        </Text>
                    </VStack>

                    {/* Section 12 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            12. Indemnification
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            You agree to indemnify and hold Whiteboard harmless from any claims, losses, damages, liabilities, and expenses arising out of your use of the Service, violation of these Terms, or infringement of any rights of another party.
                        </Text>
                    </VStack>

                    {/* Section 13 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            13. Termination
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease. You may terminate your account at any time by contacting us.
                        </Text>
                    </VStack>

                    {/* Section 14 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            14. Modifications to Terms
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through the Service. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
                        </Text>
                    </VStack>

                    {/* Section 15 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            15. Governing Law
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of [Your Jurisdiction].
                        </Text>
                    </VStack>

                    {/* Section 16 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            16. Severability
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
                        </Text>
                    </VStack>

                    {/* Contact */}
                    <VStack align="start" gap={4} pt={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            Contact Us
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            If you have any questions about these Terms of Service, please contact us:
                        </Text>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">Email: legal@whiteboard.com</Box>
                            <Box as="li" color="fg.muted">Address: None</Box>
                        </Box>
                    </VStack>
                </VStack>
            </Container>

            {/* Footer */}
            <Box borderTopWidth="1px" py={8} bg="bg.subtle" mt={16}>
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
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
