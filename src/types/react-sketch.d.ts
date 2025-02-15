// types/react-sketch.d.ts
declare module "react-sketch" {
  import { Component } from "react";

  export interface SketchFieldProps {
    width: number | string;
    height: number | string;
    tool: string;
    lineColor: string;
    lineWidth: number;
    onChange?: (e: any) => void;
  }

  export class SketchField extends Component<SketchFieldProps> {}

  export const Tools: {
    Pencil: string;
    Line: string;
    Rectangle: string;
    Circle: string;
  };
}
