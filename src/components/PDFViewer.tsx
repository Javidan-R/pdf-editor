import React, { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFViewerProps } from "../types";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// PDF.js worker yolunu təyin edirik
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onLoadSuccess }) => {
  const [numPages, setNumPages] = useState<number>(0);

  // onLoadSuccess funksiyasını memoize edirik ki, re-render zamanı dəyişməsin
  const handleDocumentLoadSuccess = useCallback(
    (pdf: any) => {
      setNumPages(pdf.numPages);
      // İlk səhifənin ölçülərini əldə edirik
      pdf.getPage(1).then((page: any) => {
        const viewport = page.getViewport({ scale: 1 });
        onLoadSuccess({ width: viewport.width, height: viewport.height });
      });
    },
    [onLoadSuccess]
  );

  return (
    <div className="w-full h-full">
      <Document file={file} onLoadSuccess={handleDocumentLoadSuccess}>
        {Array.from({ length: numPages }, (_, index) => (
          <div key={`page_${index + 1}`} className="w-full">
            <Page
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="w-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default React.memo(PDFViewer);
