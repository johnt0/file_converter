import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { convert_image } from "./pkg";

export default function FileUpload() {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<Uint8Array | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
    }
  }, []);

  const onConvert = async () => {
    if (!uploadedFile || !selectedFormat) {
      alert("Please upload a file and select a format.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      try {
        const start = performance.now();
        const result = await convert_image(uint8Array, selectedFormat);
        const end = performance.now();
        
        setConvertedImage(result);
        console.log(`WebASM execution time: ${end - start} ms`);
        download(result, uploadedFile);
      } catch (error) {
        console.error("Conversion error:", error);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const download = (convertedImage: Uint8Array, uploadedFile: File) => {
    const blob = new Blob([convertedImage], { type: `image/${selectedFormat}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const filenameWithoutExtension = uploadedFile.name.replace(/\.[^/.]+$/, "");
    a.download = `${filenameWithoutExtension}.${selectedFormat}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Drag and Drop Upload */}
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 dark:text-blue-400">Drop the image here...</p>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop an image here, or click to select one
            </p>
          )}
        </div>

        {/* Display Filename */}
        {uploadedFile && (
          <p className="mt-0 text-gray-600 dark:text-gray-300">
            {uploadedFile.name}
          </p>
        )}

        {/* Format Selection */}
        <select
          className="p-2 border border-gray-400 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          <option value="">Select format</option>
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
          <option value="webp">WEBP</option>
          <option value="gif">GIF</option>
        </select>

        {/* Convert Button */}
        <button
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full"
          onClick={onConvert}
          disabled={!uploadedFile || !selectedFormat}
        >
          Convert
        </button>
      </div>
    </div>
  );
}