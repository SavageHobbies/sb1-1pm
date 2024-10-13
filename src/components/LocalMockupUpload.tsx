import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface LocalMockupUploadProps {
  onUpload: (mockups: { id: string; name: string; image: string }[]) => void;
}

const LocalMockupUpload: React.FC<LocalMockupUploadProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(fileList);
    }
  };

  const handleUpload = () => {
    const mockups = files.map((file, index) => ({
      id: `local-${index}`,
      name: file.name,
      image: URL.createObjectURL(file)
    }));
    onUpload(mockups);
    setFiles([]);
  };

  return (
    <div className="mb-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Click to select mockup images or PSD files, or drag and drop them here
        </p>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*,.psd"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {files.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Selected Files:</h4>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={files.length === 0}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Upload and Add to Templates
      </button>
    </div>
  );
};

export default LocalMockupUpload;