import React, { useRef, useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';

const PhotoUpload = ({ onPhotoSelect, selectedPhoto }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
      onPhotoSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('File harus berupa gambar dengan ukuran maksimal 10 MB');
    }
  };

  const handleRemove = () => {
    onPhotoSelect(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  React.useEffect(() => {
    if (!selectedPhoto) {
      setPreview(null);
    }
  }, [selectedPhoto]);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-gray-200"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs">
            <Camera size={12} className="inline mr-1" />
            Bukti Perbaikan
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Upload Foto Bukti Perbaikan
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Drag & drop foto di sini, atau klik untuk memilih file
          </p>
          <p className="text-xs text-gray-500">
            Format: JPG, PNG, GIF (Max. 10 MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;