'use client';

import { useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Transformer, Star as KonvaStar, RegularPolygon, Arrow as KonvaArrow } from 'react-konva';
import Konva from 'konva';
import { DrawElement } from './useWhiteboardState';

interface WhiteboardCanvasProps {
  elements: DrawElement[];
  setElements: React.Dispatch<React.SetStateAction<DrawElement[]>>;
  currentTool: string;
  strokeColor: string;
  strokeWidth: number;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  canEdit: boolean;
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  isDrawingRef: React.MutableRefObject<boolean>;
  history: React.MutableRefObject<DrawElement[][]>;
  historyStep: React.MutableRefObject<number>;
  strokeColorRef: React.MutableRefObject<string>;
  broadcastCursor: (x: number, y: number) => void;
  saveDrawing: (elements: DrawElement[]) => void;
  saveDrawingImmediate: (elements: DrawElement[]) => void;
  dimensions: { width: number; height: number };
  isDarkMode: boolean;
}

export default function WhiteboardCanvas({
  elements,
  setElements,
  currentTool,
  strokeColor,
  strokeWidth,
  isDrawing,
  setIsDrawing,
  canEdit,
  selectedId,
  setSelectedId,
  isDrawingRef,
  history,
  historyStep,
  strokeColorRef,
  broadcastCursor,
  saveDrawing,
  saveDrawingImmediate,
  dimensions,
  isDarkMode,
}: WhiteboardCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const currentShapeRef = useRef<DrawElement | null>(null);

  const getRelativePointerPosition = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;
    const pos = stage.getPointerPosition();
    if (!pos) return null;
    return { x: pos.x, y: pos.y };
  }, []);

  const handleTransformEnd = useCallback(
    (e: any) => {
      if (!canEdit) return;
      const id = e.target.id();
      const node = e.target;

      setElements((prev) => {
        const newElements = prev.map((el) => {
          if (el.id !== id) return el;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          return {
            ...el,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            ...(el.type === 'rectangle' && {
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            }),
            ...(el.type === 'circle' && {
              radius: Math.max(5, el.radius! * scaleX),
            }),
            ...(el.type === 'star' && {
              outerRadius: Math.max(5, el.outerRadius! * scaleX),
              innerRadius: Math.max(2, el.innerRadius! * scaleX),
            }),
            ...(el.type === 'triangle' && {
              radius: Math.max(5, el.radius! * scaleX),
            }),
          };
        });

        node.scaleX(1);
        node.scaleY(1);

        // Update history
        history.current = history.current.slice(0, historyStep.current + 1);
        history.current.push(newElements);
        historyStep.current += 1;

        // Use immediate save for transform
        saveDrawingImmediate(newElements);
        return newElements;
      });
    },
    [canEdit, saveDrawingImmediate, setElements, history, historyStep]
  );

  const handleDragEnd = useCallback(
    (e: any) => {
      if (!canEdit) return;
      const id = e.target.id();
      const node = e.target;

      setElements((prev) => {
        const newElements = prev.map((el) => {
          if (el.id !== id) return el;

          if ((el.type === 'line' || el.type === 'arrow') && el.points) {
            const dx = node.x();
            const dy = node.y();
            node.position({ x: 0, y: 0 });
            return {
              ...el,
              points: el.points.map((p, i) => p + (i % 2 === 0 ? dx : dy)),
            };
          }

          return { ...el, x: node.x(), y: node.y() };
        });

        // Update history
        history.current = history.current.slice(0, historyStep.current + 1);
        history.current.push(newElements);
        historyStep.current += 1;

        // Use immediate save for drag
        saveDrawingImmediate(newElements);
        return newElements;
      });
    },
    [canEdit, saveDrawingImmediate, setElements, history, historyStep]
  );

  const handleMouseDown = useCallback(
    (e: any) => {
      if (!canEdit) return;

      const clickedOnEmpty = e.target === e.target.getStage();
      const clickedOnTransformer = e.target.getParent()?.className === 'Transformer';

      if (currentTool === 'select') {
        if (clickedOnEmpty) {
          setSelectedId(null);
          return;
        }
        if (clickedOnTransformer) return;

        const clickedShapeTypes = ['Line', 'Rect', 'Circle', 'Star', 'RegularPolygon', 'Arrow'];
        if (clickedShapeTypes.includes(e.target.constructor.name)) {
          setSelectedId(e.target.id());
          return;
        }
      } else {
        setSelectedId(null);
      }

      const point = getRelativePointerPosition();
      if (!point) return;

      setIsDrawing(true);
      isDrawingRef.current = true;
      const currentColor = strokeColorRef.current;

      if (currentTool === 'pencil' || currentTool === 'eraser') {
        const newElement: DrawElement = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'line',
          points: [point.x, point.y],
          stroke: currentTool === 'eraser' ? (isDarkMode ? '#1a202c' : '#FFFFFF') : currentColor,
          strokeWidth: currentTool === 'eraser' ? strokeWidth * 3 : strokeWidth,
          globalCompositeOperation: currentTool === 'eraser' ? 'destination-out' : 'source-over',
        };
        setElements((prev) => [...prev, newElement]);
      } else if (currentTool === 'rectangle') {
        currentShapeRef.current = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'rectangle',
          x: point.x,
          y: point.y,
          width: 0,
          height: 0,
          stroke: currentColor,
          strokeWidth,
          fill: 'transparent',
        };
        setElements((prev) => [...prev, currentShapeRef.current!]);
      } else if (currentTool === 'circle') {
        currentShapeRef.current = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'circle',
          x: point.x,
          y: point.y,
          radius: 0,
          stroke: currentColor,
          strokeWidth,
          fill: 'transparent',
        };
        setElements((prev) => [...prev, currentShapeRef.current!]);
      } else if (currentTool === 'star') {
        currentShapeRef.current = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'star',
          x: point.x,
          y: point.y,
          numPoints: 5,
          innerRadius: 0,
          outerRadius: 0,
          stroke: currentColor,
          strokeWidth,
          fill: 'transparent',
        };
        setElements((prev) => [...prev, currentShapeRef.current!]);
      } else if (currentTool === 'triangle') {
        currentShapeRef.current = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'triangle',
          x: point.x,
          y: point.y,
          radius: 0,
          stroke: currentColor,
          strokeWidth,
          fill: 'transparent',
        };
        setElements((prev) => [...prev, currentShapeRef.current!]);
      } else if (currentTool === 'arrow') {
        currentShapeRef.current = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'arrow',
          points: [point.x, point.y, point.x, point.y],
          stroke: currentColor,
          strokeWidth,
          fill: currentColor,
        };
        setElements((prev) => [...prev, currentShapeRef.current!]);
      }
    },
    [canEdit, currentTool, strokeWidth, getRelativePointerPosition, setElements, setSelectedId, setIsDrawing, isDrawingRef, strokeColorRef, isDarkMode]
  );

  const handleMouseMove = useCallback(
    (e: any) => {
      const point = getRelativePointerPosition();
      if (!point) return;

      broadcastCursor(point.x, point.y);
      if (!isDrawing || !canEdit) return;

      if (currentTool === 'pencil' || currentTool === 'eraser') {
        setElements((prev) => {
          const lastElement = prev[prev.length - 1];
          if (lastElement && lastElement.type === 'line') {
            return prev.slice(0, -1).concat({
              ...lastElement,
              points: lastElement.points!.concat([point.x, point.y]),
            });
          }
          return prev;
        });
      } else if (currentTool === 'rectangle' && currentShapeRef.current) {
        const rect = currentShapeRef.current;
        setElements((prev) =>
          prev.slice(0, -1).concat({
            ...rect,
            width: point.x - rect.x!,
            height: point.y - rect.y!,
          })
        );
      } else if (currentTool === 'circle' && currentShapeRef.current) {
        const circle = currentShapeRef.current;
        const radius = Math.sqrt(Math.pow(point.x - circle.x!, 2) + Math.pow(point.y - circle.y!, 2));
        setElements((prev) => prev.slice(0, -1).concat({ ...circle, radius }));
      } else if (currentTool === 'star' && currentShapeRef.current) {
        const star = currentShapeRef.current;
        const outerRadius = Math.sqrt(Math.pow(point.x - star.x!, 2) + Math.pow(point.y - star.y!, 2));
        setElements((prev) => prev.slice(0, -1).concat({ ...star, outerRadius, innerRadius: outerRadius * 0.5 }));
      } else if (currentTool === 'triangle' && currentShapeRef.current) {
        const triangle = currentShapeRef.current;
        const radius = Math.sqrt(Math.pow(point.x - triangle.x!, 2) + Math.pow(point.y - triangle.y!, 2));
        setElements((prev) => prev.slice(0, -1).concat({ ...triangle, radius }));
      } else if (currentTool === 'arrow' && currentShapeRef.current) {
        const arrow = currentShapeRef.current;
        setElements((prev) => prev.slice(0, -1).concat({ ...arrow, points: [arrow.points![0], arrow.points![1], point.x, point.y] }));
      }
    },
    [isDrawing, canEdit, currentTool, broadcastCursor, getRelativePointerPosition, setElements]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !canEdit) return;
    setIsDrawing(false);
    isDrawingRef.current = false;
    currentShapeRef.current = null;

    // Get current elements from state
    setElements((prev) => {
      // Update history
      history.current = history.current.slice(0, historyStep.current + 1);
      history.current.push(prev);
      historyStep.current += 1;

      // Use immediate save for shape completion
      saveDrawingImmediate(prev);
      
      return prev;
    });
  }, [isDrawing, canEdit, saveDrawingImmediate, setIsDrawing, isDrawingRef, history, historyStep, setElements]);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;
    if (e.evt.ctrlKey) direction = -direction;

    const scaleBy = 1.05;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });
    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, []);

  useEffect(() => {
    if (selectedId && transformerRef.current && layerRef.current) {
      const selectedNode = layerRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId]);

  return (
    <Stage
      ref={stageRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <Layer ref={layerRef}>
        {elements.map((element) => {
          const commonProps = {
            id: element.id,
            draggable: currentTool === 'select' && canEdit,
            onDragEnd: handleDragEnd,
            onTransformEnd: handleTransformEnd,
            onClick: () => {
              if (currentTool === 'select') setSelectedId(element.id);
            },
            onTap: () => {
              if (currentTool === 'select') setSelectedId(element.id);
            },
          };

          if (element.type === 'line') {
            return (
              <Line
                key={element.id}
                {...commonProps}
                points={element.points}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={(element.globalCompositeOperation as any) || 'source-over'}
              />
            );
          } else if (element.type === 'rectangle') {
            return (
              <Rect
                key={element.id}
                {...commonProps}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                fill={element.fill}
              />
            );
          } else if (element.type === 'circle') {
            return (
              <Circle
                key={element.id}
                {...commonProps}
                x={element.x}
                y={element.y}
                radius={element.radius ?? 0}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                fill={element.fill}
              />
            );
          } else if (element.type === 'star') {
            return (
              <KonvaStar
                key={element.id}
                {...commonProps}
                x={element.x}
                y={element.y}
                numPoints={element.numPoints || 5}
                innerRadius={element.innerRadius ?? 0}
                outerRadius={element.outerRadius ?? 0}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                fill={element.fill}
              />
            );
          } else if (element.type === 'triangle') {
            return (
              <RegularPolygon
                key={element.id}
                {...commonProps}
                x={element.x}
                y={element.y}
                sides={3}
                radius={element.radius ?? 0}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                fill={element.fill}
              />
            );
          } else if (element.type === 'arrow') {
            return (
              <KonvaArrow
                key={element.id}
                {...commonProps}
                points={element.points ?? []}
                stroke={element.stroke}
                strokeWidth={element.strokeWidth}
                fill={element.fill}
                pointerLength={10}
                pointerWidth={10}
              />
            );
          }
          return null;
        })}
        <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
  );
}
