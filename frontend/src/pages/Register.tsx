import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, FileDigit, Phone, MapPin, UserCheck, ArrowRight } from 'lucide-react';
import axios from '../api';

export const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const type = watch('type', 'juridico');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
        // Use full URL for public endpoint since it might not be covered by same axios instance baseURL perfectly or to be safe
        // Actually api.ts has baseURL localhost:3000, so we just need /api/auth/public/register
        await axios.post('/api/auth/public/register', data);
        toast.success('¡Cuenta creada exitosamente! Inicia sesión.');
        navigate('/login');
    } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.error || 'Error al registrarse');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Hero */}
        <div className="bg-blue-600 p-10 flex flex-col justify-between md:w-5/12 text-white">
            <div>
                <h1 className="text-3xl font-bold mb-4">Empieza a facturar hoy</h1>
                <p className="text-blue-100 leading-relaxed">
                    Únete a cientos de empresas que ya gestionan sus comprobantes fiscales electrónicos de forma fácil y segura.
                </p>
            </div>
            <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/50 p-2 rounded-lg"><UserCheck size={20} /></div>
                    <span>Cuentas ilimitadas</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/50 p-2 rounded-lg"><FileDigit size={20} /></div>
                    <span>e-CF Certificados DGII</span>
                </div>
            </div>
            <div className="mt-8 text-sm text-blue-200">
                © 2024 FacturaApp S.R.L.
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 md:w-7/12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Cuenta</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Account Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                {...register('email', { required: 'Requerido' })}
                                type="email"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                {...register('password', { required: 'Requerido', minLength: 6 })}
                                type="password"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="••••••"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100 my-4" />
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Datos de la Empresa</h3>

                {/* Company Type */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="juridico" {...register('type')} defaultChecked className="text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-700">Persona Jurídica</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="fisico" {...register('type')} className="text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-700">Persona Física</span>
                    </label>
                </div>

                {/* RNC & Company Name */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social / Nombre Comercial</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                {...register('company_name', { required: 'Requerido' })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="Mi Empresa S.R.L."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {type === 'juridico' ? 'RNC (9 dígitos)' : 'Cédula (11 dígitos)'}
                            </label>
                            <div className="relative">
                                <FileDigit className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    {...register('rnc', { 
                                        required: 'Requerido',
                                        pattern: { value: /^[0-9]+$/, message: 'Solo números' },
                                        minLength: type === 'juridico' ? 9 : 11,
                                        maxLength: type === 'juridico' ? 9 : 11
                                    })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    placeholder={type === 'juridico' ? '101000001' : '00100000001'}
                                />
                            </div>
                            {errors.rnc && <span className="text-red-500 text-xs mt-1">Longitud incorrecta</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    {...register('phone', { required: 'Requerido' })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    placeholder="809-555-0000"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                {...register('address', { required: 'Requerido' })}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="Av. Principal #123, Santo Domingo"
                            />
                        </div>
                    </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? 'Creando cuenta...' : (
                      <>
                        Crear Cuenta <ArrowRight size={20} />
                      </>
                  )}
                </button>

                <p className="text-center text-gray-600 mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800">
                        Inicia Sesión
                    </Link>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};
