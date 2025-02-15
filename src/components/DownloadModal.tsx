export const DownloadModal: React.FC<{ onClose: () => void; onDownload: (format: string) => void }> = ({ onClose, onDownload }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-80">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Download Format</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onDownload("png")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              PNG
            </button>
            <button
              onClick={() => onDownload("webp")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              WEBP
            </button>
            <button
              onClick={() => onDownload("pdf")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              PDF
            </button>
            <button
              onClick={() => onDownload("svg")}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              SVG
            </button>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };