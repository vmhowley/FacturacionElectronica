import { Users } from 'lucide-react';
import React from 'react';

interface User {
    id: number;
    username: string;
    role: string;
    created_at: string;
}

interface UserSettingsProps {
    users: User[];
}

export const UserSettings: React.FC<UserSettingsProps> = ({ users }) => {
    return (
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
    );
};
