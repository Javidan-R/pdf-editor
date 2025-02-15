import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// PDF.js worker yolunu təyin edirik
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
const PDFViewer = ({ file, onLoadSuccess }) => {
    const [numPages, setNumPages] = useState(0);
    // onLoadSuccess funksiyasını memoize edirik ki, re-render zamanı dəyişməsin
    const handleDocumentLoadSuccess = useCallback((pdf) => {
        setNumPages(pdf.numPages);
        // İlk səhifənin ölçülərini əldə edirik
        pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            onLoadSuccess({ width: viewport.width, height: viewport.height });
        });
    }, [onLoadSuccess]);
    return (_jsx("div", { className: "w-full h-full", children: _jsx(Document, { file: file, onLoadSuccess: handleDocumentLoadSuccess, children: Array.from({ length: numPages }, (_, index) => (_jsx("div", { className: "w-full", children: _jsx(Page, { pageNumber: index + 1, renderTextLayer: false, renderAnnotationLayer: false, className: "w-full transition-transform duration-300 hover:scale-105" }) }, `page_${index + 1}`))) }) }));
};
export default React.memo(PDFViewer);
