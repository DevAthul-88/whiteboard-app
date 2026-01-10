import React from 'react'
import PrivacyPolicy from '../components/PrivacyPolicy'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Whiteboard',
  description: 'Learn how Whiteboard collects, uses, and protects your personal information. Our privacy policy explains data security, user rights, and GDPR compliance.',
  keywords: 'privacy policy, data protection, GDPR, user privacy, data security, whiteboard privacy',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicy />
  )
}
