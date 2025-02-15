// src/App.tsx
import React, { useState, useCallback } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "./store";
import { usePDF } from "./hooks/usePDF";
import { ShapeType } from "./types";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Controls, PDFViewer, ShapeLayer } from "./components";
import { clearShapes } from "./store/shapeSlice";

const App: React.FC = () => {
  const { pdfFile, pageSize, handleFileUpload, handlePageLoad, clearPDF } =
    usePDF();
  const [selectedTool, setSelectedTool] = useState<ShapeType>("rectangle");
  const dispatch = useDispatch();

  // İstifadəçinin redaktə etdiyi zaman (ən azı bir fiqur varsa) save düyməsi görünür:
  const shapes = useSelector((state: RootState) => state.shape.shapes);
  const isEditing = pdfFile && shapes.length > 0;

  // Save handler: html2canvas ilə #pdf-container elementinin screenshotunu çıxarır və seçilmiş formata görə yükləyir.
  const handleSave = useCallback(async () => {
    const confirmSave = window.confirm("Dəyişiklikləri saxlamaq istəyirsiniz?");
    if (!confirmSave) return;
    const element = document.getElementById("pdf-container");
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2 });
        // Burada istənilən formata görə yükləmə əlavə etmək olar.
        // Bu nümunədə yalnız PNG və PDF variantlarını göstəririk.
        const format = window
          .prompt("Yükləmə formatını daxil edin (png/pdf):", "png")
          ?.toLowerCase();
        if (format === "png") {
          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "edited-pdf.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (format === "pdf") {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation:
              pageSize.width > pageSize.height ? "landscape" : "portrait",
            unit: "px",
            format: [pageSize.width, pageSize.height],
          });
          pdf.addImage(imgData, "PNG", 0, 0, pageSize.width, pageSize.height);
          pdf.save("edited-pdf.pdf");
        } else {
          alert("Dəstəklənməyən format daxil edildi.");
          return;
        }
        // Yükləmə tamamlandıqdan sonra state təmizlənir.
        clearPDF();
        dispatch(clearShapes());
      } catch (error) {
        console.error("Error capturing PDF:", error);
      }
    }
  }, [pageSize, clearPDF, dispatch]);

  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 text-white py-10 shadow-2xl animate-fadeIn">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              PDF Editor Pro
            </h1>
            <p className="text-lg sm:text-xl font-bold text-yellow-400 uppercase tracking-widest animate-pulse">
              Hazırlayan: Cavidan Rəcəbli
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
              id="pdf-container"
              className="relative mx-auto mb-10 overflow-hidden rounded-2xl shadow-2xl"
              style={{ width: pageSize.width, height: pageSize.height }}
            >
              {/* PDFViewer və ShapeLayer eyni konteynerdə absolute yerləşir */}
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

          {isEditing && (
            <section className="mb-10 text-center">
              <button
                onClick={handleSave}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Save Edited PDF
              </button>
            </section>
          )}
        </main>
      </div>
    </Provider>
  );
};

export default App;
