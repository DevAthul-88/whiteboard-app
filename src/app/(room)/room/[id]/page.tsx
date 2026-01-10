import { Metadata } from 'next';
import RoomDetailClient from './RoomDetailClient';

export const metadata: Metadata = {
  title: 'Join Room | Collaborative Whiteboard',
  description: 'Join a collaborative whiteboard room and start drawing together in real-time',
  robots: 'noindex, nofollow',
};

interface RoomDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { id } = await params;
  return <RoomDetailClient roomId={id} />;
}
