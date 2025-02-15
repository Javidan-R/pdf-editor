// src/components/ShapeLayer.tsx
import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Transformer } from "react-konva";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addShape, selectShape, updateShape } from "../store/shapeSlice";
import { Shape, ShapeType } from "../types";
import { v4 as uuidv4 } from "uuid";

interface ShapeLayerProps {
  width: number;
  height: number;
  selectedTool: ShapeType;
}

/**
 * KonvaTransformer:
 * Transformer komponenti seçilmiş node-a əlavə olunur və qısa tween animasiya ilə vurğulanır.
 */
const KonvaTransformer: React.FC<{ selectedId: string | null }> = ({
  selectedId,
}) => {
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const stage = transformerRef.current?.getStage();
    const selectedNode = stage?.findOne(`#${selectedId}`);
    if (selectedNode && selectedNode.getLayer()) {
      transformerRef.current?.nodes([selectedNode]);
      if (transformerRef.current) {
        transformerRef.current.getLayer()?.batchDraw();
      }

      // Node tam render olduqdan sonra animasiya başlasın
      requestAnimationFrame(() => {
        const tween = new Konva.Tween({
          node: selectedNode,
          scaleX: selectedNode.scaleX() * 1.05,
          scaleY: selectedNode.scaleY() * 1.05,
          duration: 0.2,
          easing: Konva.Easings.EaseInOut,
          onFinish: () => {
            new Konva.Tween({
              node: selectedNode,
              scaleX: 1,
              scaleY: 1,
              duration: 0.2,
              easing: Konva.Easings.EaseInOut,
            }).play();
          },
        });
        tween.play();
      });
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  return <Transformer ref={transformerRef} />;
};

/**
 * ShapeLayer:
 * - PDF overlay üzərində fiqurların yaradılması və redaktəsi.
 * - Yeni fiqurlar mouse event-ləri ilə yaradılır.
 * - Seçilmiş fiqurlar drag & transform vasitəsilə redaktəyə açılır.
 */
export const ShapeLayer: React.FC<ShapeLayerProps> = ({
  width,
  height,
  selectedTool,
}) => {
  const dispatch = useDispatch();
  const shapes = useSelector((state: RootState) => state.shape.shapes);
  const selectedShapeId = useSelector(
    (state: RootState) => state.shape.selectedShapeId
  );
  const [newShape, setNewShape] = useState<Shape | null>(null);
  const stageRef = useRef<any>(null);

  // Yeni fiqurun yaradılması: mouseDown
  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    // Yalnız boş sahəyə klik ediləndə yeni fiqur yaradılır
    if (e.target === stage) {
      dispatch(selectShape(null));
      const id = uuidv4();
      let shape: Shape;
      switch (selectedTool) {
        case "rectangle":
          shape = {
            id,
            type: "rectangle",
            x: point.x,
            y: point.y,
            width: 0,
            height: 0,
            color: "red",
          };
          break;
        case "circle":
          shape = {
            id,
            type: "circle",
            x: point.x,
            y: point.y,
            radius: 0,
            color: "green",
          };
          break;
        case "line":
          shape = {
            id,
            type: "line",
            x: point.x,
            y: point.y,
            points: [point.x, point.y, point.x, point.y],
            color: "blue",
          };
          break;
        case "triangle":
          shape = {
            id,
            type: "triangle",
            x: point.x,
            y: point.y,
            points: [point.x, point.y, point.x, point.y, point.x, point.y],
            color: "purple",
          };
          break;
        default:
          return;
      }
      setNewShape(shape);
      dispatch(selectShape(id));
    }
  };

  // Yeni fiqurun ölçülərinin yenilənməsi: mouseMove
  const handleMouseMove = (e: any) => {
    if (!newShape) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;
    let updatedShape = { ...newShape };

    switch (selectedTool) {
      case "rectangle":
        updatedShape.width = point.x - newShape.x;
        updatedShape.height = point.y - newShape.y;
        break;
      case "circle": {
        const dx = point.x - newShape.x;
        const dy = point.y - newShape.y;
        updatedShape.radius = Math.sqrt(dx * dx + dy * dy);
        break;
      }
      case "line":
        updatedShape.points = [
          newShape.points![0],
          newShape.points![1],
          point.x,
          point.y,
        ];
        break;
      case "triangle": {
        const startX = newShape.points![0];
        const startY = newShape.points![1];
        const currentX = point.x;
        const midX = (startX + currentX) / 2;
        const baseLength = Math.abs(currentX - startX);
        const thirdY = startY - baseLength;
        updatedShape.points = [startX, startY, currentX, startY, midX, thirdY];
        break;
      }
      default:
        break;
    }
    setNewShape(updatedShape);
  };

  // Yeni fiqurun tamamlanması: mouseUp
  const handleMouseUp = (e: any) => {
    if (newShape) {
      dispatch(addShape(newShape));
      setNewShape(null);
    }
  };

  // Mövcud fiqurun seçilməsi
  const handleShapeClick = (e: any, id: string) => {
    e.cancelBubble = true;
    dispatch(selectShape(id));
  };

  // Drag & Drop: Fiqurun mövqeyinin yenilənməsi
  const handleDragEnd = (e: any, shape: Shape) => {
    const node = e.target;
    dispatch(
      updateShape({ id: shape.id, updates: { x: node.x(), y: node.y() } })
    );
  };

  // Transformasiya bitdikdən sonra ölçülərin yenilənməsi (yalnız rectangle və circle üçün)
  const handleTransformEnd = (e: any, shape: Shape) => {
    const node = e.target;
    if (shape.type === "rectangle") {
      const newWidth = node.width() * node.scaleX();
      const newHeight = node.height() * node.scaleY();
      dispatch(
        updateShape({
          id: shape.id,
          updates: {
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
          },
        })
      );
      node.scaleX(1);
      node.scaleY(1);
    } else if (shape.type === "circle") {
      const newRadius = node.radius() * node.scaleX();
      dispatch(
        updateShape({
          id: shape.id,
          updates: {
            x: node.x(),
            y: node.y(),
            radius: newRadius,
          },
        })
      );
      node.scaleX(1);
      node.scaleY(1);
    }
    // Xətt və üçbucaq üçün transformasiya dəstəyi əlavə edilə bilər.
  };

  // Fiqurun render edilməsi
  const renderShape = (shape: Shape) => {
    const isSelected = shape.id === selectedShapeId;
    const commonProps = {
      id: shape.id,
      onClick: (e: any) => handleShapeClick(e, shape.id),
      draggable: isSelected,
      onDragEnd: (e: any) => handleDragEnd(e, shape),
      stroke: shape.color,
      strokeWidth: isSelected ? 3 : 2,
    };

    const transformProps =
      isSelected && (shape.type === "rectangle" || shape.type === "circle")
        ? { onTransformEnd: (e: any) => handleTransformEnd(e, shape) }
        : {};

    switch (shape.type) {
      case "rectangle":
        return (
          <Rect
            key={shape.id}
            {...commonProps}
            {...transformProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
          />
        );
      case "circle":
        return (
          <Circle
            key={shape.id}
            {...commonProps}
            {...transformProps}
            x={shape.x + (shape.radius || 0)}
            y={shape.y + (shape.radius || 0)}
            radius={shape.radius || 0}
          />
        );
      case "line":
        return (
          <Line
            key={shape.id}
            {...commonProps}
            points={shape.points || []}
            lineCap="round"
            lineJoin="round"
          />
        );
      case "triangle":
        return (
          <Line
            key={shape.id}
            {...commonProps}
            points={shape.points || []}
            closed
            lineCap="round"
            lineJoin="round"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      className="cursor-crosshair"
    >
      <Layer>
        {shapes.map(renderShape)}
        {newShape && renderShape(newShape)}
        <KonvaTransformer selectedId={selectedShapeId} />
      </Layer>
    </Stage>
  );
};
