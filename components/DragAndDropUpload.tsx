import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface DragAndDropUploadProps {
  onFilesSelected: (files: FileList | null) => void;
  disabled?: boolean;
  title?: string;
  description?: string;
  buttonLabel?: string;
}

const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({
  onFilesSelected,
  disabled = false,
  title = 'Arraste e solte arquivos aqui',
  description = 'ou clique para selecionar documentos no seu computador',
  buttonLabel = 'Selecionar arquivos',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileList = (files: FileList | null) => {
    if (disabled) return;
    onFilesSelected(files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileList(event.dataTransfer.files);
  };

  return (
    <label
      className={`w-full border-2 border-dashed rounded-2xl p-5 flex items-center justify-between transition ${
        disabled
          ? 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-70'
          : isDragging
            ? 'border-indigo-400 bg-indigo-100'
            : 'border-indigo-200 bg-indigo-50/40 cursor-pointer hover:bg-indigo-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <UploadCloud className="text-indigo-600" size={20} />
        <div>
          <p className="text-sm font-black text-indigo-700">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => handleFileList(event.target.files)}
        disabled={disabled}
      />
      <span className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-black uppercase">{buttonLabel}</span>
    </label>
  );
};

export default DragAndDropUpload;
