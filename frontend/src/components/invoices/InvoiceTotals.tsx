import { Save } from 'lucide-react';
import React from 'react';

interface InvoiceTotalsProps {
    subtotal: number;
    tax: number;
    total: number;
}

export const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({ subtotal, tax, total }) => {
    return (
        <div className="flex justify-end">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm">
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium">RD$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>ITBIS (18%)</span>
                        <span className="font-medium">RD$ {tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-xl font-bold text-blue-600">RD$ {total.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Save size={20} /> Guardar Factura
                </button>
            </div>
        </div>
    );
};
