// src/store/shapeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shape } from "../types";

interface ShapeState {
  shapes: Shape[];
  selectedShapeId: string | null;
}

const initialState: ShapeState = {
  shapes: [],
  selectedShapeId: null,
};

const shapeSlice = createSlice({
  name: "shape",
  initialState,
  reducers: {
    addShape: (state, action: PayloadAction<Shape>) => {
      state.shapes.push(action.payload);
    },
    updateShape: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Shape> }>
    ) => {
      const shape = state.shapes.find((s) => s.id === action.payload.id);
      if (shape) {
        Object.assign(shape, action.payload.updates);
      }
    },
    removeShape: (state, action: PayloadAction<string>) => {
      state.shapes = state.shapes.filter((s) => s.id !== action.payload);
      if (state.selectedShapeId === action.payload) {
        state.selectedShapeId = null;
      }
    },
    selectShape: (state, action: PayloadAction<string | null>) => {
      state.selectedShapeId = action.payload;
    },
    clearShapes: (state) => {
      state.shapes = [];
      state.selectedShapeId = null;
    },
  },
});

export const { addShape, updateShape, removeShape, selectShape, clearShapes } =
  shapeSlice.actions;
export default shapeSlice.reducer;
