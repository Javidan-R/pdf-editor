// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import shapeReducer from "./shapeSlice";
export const store = configureStore({
    reducer: {
        shape: shapeReducer,
    },
});
