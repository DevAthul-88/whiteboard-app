'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Spinner, VStack, Text, HStack, Button, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import WhiteboardCanvas from './WhiteboardCanvas';
import { useWhiteboardState } from './useWhiteboardState';
import WhiteboardToolbar from './WhiteboardToolbar';
import WhiteboardChat from './WhiteboardChat';

interface WhiteboardProps {
  roomId: string;
}

export default function WhiteboardKonva({ roomId }: WhiteboardProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const stageRef = useRef<any>(null);
  const router = useRouter();

  const {
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
    saveDrawingImmediate, // Make sure this is destructured
  } = useWhiteboardState(roomId);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(`whiteboard-theme-${roomId}`);
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, [roomId]);

  // Toggle theme and persist to localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem(`whiteboard-theme-${roomId}`, newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && canEdit) {
        e.preventDefault();
        const newElements = elements.filter((el) => el.id !== selectedId);
        setElements(newElements);
        setSelectedId(null);

        // Update history properly
        history.current = history.current.slice(0, historyStep.current + 1);
        history.current.push(newElements);
        historyStep.current += 1;

        // Use immediate save for delete
        saveDrawingImmediate(newElements);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, canEdit, elements, setElements, setSelectedId, history, historyStep, saveDrawingImmediate]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100vh"
        bg={isDarkMode ? 'gray.950' : 'gray.50'}
      >
        <VStack gap={4}>
          <Spinner size="xl" colorPalette="blue" />
          <Text color="fg.muted" fontSize="sm">
            Loading whiteboard...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (dimensions.width === 0 || dimensions.height === 0) return null;

  const bgColor = isDarkMode ? '#1a202c' : '#f7fafc';
  const cardBg = isDarkMode ? '#2d3748' : 'white';
  const borderColor = isDarkMode ? '#4a5568' : '#e2e8f0';

  return (
    <Box
      position="relative"
      w="100vw"
      h="100vh"
      overflow="hidden"
      bg={bgColor}
      transition="background-color 0.3s ease"
    >
      <style>{`* { cursor: none !important; }`}</style>

      {/* Back Button */}
      <Button
        position="fixed"
        top={4}
        left={4}
        zIndex={1001}
        colorPalette="blue"
        variant="surface"
        size="md"
        onClick={() => router.push('/dashboard')}
        transition="all 0.2s"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Button>

      {/* Theme Toggle Button */}
      <IconButton
        position="fixed"
        top={4}
        left={220}
        zIndex={1001}
        aria-label="Toggle theme"
        onClick={toggleTheme}
        colorPalette="blue"
        variant="surface"
        size="md"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>

      {/* Online Users */}
      <Box
        position="fixed"
        top={4}
        right={4}
        bg={cardBg}
        px={3}
        py={2}
        borderRadius="lg"
        boxShadow="md"
        zIndex={999}
        border="1px solid"
        borderColor={borderColor}
        transition="all 0.3s ease"
      >
        <VStack gap={2} align="start">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted">
            Online ({userCursors.size + 1})
          </Text>
          <HStack gap={2}>
            <Box w="8px" h="8px" borderRadius="full" bg={cursorColor} />
            <Text fontSize="xs" fontWeight="medium">
              You
            </Text>
          </HStack>
          {Array.from(userCursors.values()).map((cursor) => (
            <HStack key={cursor.userId} gap={2}>
              <Box w="8px" h="8px" borderRadius="full" bg={cursor.color} />
              <Text fontSize="xs" fontWeight="medium">
                {cursor.userName}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Canvas */}
      <WhiteboardCanvas
        elements={elements}
        setElements={setElements}
        currentTool={currentTool}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        canEdit={canEdit}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        isDrawingRef={isDrawingRef}
        history={history}
        historyStep={historyStep}
        strokeColorRef={strokeColorRef}
        broadcastCursor={broadcastCursor}
        saveDrawing={saveDrawing}
        saveDrawingImmediate={saveDrawingImmediate} // Pass it here
        dimensions={dimensions}
        isDarkMode={isDarkMode}
      />

      {/* Other Users' Cursors */}
      {Array.from(userCursors.values()).map((cursor) => (
        <Box
          key={cursor.userId}
          position="fixed"
          left={`${cursor.x}px`}
          top={`${cursor.y}px`}
          pointerEvents="none"
          zIndex={9998}
          transform="translate(-2px, -2px)"
          css={{ transition: 'left 80ms linear, top 80ms linear' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 3L17 8L9 11L6 19L3 3Z" fill={cursor.color} stroke="white" strokeWidth="1" />
          </svg>
          <Box
            position="absolute"
            top="22px"
            left="0px"
            bg={cursor.color}
            color="white"
            px={2}
            py={0.5}
            borderRadius="md"
            fontSize="11px"
            fontWeight="bold"
            whiteSpace="nowrap"
            boxShadow="sm"
          >
            {cursor.userName}
          </Box>
        </Box>
      ))}

      {/* Current User Cursor */}
      <Box
        position="fixed"
        left={`${mousePosition.x}px`}
        top={`${mousePosition.y}px`}
        pointerEvents="none"
        zIndex={9999}
        transform="translate(-2px, -2px)"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 3L17 8L9 11L6 19L3 3Z" fill={cursorColor} stroke="white" strokeWidth="1" />
        </svg>
        <Box
          position="absolute"
          top="22px"
          left="0px"
          bg={cursorColor}
          color="white"
          px={2}
          py={0.5}
          borderRadius="md"
          fontSize="11px"
          fontWeight="bold"
          whiteSpace="nowrap"
          boxShadow="sm"
        >
          {currentUserName}
        </Box>
      </Box>

      {/* Toolbar */}
      <WhiteboardToolbar
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        canEdit={canEdit}
        selectedId={selectedId}
        elements={elements}
        setElements={setElements}
        setSelectedId={setSelectedId}
        history={history}
        historyStep={historyStep}
        saveDrawing={saveDrawing}
        saveDrawingImmediate={saveDrawingImmediate} // Pass it here
        stageRef={stageRef}
        strokeColorRef={strokeColorRef}
        isDarkMode={isDarkMode}
      />

      {/* View Only Badge */}
      {!canEdit && (
        <Box
          position="fixed"
          bottom={24}
          left="50%"
          transform="translateX(-50%) translateY(-80px)"
          bg="orange.500"
          color="white"
          px={3}
          py={1.5}
          borderRadius="md"
          fontSize="sm"
          fontWeight="medium"
          zIndex={999}
          boxShadow="md"
        >
          👁️ View Only
        </Box>
      )}

      <WhiteboardChat
        roomId={roomId}
        currentUserName={currentUserName}
        isDarkMode={isDarkMode}
      />

    </Box>
  );
}
