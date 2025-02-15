export const getPageSize = async (pdfDocument) => {
    const firstPage = await pdfDocument.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    return { width: viewport.width, height: viewport.height };
};
