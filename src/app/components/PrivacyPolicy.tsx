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
import Logo from './logo';

export default function PrivacyPolicy() {
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
                            Privacy Policy
                        </Heading>
                        <Text fontSize="md" color="fg.muted">
                            Last updated: January 10, 2026
                        </Text>
                        <Text fontSize="lg" color="fg.muted" lineHeight="relaxed">
                            At Whiteboard, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our collaborative whiteboard platform.
                        </Text>
                    </VStack>

                    {/* Section 1 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            1. Information We Collect
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We collect information that you provide directly to us, as well as information automatically collected when you use our Service.
                        </Text>
                        
                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={2}>
                            Personal Information
                        </Heading>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">Account information (name, email address, password)</Box>
                            <Box as="li" color="fg.muted">Profile information (avatar, display name, workspace preferences)</Box>
                            <Box as="li" color="fg.muted">Payment information (processed securely through third-party providers)</Box>
                            <Box as="li" color="fg.muted">Communication data (support messages, feedback)</Box>
                        </Box>

                        <Heading as="h3" fontSize="lg" fontWeight="semibold" pt={2}>
                            Usage Information
                        </Heading>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">Whiteboard content and collaboration data</Box>
                            <Box as="li" color="fg.muted">Device information (browser type, operating system, IP address)</Box>
                            <Box as="li" color="fg.muted">Usage analytics (features used, session duration, click patterns)</Box>
                            <Box as="li" color="fg.muted">Cookies and similar tracking technologies</Box>
                        </Box>
                    </VStack>

                    {/* Section 2 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            2. How We Use Your Information
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We use the information we collect for the following purposes:
                        </Text>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">To provide, maintain, and improve our Service</Box>
                            <Box as="li" color="fg.muted">To enable real-time collaboration features</Box>
                            <Box as="li" color="fg.muted">To process transactions and send related information</Box>
                            <Box as="li" color="fg.muted">To send technical notices, updates, and security alerts</Box>
                            <Box as="li" color="fg.muted">To respond to your comments and questions</Box>
                            <Box as="li" color="fg.muted">To analyze usage patterns and optimize user experience</Box>
                            <Box as="li" color="fg.muted">To detect, prevent, and address technical issues or fraudulent activity</Box>
                        </Box>
                    </VStack>

                    {/* Section 3 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            3. Data Sharing and Disclosure
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We do not sell your personal information. We may share your information in the following circumstances:
                        </Text>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">With team members:</Text> When you collaborate on whiteboards, content is shared with your team
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Service providers:</Text> Third-party vendors who perform services on our behalf (hosting, analytics, payment processing)
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Legal requirements:</Text> When required by law or to protect our rights and safety
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Business transfers:</Text> In connection with a merger, acquisition, or sale of assets
                            </Box>
                        </Box>
                    </VStack>

                    {/* Section 4 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            4. Data Security
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We implement appropriate technical and organizational measures to protect your personal information:
                        </Text>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">End-to-end encryption for data in transit</Box>
                            <Box as="li" color="fg.muted">Encryption at rest for stored data</Box>
                            <Box as="li" color="fg.muted">Regular security audits and penetration testing</Box>
                            <Box as="li" color="fg.muted">Secure authentication and access controls</Box>
                            <Box as="li" color="fg.muted">Employee training on data protection practices</Box>
                        </Box>
                    </VStack>

                    {/* Section 5 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            5. Data Retention
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete your personal information within 30 days, except where we are required to retain it for legal or compliance purposes.
                        </Text>
                    </VStack>

                    {/* Section 6 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            6. Your Rights
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            Depending on your location, you may have certain rights regarding your personal information:
                        </Text>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Access:</Text> Request a copy of your personal data
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Correction:</Text> Request correction of inaccurate data
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Deletion:</Text> Request deletion of your personal data
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Portability:</Text> Request transfer of your data to another service
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Objection:</Text> Object to processing of your personal data
                            </Box>
                            <Box as="li" color="fg.muted">
                                <Text as="span" fontWeight="semibold">Withdraw consent:</Text> Withdraw consent for data processing
                            </Box>
                        </Box>
                        <Text color="fg.muted" lineHeight="relaxed" pt={2}>
                            To exercise these rights, please contact us at devathulvinod@gmail.com.
                        </Text>
                    </VStack>

                    {/* Section 7 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            7. Cookies and Tracking
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings. Essential cookies are required for the Service to function properly.
                        </Text>
                    </VStack>

                    {/* Section 8 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            8. International Data Transfers
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                        </Text>
                    </VStack>

                    {/* Section 9 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            9. Children's Privacy
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
                        </Text>
                    </VStack>

                    {/* Section 10 */}
                    <VStack align="start" gap={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            10. Changes to This Policy
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Significant changes will be communicated via email.
                        </Text>
                    </VStack>

                    {/* Contact */}
                    <VStack align="start" gap={4} pt={4}>
                        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
                            Contact Us
                        </Heading>
                        <Text color="fg.muted" lineHeight="relaxed">
                            If you have any questions about this Privacy Policy, please contact us:
                        </Text>
                        <Box as="ul" ps={6} spaceY={2}>
                            <Box as="li" color="fg.muted">Email: devathulvinod@gmail.com</Box>
                            <Box as="li" color="fg.muted">Address: [Your Company Address]</Box>
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
