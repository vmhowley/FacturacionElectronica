import React, { useEffect, useState } from 'react';
import { loaderService } from '../utils/loaderService';

export const GlobalLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(loaderService.isLoading);

  useEffect(() => {
    return loaderService.subscribe((loading) => {
      setIsLoading(loading);
    });
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Procesando...</p>
      </div>
    </div>
  );
};
