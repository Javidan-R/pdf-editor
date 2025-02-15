// src/types.ts
export type ShapeType = "rectangle" | "circle" | "line" | "triangle";

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width?: number;    // rectangle
  height?: number;   // rectangle
  radius?: number;   // circle
  points?: number[]; // line & triangle
  color: string;
}

export interface PDFViewerProps {
  file: string;
  onLoadSuccess: (size: { width: number; height: number }) => void;
}
