import { CheckCircle, FileText, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from '../api';

interface Invoice {
    id: number;
    client_id: number;
    total: string;
    status: string;
    created_at: string;
}

export const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/invoices');
            setInvoices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const signInvoice = async (id: number) => {
        try {
            await axios.post(`http://localhost:3000/api/invoices/${id}/sign`);
            fetchInvoices();
        } catch (err) {
            alert('Error signing invoice');
        }
    };

    const sendToDGII = async (id: number) => {
        try {
            const conf = window.confirm('¿Estás seguro de enviar esta factura a la DGII?');
            if (!conf) return;

            await axios.post(`http://localhost:3000/api/invoices/${id}/send`);
            alert('Factura enviada correctamente');
            fetchInvoices();
        } catch (err: any) {
            console.error(err);
            alert('Error al enviar: ' + (err.response?.data?.error || 'Error desconocido'));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Facturas</h2>
                    <p className="text-gray-500 mt-1">Gestiona y visualiza tus comprobantes fiscales</p>
                </div>
                <button
                    onClick={fetchInvoices}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    title="Actualizar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Factura</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                                <FileText size={18} />
                                            </div>
                                            <span className="font-medium text-gray-900">#{inv.id.toString().padStart(6, '0')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(inv.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">RD$ {parseFloat(inv.total).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${inv.status === 'sent'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : inv.status === 'signed'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : inv.status === 'draft'
                                                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>
                                            {inv.status === 'sent' ? <Send size={12} /> : inv.status === 'signed' ? <CheckCircle size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                            {inv.status === 'sent' ? 'Enviada' : inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {inv.status === 'draft' && (
                                            <button
                                                onClick={() => signInvoice(inv.id)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Firmar
                                            </button>
                                        )}
                                        {inv.status === 'signed' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`http://localhost:3000/api/invoices/${inv.id}/xml`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    XML
                                                </a>
                                                <button
                                                    onClick={() => sendToDGII(inv.id)}
                                                    className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <Send size={14} /> Enviar
                                                </button>
                                            </div>
                                        )}
                                        {inv.status === 'sent' && (
                                            <span className="text-sm text-gray-400 font-medium px-3">Enviada</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText size={48} className="text-gray-200" />
                                            <p>No hay facturas registradas</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
