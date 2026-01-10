-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view accessible rooms" ON drawing_rooms;
DROP POLICY IF EXISTS "Users can view public or owned rooms" ON drawing_rooms;
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON drawing_rooms;
DROP POLICY IF EXISTS "Room owners can update their rooms" ON drawing_rooms;
DROP POLICY IF EXISTS "Room members can update drawing" ON drawing_rooms;
DROP POLICY IF EXISTS "Room owners can delete rooms" ON drawing_rooms;

DROP POLICY IF EXISTS "Users can view room members" ON room_members;
DROP POLICY IF EXISTS "Room owners can add members" ON room_members;
DROP POLICY IF EXISTS "Room owners and users can add members" ON room_members;
DROP POLICY IF EXISTS "Users can leave rooms" ON room_members;
DROP POLICY IF EXISTS "Users can leave rooms or owners can remove members" ON room_members;
DROP POLICY IF EXISTS "Users and owners can add members" ON room_members;
DROP POLICY IF EXISTS "Users can leave or owners can remove" ON room_members;

-- Step 2: Create helper function (breaks recursion)
CREATE OR REPLACE FUNCTION public.is_room_member(room_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.room_members 
    WHERE room_id = room_uuid 
    AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.is_room_member TO authenticated;

-- Step 3: Create NEW policies WITHOUT recursion

-- ========================================
-- DRAWING_ROOMS Policies
-- ========================================

-- SELECT: View public rooms, owned rooms, or rooms you're a member of
CREATE POLICY "drawing_rooms_select_policy"
  ON drawing_rooms FOR SELECT
  USING (
    is_public = true 
    OR owner_id = auth.uid()
    OR public.is_room_member(id, auth.uid())
  );

-- INSERT: Only authenticated users can create rooms
CREATE POLICY "drawing_rooms_insert_policy"
  ON drawing_rooms FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- UPDATE: Only owners can update their rooms
CREATE POLICY "drawing_rooms_update_policy"
  ON drawing_rooms FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- DELETE: Only owners can delete their rooms
CREATE POLICY "drawing_rooms_delete_policy"
  ON drawing_rooms FOR DELETE
  USING (owner_id = auth.uid());

-- ========================================
-- ROOM_MEMBERS Policies
-- ========================================

-- SELECT: View your own memberships or memberships in rooms you own
CREATE POLICY "room_members_select_policy"
  ON room_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM drawing_rooms 
      WHERE drawing_rooms.id = room_members.room_id 
      AND drawing_rooms.owner_id = auth.uid()
    )
  );

-- INSERT: Users can add themselves, or room owners can add anyone
CREATE POLICY "room_members_insert_policy"
  ON room_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM drawing_rooms 
      WHERE drawing_rooms.id = room_members.room_id 
      AND drawing_rooms.owner_id = auth.uid()
    )
  );

-- UPDATE: Room owners can update member roles
CREATE POLICY "room_members_update_policy"
  ON room_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM drawing_rooms 
      WHERE drawing_rooms.id = room_members.room_id 
      AND drawing_rooms.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM drawing_rooms 
      WHERE drawing_rooms.id = room_members.room_id 
      AND drawing_rooms.owner_id = auth.uid()
    )
  );

-- DELETE: Users can remove themselves, or owners can remove anyone
CREATE POLICY "room_members_delete_policy"
  ON room_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM drawing_rooms 
      WHERE drawing_rooms.id = room_members.room_id 
      AND drawing_rooms.owner_id = auth.uid()
    )
  );

  -- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.drawing_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT message_length CHECK (char_length(message) > 0 AND char_length(message) <= 1000)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "chat_messages_select_policy"
  ON chat_messages FOR SELECT
  USING (public.is_room_member(room_id, auth.uid()));

CREATE POLICY "chat_messages_insert_policy"
  ON chat_messages FOR INSERT
  WITH CHECK (user_id = auth.uid() AND public.is_room_member(room_id, auth.uid()));

CREATE POLICY "chat_messages_delete_policy"
  ON chat_messages FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM drawing_rooms 
      WHERE drawing_rooms.id = chat_messages.room_id 
      AND drawing_rooms.owner_id = auth.uid()
    )
  );

GRANT ALL ON public.chat_messages TO authenticated;


-- ========================================
-- Verify policies are created
-- ========================================

-- Check drawing_rooms policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'drawing_rooms';

-- Check room_members policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'room_members';
