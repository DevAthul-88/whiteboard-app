import { useState, useRef, useCallback, useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toaster } from './ui/toaster';
import throttle from 'lodash.throttle';

export interface DrawElement {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'star' | 'triangle' | 'arrow';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  globalCompositeOperation?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface UserCursor {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
  lastUpdate: number;
}

export const useWhiteboardState = (roomId: string) => {
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentTool, setCurrentTool] = useState('pencil');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [userCursors, setUserCursors] = useState<Map<string, UserCursor>>(new Map());
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [cursorColor, setCursorColor] = useState('#000000');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const channelRef = useRef<any>(null);
  const isDrawingRef = useRef(false);
  const history = useRef<DrawElement[][]>([[]]);
  const historyStep = useRef(0);
  const strokeColorRef = useRef(strokeColor);
  const saveQueueRef = useRef<DrawElement[] | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedStateRef = useRef<string>('[]');

  const router = useRouter();
  const supabase = createClient();

  const generateCursorColor = useCallback(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Core save function without throttling
  const saveToDatabase = useCallback(async (newElements: DrawElement[]) => {
    if (!canEdit) return;

    const elementsString = JSON.stringify(newElements);
    
    // Skip if no changes
    if (elementsString === lastSavedStateRef.current) {
      console.log('No changes detected, skipping save');
      return;
    }

    isSavingRef.current = true;

    try {
      console.log(`Saving ${newElements.length} elements to Supabase`);

      const { error } = await supabase
        .from('drawing_rooms')
        .update({
          drawing: { elements: newElements },
          updated_at: new Date().toISOString(),
        })
        .eq('id', roomId);

      if (error) throw error;

      lastSavedStateRef.current = elementsString;
      console.log(`✓ Successfully saved ${newElements.length} elements`);

      // Broadcast to other users
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'drawing-update',
          payload: { elements: newElements, userId: currentUserId },
        });
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      toaster.create({
        title: 'Save failed',
        description: 'Your changes may not be saved',
        type: 'error',
        duration: 3000,
      });
    } finally {
      isSavingRef.current = false;

      // If there's a queued save, process it
      if (saveQueueRef.current) {
        const queued = saveQueueRef.current;
        saveQueueRef.current = null;
        await saveToDatabase(queued);
      }
    }
  }, [canEdit, roomId, supabase, currentUserId]);

  // Throttled save for continuous drawing (like pencil)
  const saveDrawingThrottled = useCallback(
    throttle(async (newElements: DrawElement[]) => {
      if (isSavingRef.current) {
        // Queue the save if one is in progress
        saveQueueRef.current = newElements;
        return;
      }
      await saveToDatabase(newElements);
    }, 1000), // Increased to 1 second to reduce calls
    [saveToDatabase]
  );

  // Immediate save for critical operations (clear, delete, shape completion)
  const saveDrawingImmediate = useCallback(async (newElements: DrawElement[]) => {
    console.log('IMMEDIATE SAVE triggered');
    
    if (isSavingRef.current) {
      // Queue it with high priority
      saveQueueRef.current = newElements;
      console.log('Save in progress, queued for immediate execution');
      return;
    }
    
    await saveToDatabase(newElements);
  }, [saveToDatabase]);

  // General save function (uses throttled by default)
  const saveDrawing = useCallback(async (newElements: DrawElement[]) => {
    await saveDrawingThrottled(newElements);
  }, [saveDrawingThrottled]);

  // Initialize whiteboard
  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        setCurrentUserId(user.id);
        setCurrentUserName(user.email?.split('@')[0] || 'User');
        const color = generateCursorColor();
        setCursorColor(color);

        const { data: member, error: memberError } = await supabase
          .from('room_members')
          .select('role')
          .eq('room_id', roomId)
          .eq('user_id', user.id)
          .single();

        if (memberError || !member) {
          toaster.create({
            title: 'Access denied',
            description: 'You are not a member of this room',
            type: 'error',
            duration: 4000,
          });
          router.push('/dashboard');
          return;
        }

        setCanEdit(member.role === 'owner' || member.role === 'editor');

        const { data: roomData } = await supabase
          .from('drawing_rooms')
          .select('drawing')
          .eq('id', roomId)
          .single();

        if (roomData?.drawing?.elements) {
          const initialElements = roomData.drawing.elements;
          setElements(initialElements);
          history.current = [initialElements];
          historyStep.current = 0;
          lastSavedStateRef.current = JSON.stringify(initialElements);
          console.log(`Loaded ${initialElements.length} elements from database`);
        } else {
          console.log('No existing drawing found, starting fresh');
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Initialization error:', error);
        toaster.create({
          title: 'Error',
          description: error.message,
          type: 'error',
          duration: 4000,
        });
        setLoading(false);
      }
    };

    initialize();
  }, [roomId, router, supabase, generateCursorColor]);

  // Realtime subscription
  useEffect(() => {
    if (loading || !currentUserId) return;

    const channel = supabase
      .channel(`room:${roomId}`)
      .on('broadcast', { event: 'drawing-update' }, (payload) => {
        // Don't update if we're the sender or currently drawing
        if (payload.payload.userId !== currentUserId && !isDrawingRef.current) {
          console.log(`Received ${payload.payload.elements?.length ?? 0} elements from broadcast`);
          const receivedElements = payload.payload.elements || [];
          setElements(receivedElements);
          
          // Update history
          history.current = history.current.slice(0, historyStep.current + 1);
          history.current.push(receivedElements);
          historyStep.current += 1;
          
          // Update last saved state to prevent re-saving received data
          lastSavedStateRef.current = JSON.stringify(receivedElements);
        }
      })
      .on('broadcast', { event: 'cursor-move' }, (payload) => {
        const { userId, userName, x, y, color } = payload.payload;
        if (userId !== currentUserId) {
          setUserCursors((prev) => {
            const newMap = new Map(prev);
            newMap.set(userId, { userId, userName, x, y, color, lastUpdate: Date.now() });
            return newMap;
          });
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loading, roomId, supabase, currentUserId]);

  // Cleanup stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setUserCursors((prev) => {
        const newMap = new Map(prev);
        for (const [userId, cursor] of newMap.entries()) {
          if (now - cursor.lastUpdate > 5000) {
            newMap.delete(userId);
          }
        }
        return newMap;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // Force immediate save if there are pending changes
      if (saveQueueRef.current || isSavingRef.current) {
        e.preventDefault();
        e.returnValue = '';
        
        // Attempt synchronous save
        const elementsToSave = saveQueueRef.current || elements;
        await saveToDatabase(elementsToSave);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [elements, saveToDatabase]);

  const broadcastCursor = useCallback(
    throttle((x: number, y: number) => {
      if (channelRef.current && currentUserId) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'cursor-move',
          payload: { userId: currentUserId, userName: currentUserName, x, y, color: cursorColor },
        });
      }
    }, 50),
    [currentUserId, currentUserName, cursorColor]
  );

  return {
    elements,
    setElements,
    currentTool,
    setCurrentTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    isDrawing,
    setIsDrawing,
    loading,
    canEdit,
    userCursors,
    currentUserId,
    currentUserName,
    cursorColor,
    selectedId,
    setSelectedId,
    isDrawingRef,
    history,
    historyStep,
    strokeColorRef,
    broadcastCursor,
    saveDrawing,
    saveDrawingImmediate,
  };
};
