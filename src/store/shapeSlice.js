// src/store/shapeSlice.ts
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    shapes: [],
    selectedShapeId: null,
};
const shapeSlice = createSlice({
    name: "shape",
    initialState,
    reducers: {
        addShape: (state, action) => {
            state.shapes.push(action.payload);
        },
        updateShape: (state, action) => {
            const shape = state.shapes.find((s) => s.id === action.payload.id);
            if (shape) {
                Object.assign(shape, action.payload.updates);
            }
        },
        removeShape: (state, action) => {
            state.shapes = state.shapes.filter((s) => s.id !== action.payload);
            if (state.selectedShapeId === action.payload) {
                state.selectedShapeId = null;
            }
        },
        selectShape: (state, action) => {
            state.selectedShapeId = action.payload;
        },
    },
});
export const { addShape, updateShape, removeShape, selectShape } = shapeSlice.actions;
export default shapeSlice.reducer;
