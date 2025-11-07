import React, { useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

const App = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file?:File) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    setIsProcessing(true)
    setError(null);
    setProcessedImage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setOriginalImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
    try {
      const res = await removeBackground(file);
      const Url = URL.createObjectURL(res);
      setProcessedImage(Url);
    } catch (err) {
      setError("Failed to process image. Please try another image");
      console.log(err);
    }
    setIsProcessing(false);
  };
  const handleDragOver = (e:React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e:React.DragEvent) => {
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };
  const download = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-removed.png";
    link.click();
    URL.revokeObjectURL(processedImage)
  };
  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-fuchsia-950 via-neutral-900 to-purple-950 flex flex-col justify-center items-center p-4 gap-6">
      <h1 className="text-6xl sm:text-7xl text-center bg-gradient-to-r text-fuchsia-200 font-semibold">
        Background Remover
      </h1>
      <div className="w-full max-w-2xl bg-gradient-to-r from-fuchsia-900 to-indigo-950 backdrop-blur-md border border-fuchsia-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl">
        {!originalImage && (
          <div
            className="flex flex-col items-center justify-center h-96 mb-3 p-4 bg-gradient-to-b from-indigo-950 to-fuchsia-900 rounded-2xl opacity-80 hover:opacity-100 hover:shadow-fuchsia-700 shadow-2xl transition-all duration-400 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-4xl sm:text-5xl mb-4">📷</div>
            <div className="text-lg sm:text-xl text-fuchsia-200 mb-2">
              Drag & drop or click to upload an image
            </div>
            <div className="text-xs sm:text-sm text-fuchsia-400">
              JPG, PNG, WEBP Supported
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        )}
        {error && <div className="text-center text-pink-400 mb-4">{error}</div>}
        {originalImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="text-xl text-fuchsia-400 mb-2">Original</div>
              <div className="aspect-square w-full max-w-md mx-auto border-2 border-fuchsia-600/50 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={originalImage}
                  alt="Original"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl text-fuchsia-400 mb-2">
                Background Removed
              </div>
              <div className="aspect-square w-full max-w-md mx-auto border-2 border-fuchsia-600/50 rounded-2xl overflow-hidden flex items-center justify-center">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex items-center flex-col justify-center w-full h-full text-fuchsia-400">
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-6 w-6 border-2 border-t-fuchsia-100 rounded-full border-fuchsia-300/30"></div>
                        Processing...
                      </div>
                    ) : (
                      <span>Processed image will appear here</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {originalImage && (
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 mt-2">
            <button
              onClick={download}
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-rose-400 hover:opacity-80 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={!processedImage}
            >
              {processedImage ? "⬇ Download Image" : "Processing..."}
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-rose-400 hover:opacity-80 text-white font-semibold rounded-2xl  cursor-pointer"
            >
              🔁 Process Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
