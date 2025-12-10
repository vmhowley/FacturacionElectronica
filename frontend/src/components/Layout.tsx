import { BarChart3, FilePlus, FileText, LayoutDashboard, LogOut, Package, Settings, Users } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { profile, signOut } = useAuth();
    const role = profile?.role || 'user';

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-50 font-['Inter']">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <FileText className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">Factura<span className="text-blue-600">App</span></span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/dashboard')
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <LayoutDashboard size={20} className={isActive('/dashboard') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        to="/invoices"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/invoices')
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <FileText size={20} className={isActive('/invoices') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                        <span className="font-medium">Facturas</span>
                    </Link>

                    <Link
                        to="/create"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/create')
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <FilePlus size={20} className={isActive('/create') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                        <span className="font-medium">Nueva Factura</span>
                    </Link>

                    <Link
                        to="/clients"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/clients')
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Users size={20} className={isActive('/clients') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                        <span className="font-medium">Clientes</span>
                    </Link>

                    <Link
                        to="/products"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/products')
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Package size={20} className={isActive('/products') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                        <span className="font-medium">Productos</span>
                    </Link>

                    {(role === 'admin' || role === 'accountant') && (
                        <Link
                            to="/reports"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/reports')
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <BarChart3 size={20} className={isActive('/reports') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
                            <span className="font-medium">Reportes</span>
                        </Link>
                    )}

                    {role === 'admin' && (
                         <div className="pt-4 mt-4 border-t border-gray-100">
                            <Link
                                to="/settings"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
                            >
                                <Settings size={20} className="text-gray-400 group-hover:text-gray-600" />
                                <span className="font-medium">Configuración</span>
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button 
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center md:hidden">
                    <span className="text-xl font-bold text-gray-800">FacturaApp</span>
                    {/* Mobile menu button would go here */}
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
