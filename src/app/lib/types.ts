export type DrawingRoom = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  owner_id: string;
  room_password: string | null;
  is_public: boolean;
  drawing: any;
  max_users: number;
  is_locked: boolean;
};

export type RoomMember = {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  role: 'owner' | 'editor' | 'viewer';
};

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type UserPresence = {
  userId: string;
  username: string;
  cursor?: { x: number; y: number };
  color: string;
};
