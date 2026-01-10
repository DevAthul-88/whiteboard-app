'use client';

import { HStack, Input, Button, IconButton, Box } from '@chakra-ui/react';
import { Undo, Redo, Download, Trash2, X } from 'lucide-react';
import { DrawElement } from './useWhiteboardState';

interface WhiteboardToolbarProps {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  canEdit: boolean;
  selectedId: string | null;
  elements: DrawElement[];
  setElements: React.Dispatch<React.SetStateAction<DrawElement[]>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  history: React.MutableRefObject<DrawElement[][]>;
  historyStep: React.MutableRefObject<number>;
  saveDrawing: (elements: DrawElement[]) => void;
  saveDrawingImmediate: (elements: DrawElement[]) => void;
  stageRef: React.RefObject<any>;
  strokeColorRef: React.MutableRefObject<string>;
  isDarkMode: boolean;
}

export default function WhiteboardToolbar({
  currentTool,
  setCurrentTool,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  canEdit,
  selectedId,
  elements,
  setElements,
  setSelectedId,
  history,
  historyStep,
  saveDrawing,
  saveDrawingImmediate,
  stageRef,
  strokeColorRef,
  isDarkMode,
}: WhiteboardToolbarProps) {
  const handleClear = () => {
    if (!canEdit) return;
    if (!window.confirm('Are you sure you want to clear everything?')) return;
    
    const cleared: DrawElement[] = [];
    setElements(cleared);
    setSelectedId(null);
    
    history.current = history.current.slice(0, historyStep.current + 1);
    history.current.push(cleared);
    historyStep.current += 1;
    
    // Use immediate save for clear
    saveDrawingImmediate(cleared);
    console.log('Cleared all elements - immediate save triggered');
  };

  const handleUndo = () => {
    if (!canEdit || historyStep.current === 0) return;
    
    historyStep.current -= 1;
    const previous = history.current[historyStep.current];
    setElements(previous);
    setSelectedId(null);
    
    // Use immediate save for undo
    saveDrawingImmediate(previous);
    console.log('Undo - immediate save triggered');
  };

  const handleRedo = () => {
    if (!canEdit || historyStep.current === history.current.length - 1) return;
    
    historyStep.current += 1;
    const next = history.current[historyStep.current];
    setElements(next);
    setSelectedId(null);
    
    // Use immediate save for redo
    saveDrawingImmediate(next);
    console.log('Redo - immediate save triggered');
  };

  const handleDelete = () => {
    if (!canEdit || !selectedId) return;
    
    const newElements = elements.filter((el) => el.id !== selectedId);
    setElements(newElements);
    setSelectedId(null);
    
    history.current = history.current.slice(0, historyStep.current + 1);
    history.current.push(newElements);
    historyStep.current += 1;
    
    // Use immediate save for delete
    saveDrawingImmediate(newElements);
    console.log('Delete - immediate save triggered');
  };

  const handleDownload = () => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    strokeColorRef.current = color;
    setStrokeColor(color);
  };

  const cardBg = isDarkMode ? '#2d3748' : 'white';
  const borderColor = isDarkMode ? '#4a5568' : '#e2e8f0';
  const separatorColor = isDarkMode ? '#4a5568' : '#cbd5e0';
  const iconColor = isDarkMode ? '#e2e8f0' : '#2d3748';
  const textColor = isDarkMode ? '#e2e8f0' : '#1a202c';

  return (
    <Box
      position="fixed"
      bottom={6}
      left="50%"
      transform="translateX(-50%)"
      bg={cardBg}
      px={3}
      py={2}
      borderRadius="full"
      boxShadow="lg"
      zIndex={1000}
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.3s ease"
    >
      <HStack gap={2}>
        {[
          { id: 'select', emoji: '👆' },
          { id: 'pencil', emoji: '✏️' },
          { id: 'eraser', emoji: '🧹' },
          { id: 'rectangle', emoji: '▭' },
          { id: 'circle', emoji: '⭕' },
          { id: 'star', emoji: '⭐' },
          { id: 'triangle', emoji: '▲' },
          { id: 'arrow', emoji: '➡️' },
        ].map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            colorPalette={currentTool === tool.id ? 'blue' : 'gray'}
            variant={currentTool === tool.id ? 'solid' : 'ghost'}
            onClick={() => setCurrentTool(tool.id)}
            minW="36px"
            h="36px"
            borderRadius="full"
            fontSize="16px"
            disabled={!canEdit}
            color={currentTool === tool.id ? 'white' : textColor}
          >
            {tool.emoji}
          </Button>
        ))}

        <Box w="1px" h="24px" bg={separatorColor} />

        <Input
          type="color"
          value={strokeColor}
          onChange={handleColorChange}
          width="36px"
          height="36px"
          cursor="pointer"
          border="2px solid"
          borderColor={borderColor}
          borderRadius="full"
          p={0.5}
          disabled={!canEdit}
        />

        {[1, 2, 4, 8].map((w) => (
          <Button
            key={w}
            size="sm"
            variant={strokeWidth === w ? 'solid' : 'ghost'}
            colorPalette={strokeWidth === w ? 'blue' : 'gray'}
            onClick={() => setStrokeWidth(w)}
            minW="36px"
            h="36px"
            borderRadius="full"
            fontSize="11px"
            disabled={!canEdit}
            color={strokeWidth === w ? 'white' : textColor}
          >
            {w}
          </Button>
        ))}

        <Box w="1px" h="24px" bg={separatorColor} />

        <IconButton 
          aria-label="Undo" 
          variant="ghost" 
          colorPalette="gray" 
          onClick={handleUndo} 
          size="sm" 
          borderRadius="full" 
          disabled={!canEdit || historyStep.current === 0}
          color={iconColor}
        >
          <Undo size={16} />
        </IconButton>

        <IconButton
          aria-label="Redo"
          variant="ghost"
          colorPalette="gray"
          onClick={handleRedo}
          size="sm"
          borderRadius="full"
          disabled={!canEdit || historyStep.current === history.current.length - 1}
          color={iconColor}
        >
          <Redo size={16} />
        </IconButton>

        <IconButton 
          aria-label="Download" 
          variant="ghost" 
          colorPalette="gray" 
          onClick={handleDownload} 
          size="sm" 
          borderRadius="full"
          color={iconColor}
        >
          <Download size={16} />
        </IconButton>

        <IconButton 
          aria-label="Delete Selected" 
          variant="ghost" 
          colorPalette="red" 
          onClick={handleDelete} 
          size="sm" 
          borderRadius="full" 
          disabled={!canEdit || !selectedId}
          color={iconColor}
        >
          <Trash2 size={16} />
        </IconButton>

        <IconButton 
          aria-label="Clear All" 
          variant="ghost" 
          colorPalette="red" 
          onClick={handleClear} 
          size="sm" 
          borderRadius="full"
          disabled={!canEdit || elements.length === 0}
          color={iconColor}
        >
          <X size={16} />
        </IconButton>
      </HStack>
    </Box>
  );
}