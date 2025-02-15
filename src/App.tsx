// src/App.tsx
import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { usePDF } from "./hooks/usePDF";
import { ShapeType } from "./types";
import { Controls } from "./components/Controls";
import { ShapeLayer } from "./components/ShapeLayer";
import PDFViewer from "./components/PDFViewer";

const App: React.FC = () => {
  const { pdfFile, pageSize, handleFileUpload, handlePageLoad } = usePDF();
  const [selectedTool, setSelectedTool] = useState<ShapeType>("rectangle");

  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-300">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 text-white py-10 shadow-2xl animate-fadeIn">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              PDF Editor 
            </h1>
            <p className="text-lg sm:text-xl font-bold text-yellow-400 uppercase tracking-widest animate-pulse">
              Hazırladı: Cavidan Rəcəbli
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <section className="mb-10">
            <label
              htmlFor="file-upload"
              className="block text-2xl sm:text-3xl font-semibold text-gray-700 mb-4"
            >
              PDF Yükləyin
            </label>
            <div className="w-full max-w-md mx-auto">
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="w-full p-4 border border-dashed border-gray-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              />
            </div>
          </section>

          {pdfFile && (
            <section
              className="relative mx-auto mb-10 overflow-hidden rounded-2xl shadow-2xl"
              style={{ width: pageSize.width, height: pageSize.height }}
            >
              {/* PDFViewer və ShapeLayer eyni konteyner daxilində absolute yerləşir */}
              <div className="absolute inset-0">
                <PDFViewer file={pdfFile} onLoadSuccess={handlePageLoad} />
              </div>
              <div className="absolute inset-0">
                <ShapeLayer
                  width={pageSize.width}
                  height={pageSize.height}
                  selectedTool={selectedTool}
                />
              </div>
            </section>
          )}

          <section className="mb-10">
            <Controls
              selectedTool={selectedTool}
              onToolChange={setSelectedTool}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs sm:text-sm">
              © 2025 PDF Editor Pro. Bütün hüquqlar qorunur.
            </p>
          </div>
        </footer>
      </div>
    </Provider>
  );
};

export default App;
