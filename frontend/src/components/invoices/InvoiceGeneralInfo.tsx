import { Plus } from 'lucide-react';
import React from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { Client, InvoiceFormData } from '../../types';

interface InvoiceGeneralInfoProps {
    clients: Client[];
    register: UseFormRegister<InvoiceFormData>;
    watch: UseFormWatch<InvoiceFormData>;
}

export const InvoiceGeneralInfo: React.FC<InvoiceGeneralInfoProps> = ({ clients, register, watch }) => {
    const navigate = useNavigate();
    const typeCode = watch('type_code');

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                Datos Generales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cliente</label>
                    <div className="flex gap-2">
                        <select
                            {...register('client_id', { valueAsNumber: true, required: 'Seleccione un cliente' })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                        >
                            <option value="">Seleccionar Cliente...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => navigate('/clients/new')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center"
                            title="Crear Nuevo Cliente"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Comprobante</label>
                    <select
                        {...register('type_code')}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                    >
                        <option value="31">Factura Crédito Fiscal (31)</option>
                        <option value="32">Factura de Consumo (32)</option>
                        <option value="33">Nota de Crédito (33)</option>
                        <option value="34">Nota de Débito (34)</option>
                        <option value="43">Gastos Menores (43)</option>
                        <option value="44">Regímenes Especiales (44)</option>
                        <option value="45">Gubernamental (45)</option>
                    </select>
                </div>

                {(typeCode === '33' || typeCode === '34') && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">NCF Afectado (Referencia)</label>
                        <input
                            {...register('reference_ncf', { required: 'El NCF Afectado es requerido para notas' })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                            placeholder="e.g. E3100000001"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
