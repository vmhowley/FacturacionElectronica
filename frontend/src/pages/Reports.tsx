import { BarChart3 } from 'lucide-react';
import React from 'react';

export const Reports: React.FC = () => {
  return (
    <div>
       <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="text-blue-600 w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Reportes Financieros</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
            <p className="text-lg">Módulo de Reportes (Solo Admin/Contador)</p>
            <p className="mt-2 text-sm">Aquí se mostrarán los gráficos de ventas e inventario.</p>
        </div>
    </div>
  );
};
