import { Building2, Save, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from '../api';

export const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('company');
    const [company, setCompany] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [sequences, setSequences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, reset } = useForm();

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [companyRes, usersRes, sequencesRes] = await Promise.all([
                axios.get('/api/settings/company'),
                axios.get('/api/settings/users'),
                axios.get('/api/settings/sequences')
            ]);
            setCompany(companyRes.data);
            setUsers(usersRes.data);
            setSequences(sequencesRes.data);
            reset(companyRes.data); // Reset form with company data
        } catch (err) {
            console.error(err);
            toast.error('Error cargando configuración');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const onUpdateCompany = async (data: any) => {
        try {
            await axios.put('/api/settings/company', data);
            toast.success('Información actualizada');
            fetchAllData();
        } catch (err) {
            toast.error('Error al guardar');
        }
    };

    const  onUpdateSequence = async (id: number, next_number: number, end_date: string) => {
        try {
           await axios.put(`/api/settings/sequences/${id}`, { next_number, end_date });
           toast.success('Secuencia actualizada');
           fetchAllData();
        } catch(err) {
            toast.error('Error actualizando secuencia');
        }
    }

    if (loading) return <div>Cargando configuración...</div>;

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-gray-100 p-3 rounded-xl">
                    <Building2 className="text-gray-600 w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
                    <p className="text-gray-500">Administra tu empresa, usuarios y secuencias fiscales.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('company')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'company' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Empresa
                    {activeTab === 'company' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('sequences')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'sequences' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Secuencias Fiscales (NCF)
                    {activeTab === 'sequences' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Usuarios
                    {activeTab === 'users' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                
                {/* COMPANY TAB */}
                {activeTab === 'company' && (
                    <form onSubmit={handleSubmit(onUpdateCompany)} className="max-w-3xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                                <input {...register('name')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RNC / Cédula</label>
                                <input {...register('rnc')} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" title="Contacta soporte para cambiar esto" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input {...register('phone')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
                                <input {...register('email')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Física</label>
                                <input {...register('address')} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors">
                                <Save size={18} /> Guardar Cambios
                            </button>
                        </div>
                    </form>
                )}

                {/* SEQUENCES TAB */}
                {activeTab === 'sequences' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-gray-500 text-sm">
                                    <th className="py-3 px-4">Código</th>
                                    <th className="py-3 px-4">Tipo de Comprobante</th>
                                    <th className="py-3 px-4 text-center">Próximo Número</th>
                                    <th className="py-3 px-4 text-right">Vencimiento</th>
                                    <th className="py-3 px-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sequences.map((seq) => (
                                    <SequenceRow key={seq.id} sequence={seq} onUpdate={onUpdateSequence} />
                                ))}
                                {sequences.length === 0 && (
                                    <tr><td colSpan={5} className="py-4 text-center text-gray-400">No hay secuencias configuradas</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-700">Usuarios Activos</h3>
                            <button disabled className="text-gray-400 text-sm border px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-not-allowed">
                                <Users size={16} /> Agregar Usuario (Proximamente)
                            </button>
                        </div>
                         <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-gray-500 text-sm">
                                    <th className="py-3 px-4">Usuario / Email</th>
                                    <th className="py-3 px-4">Rol</th>
                                    <th className="py-3 px-4 text-right">Fecha Registro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-800">{u.username}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'accountant' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for Sequence Row to handle local state
const SequenceRow = ({ sequence, onUpdate }: { sequence: any, onUpdate: (id: number, next: number, date: string) => void }) => {
    const [next, setNext] = useState(sequence.next_number);
    const [date, setDate] = useState(sequence.end_date ? new Date(sequence.end_date).toISOString().split('T')[0] : '');
    const [isDirty, setIsDirty] = useState(false);

    const handleUpdate = () => {
        onUpdate(sequence.id, parseInt(next), date);
        setIsDirty(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="py-3 px-4 text-gray-500 text-sm font-mono">{sequence.type_code}</td>
            <td className="py-3 px-4 font-medium text-gray-800">
                {sequence.type_code === '01' && 'Crédito Fiscal'}
                {sequence.type_code === '02' && 'Consumo Final'}
                {sequence.type_code === '31' && 'e-CF Crédito Fiscal'}
                {sequence.type_code === '32' && 'e-CF Consumo'}
                {!['01','02','31','32'].includes(sequence.type_code) && 'Otro'}
            </td>
            <td className="py-3 px-4 text-center">
                 <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-400 text-xs">B{sequence.type_code}...</span>
                    <input 
                        type="number" 
                        value={next}
                        onChange={(e) => { setNext(e.target.value); setIsDirty(true); }}
                        className="w-20 px-2 py-1 border rounded text-center text-sm"
                    />
                 </div>
            </td>
            <td className="py-3 px-4 text-right">
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setIsDirty(true); }}
                    className="px-2 py-1 border rounded text-sm text-gray-600"
                />
            </td>
            <td className="py-3 px-4 text-right">
                {isDirty && (
                    <button onClick={handleUpdate} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        Guardar
                    </button>
                )}
            </td>
        </tr>
    );
}
