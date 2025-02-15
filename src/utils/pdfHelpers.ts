export const getPageSize = async (pdfDocument: any): Promise<{ width: number; height: number }> => {
    const firstPage = await pdfDocument.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    return { width: viewport.width, height: viewport.height };
  };
  