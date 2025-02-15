// src/hooks/usePDF.ts
import { useState } from "react";
export const usePDF = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(URL.createObjectURL(e.target.files[0]));
        }
    };
    const handlePageLoad = (size) => {
        setPageSize(size);
    };
    return { pdfFile, pageSize, handleFileUpload, handlePageLoad };
};
