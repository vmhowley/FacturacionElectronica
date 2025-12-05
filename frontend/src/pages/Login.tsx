import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Magic Link Login
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            alert('Error logging in: ' + error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Acceso Cliente</h2>
                <p className="text-gray-500 text-center mb-8">Ingresa tu correo para recibir un enlace de acceso seguro.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="tu@empresa.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace mágico'}
                    </button>
                </form>
            </div>
        </div>
    );
};
