import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addShape, updateShape, removeShape } from "../store/shapeSlice";
import { Shape } from "../types";

export const useShapes = () => {
  const dispatch = useDispatch();
  // Changed "shapes" to "shape" based on the store slice key
  const shapeState = useSelector((state: RootState) => state.shape);

  const addNewShape = (shape: Shape) => {
    dispatch(addShape(shape));
  };

  const editShape = (id: string, updatedData: Partial<Shape>) => {
    // Dispatch using the key 'changes' as expected in the slice
    const shapeType =
      updatedData.type ??
      shapeState.shapes.find((shape) => shape.id === id)?.type;
    if (!shapeType) {
      throw new Error("Shape type is required");
    }
    dispatch(updateShape({ id, updates: { ...updatedData, type: shapeType } }));
  };

  const deleteShape = (id: string) => {
    dispatch(removeShape(id));
  };

  return { shapeState, addNewShape, editShape, deleteShape };
};
