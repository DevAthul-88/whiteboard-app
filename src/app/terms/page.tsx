import React from 'react'
import TermsOfService from '../components/TermsOfService'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Whiteboard',
  description: 'Read our terms of service to understand your rights and responsibilities when using Whiteboard collaborative platform.',
  keywords: 'terms of service, terms and conditions, user agreement, acceptable use, whiteboard terms',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  return (
    <TermsOfService />
  )
}
