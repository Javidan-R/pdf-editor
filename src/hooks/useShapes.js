import { useDispatch, useSelector } from "react-redux";
import { addShape, updateShape, removeShape } from "../store/shapeSlice";
export const useShapes = () => {
    const dispatch = useDispatch();
    // Changed "shapes" to "shape" based on the store slice key
    const shapeState = useSelector((state) => state.shape);
    const addNewShape = (shape) => {
        dispatch(addShape(shape));
    };
    const editShape = (id, updatedData) => {
        // Dispatch using the key 'changes' as expected in the slice
        const shapeType = updatedData.type ??
            shapeState.shapes.find((shape) => shape.id === id)?.type;
        if (!shapeType) {
            throw new Error("Shape type is required");
        }
        dispatch(updateShape({ id, updates: { ...updatedData, type: shapeType } }));
    };
    const deleteShape = (id) => {
        dispatch(removeShape(id));
    };
    return { shapeState, addNewShape, editShape, deleteShape };
};
