'use client';

import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { Undo, Download, Trash2, Maximize2 } from 'lucide-react';
import Konva from 'konva';
import { useRef } from 'react';

interface ToolbarProps {
  canvas: Konva.Stage | null;
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onClear?: () => void;
  onUndo?: () => void;
  onDownload?: () => void;
  onResetView?: () => void;
}

export default function Toolbar({
  canvas,
  currentTool,
  setCurrentTool,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  onClear,
  onUndo,
  onDownload,
  onResetView,
}: ToolbarProps) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (canvas) {
      const dataURL = canvas.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const handleResetView = () => {
    if (onResetView) {
      onResetView();
    }
  };

  const toolButtons = [
    { id: 'select', label: 'Select/Pan', emoji: '👆' },
    { id: 'pencil', label: 'Pencil', emoji: '✏️' },
    { id: 'eraser', label: 'Eraser', emoji: '🧹' },
    { id: 'rectangle', label: 'Rectangle', emoji: '▭' },
    { id: 'circle', label: 'Circle', emoji: '⭕' },
    { id: 'text', label: 'Text', emoji: 'T' },
  ];

  const widths = [1, 2, 4, 8];
  const strokeColorRef = useRef(strokeColor);

  return (
    <Box
      position="fixed"
      bottom={6}
      left="50%"
      transform="translateX(-50%)"
      bg="white"
      px={3}
      py={2}
      borderRadius="full"
      boxShadow="lg"
      zIndex={1000}
      border="1px solid"
      borderColor="gray.200"
      _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
    >
      <HStack gap={2}>
        {/* Drawing Tools */}
        {toolButtons.map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            colorPalette={currentTool === tool.id ? 'blue' : 'gray'}
            variant={currentTool === tool.id ? 'solid' : 'ghost'}
            onClick={() => setCurrentTool(tool.id)}
            title={tool.label}
            minW="36px"
            h="36px"
            borderRadius="full"
            fontSize="16px"
          >
            {tool.emoji}
          </Button>
        ))}

        <Box w="1px" h="24px" bg="gray.300" _dark={{ bg: 'gray.600' }} />

        {/* Color Picker */}
        <Box position="relative">
          <Input
            type="color"
            value={strokeColor}
            onChange={(e) => {
              const color = e.target.value;
              strokeColorRef.current = color;
              setStrokeColor(color);
            }}
            width="36px"
            height="36px"
            cursor="pointer"
            border="2px solid"
            borderColor="gray.300"
            borderRadius="full"
            p={0.5}
            title="Color"
            _dark={{ borderColor: 'gray.600' }}
          />
        </Box>

        {/* Stroke Width */}
        {widths.map((w) => (
          <Button
            key={w}
            size="sm"
            variant={strokeWidth === w ? 'solid' : 'ghost'}
            colorPalette={strokeWidth === w ? 'blue' : 'gray'}
            onClick={() => setStrokeWidth(w)}
            minW="36px"
            h="36px"
            borderRadius="full"
            title={`${w}px`}
            fontSize="11px"
          >
            {w}
          </Button>
        ))}

        <Box w="1px" h="24px" bg="gray.300" _dark={{ bg: 'gray.600' }} />

        {/* Actions */}
        <IconButton
          aria-label="Reset View"
          variant="ghost"
          colorPalette="gray"
          onClick={handleResetView}
          title="Reset Zoom"
          size="sm"
          borderRadius="full"
        >
          <Maximize2 size={16} />
        </IconButton>

        <IconButton
          aria-label="Undo"
          variant="ghost"
          colorPalette="gray"
          onClick={handleUndo}
          title="Undo"
          size="sm"
          borderRadius="full"
        >
          <Undo size={16} />
        </IconButton>

        <IconButton
          aria-label="Download"
          variant="ghost"
          colorPalette="gray"
          onClick={handleDownload}
          title="Download PNG"
          size="sm"
          borderRadius="full"
        >
          <Download size={16} />
        </IconButton>

        <IconButton
          aria-label="Clear"
          variant="ghost"
          colorPalette="red"
          onClick={handleClear}
          title="Clear all"
          size="sm"
          borderRadius="full"
        >
          <Trash2 size={16} />
        </IconButton>
      </HStack>
    </Box>
  );
}
