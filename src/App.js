import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { usePDF } from "./hooks/usePDF";
import { Controls } from "./components/Controls";
import { ShapeLayer } from "./components/ShapeLayer";
import PDFViewer from "./components/PDFViewer";
const App = () => {
    const { pdfFile, pageSize, handleFileUpload, handlePageLoad } = usePDF();
    const [selectedTool, setSelectedTool] = useState("rectangle");
    return (_jsx(Provider, { store: store, children: _jsxs("div", { className: "min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-300", children: [_jsx("header", { className: "bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 text-white py-10 shadow-2xl animate-fadeIn", children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx("h1", { className: "text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg", children: "PDF Editor" }), _jsx("p", { className: "text-lg sm:text-xl font-bold text-yellow-400 uppercase tracking-widest animate-pulse", children: "Haz\u0131rlad\u0131: Cavidan R\u0259c\u0259bli" })] }) }), _jsxs("main", { className: "flex-1 container mx-auto px-4 py-8", children: [_jsxs("section", { className: "mb-10", children: [_jsx("label", { htmlFor: "file-upload", className: "block text-2xl sm:text-3xl font-semibold text-gray-700 mb-4", children: "PDF Y\u00FCkl\u0259yin" }), _jsx("div", { className: "w-full max-w-md mx-auto", children: _jsx("input", { id: "file-upload", type: "file", accept: "application/pdf", onChange: handleFileUpload, className: "w-full p-4 border border-dashed border-gray-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg" }) })] }), pdfFile && (_jsxs("section", { className: "relative mx-auto mb-10 overflow-hidden rounded-2xl shadow-2xl", style: { width: pageSize.width, height: pageSize.height }, children: [_jsx("div", { className: "absolute inset-0", children: _jsx(PDFViewer, { file: pdfFile, onLoadSuccess: handlePageLoad }) }), _jsx("div", { className: "absolute inset-0", children: _jsx(ShapeLayer, { width: pageSize.width, height: pageSize.height, selectedTool: selectedTool }) })] })), _jsx("section", { className: "mb-10", children: _jsx(Controls, { selectedTool: selectedTool, onToolChange: setSelectedTool }) })] }), _jsx("footer", { className: "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 py-6", children: _jsx("div", { className: "container mx-auto px-4 text-center", children: _jsx("p", { className: "text-xs sm:text-sm", children: "\u00A9 2025 PDF Editor Pro. B\u00FCt\u00FCn h\u00FCquqlar qorunur." }) }) })] }) }));
};
export default App;
