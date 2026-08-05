import React from 'react';
import { Upload, X } from 'lucide-react';

interface ImagePreviewProps {
  file: File | null;
  previewUrl: string | null;
  onSelectFile: (file: File) => void;
  onClear: () => void;
  error?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  previewUrl,
  onSelectFile,
  onClear,
  error,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="text-xs font-semibold text-slate-700 tracking-wide block">
        Upload Crop Photograph (JPG / PNG ≤5MB) *
      </label>

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-72 bg-slate-900 group">
          <img src={previewUrl} alt="Crop sample preview" className="w-full h-72 object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 bg-slate-900/80 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/80 to-transparent text-xs text-slate-200 font-medium">
            {file?.name} ({(file ? file.size / (1024 * 1024) : 0).toFixed(2)} MB)
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-agri-500 rounded-2xl bg-slate-50/50 hover:bg-agri-50/20 cursor-pointer transition-all group">
          <div className="p-4 rounded-2xl bg-white shadow-xs group-hover:scale-105 transition-transform text-agri-600 mb-3">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold text-slate-700">Click or drag crop photograph to upload</p>
          <p className="text-xs text-slate-400 mt-1">High resolution leaf or stem close-up yields best results</p>
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
