import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail, ArrowRight, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message === 'Invalid login credentials' 
                    ? 'Credenciales incorrectas' 
                    : 'Error al iniciar sesión');
            } else {
                toast.success('¡Bienvenido!');
                // Redirect is handled by PublicRoute in App.tsx automatically when session changes
            }
        } catch (error) {
            toast.error('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h2>
                        <p className="text-gray-500 mt-2">Ingresa a tu cuenta para gestionar tu facturación.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="tu@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : <>Ingresar <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                Regístrate gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
