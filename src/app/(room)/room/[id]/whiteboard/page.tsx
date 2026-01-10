import { Metadata } from 'next';
import WhiteboardClient from './WhiteboardClient';

export const metadata: Metadata = {
  title: 'Whiteboard | Collaborative Drawing',
  description: 'Real-time collaborative whiteboard for team brainstorming and visual collaboration',
  robots: 'noindex, nofollow',
};

interface WhiteboardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WhiteboardPage({ params }: WhiteboardPageProps) {
  const { id } = await params;
  return <WhiteboardClient roomId={id} />;
}
