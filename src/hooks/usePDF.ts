// src/hooks/usePDF.ts
import { useState } from "react";

export const usePDF = () => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePageLoad = (size: { width: number; height: number }) => {
    setPageSize(size);
  };

  return { pdfFile, pageSize, handleFileUpload, handlePageLoad };
};
