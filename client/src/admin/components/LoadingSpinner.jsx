import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-600">Memuat data statistik...</p>
      </div>
    </div>
  );
};