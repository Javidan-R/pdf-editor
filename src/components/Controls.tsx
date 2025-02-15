import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { removeShape } from "../store/shapeSlice";
import { ShapeType } from "../types";

interface ControlsProps {
  selectedTool: ShapeType;
  onToolChange: (tool: ShapeType) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  selectedTool,
  onToolChange,
}) => {
  const dispatch = useDispatch();
  const selectedShapeId = useSelector(
    (state: RootState) => state.shape.selectedShapeId
  );

  // Trigger animasiya hər dəfə selectedTool dəyişəndə
  const [animateTool, setAnimateTool] = useState(false);
  useEffect(() => {
    setAnimateTool(true);
    const timer = setTimeout(() => setAnimateTool(false), 500);
    return () => clearTimeout(timer);
  }, [selectedTool]);

  const handleDelete = () => {
    if (selectedShapeId) {
      dispatch(removeShape(selectedShapeId));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-2xl border border-transparent hover:border-white transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <label htmlFor="tool-select" className="text-xl font-bold text-white">
          Alət Seçimi:
        </label>
        <div className="relative w-full md:w-auto">
          <select
            id="tool-select"
            value={selectedTool}
            onChange={(e) => onToolChange(e.target.value as ShapeType)}
            className="block appearance-none w-full px-5 py-3 bg-white bg-opacity-90 text-gray-900 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            <option value="rectangle">Düzbucaq</option>
            <option value="circle">Dairə</option>
            <option value="line">Xətt</option>
            <option value="triangle">Üçbucaq</option>
          </select>
          {/* Custom dropdown icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.516 7.548L10 12.032l4.484-4.484 1.032 1.032L10 14.096 4.484 8.58z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => console.log("Cari Alət:", selectedTool)}
          className={`flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${
            animateTool ? "animate-pulse" : ""
          }`}
        >
          Cari Alət: <span className="ml-3 uppercase">{selectedTool}</span>
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedShapeId}
          className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Seçilmiş Fiquru Sil
        </button>
      </div>
    </div>
  );
};