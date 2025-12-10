import { Check } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { NavbarPublic } from '../components/NavbarPublic';

export const Pricing: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <NavbarPublic />
            
             <div className="pt-20 pb-16 text-center max-w-3xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Planes simples y transparentes</h1>
                <p className="text-xl text-gray-600">Elige el plan que se adapte al tamaño de tu negocio.</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Free Plan */}
                    <PricingCard 
                        title="Emprendedor"
                        price="Gratis"
                        description="Para pequeños negocios que recién empiezan."
                        features={[
                            "Hasta 50 facturas / mes",
                            "1 Usuario",
                            "Facturas de Consumo (B02)",
                            "Soporte por Email"
                        ]}
                        buttonText="Crear Cuenta Gratis"
                        buttonLink="/register?plan=free"
                        highlight={false}
                    />

                    {/* Pro Plan */}
                    <PricingCard 
                        title="Pyme Pro"
                        price="RD$ 1,500"
                        period="/ mes"
                        description="Todo lo necesario para crecer sin límites."
                        features={[
                            "Facturas Ilimitadas",
                            "3 Usuarios",
                            "Crédito Fiscal (B01) + B02",
                            "Reportes de Inventario",
                            "Soporte Prioritario"
                        ]}
                        buttonText="Empezar Ahora"
                        buttonLink="/register?plan=pro"
                        highlight={true}
                    />

                    {/* Enterprise Plan */}
                    <PricingCard 
                        title="Empresarial"
                        price="RD$ 4,500"
                        period="/ mes"
                        description="Para empresas con alto volumen de transacciones."
                        features={[
                            "Todo lo de Pro",
                            "Usuarios Ilimitados",
                            "API de Integración",
                            "Múltiples Sucursales",
                            "Gerente de Cuenta Dedicado"
                        ]}
                        buttonText="Contactar Ventas"
                        buttonLink="/contact" // Placeholder
                        highlight={false}
                    />
                </div>
            </div>
        </div>
    );
};

const PricingCard = ({ title, price, period, description, features, buttonText, buttonLink, highlight }: any) => (
    <div className={`relative bg-white rounded-2xl p-8 shadow-sm flex flex-col ${highlight ? 'ring-2 ring-blue-600 shadow-xl scale-105 z-10' : 'border border-gray-200'}`}>
        {highlight && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Más Popular</span>
            </div>
        )}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 mt-2 text-sm">{description}</p>
        <div className="my-6">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            {period && <span className="text-gray-500">{period}</span>}
        </div>
        
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                </li>
            ))}
        </ul>

        <Link 
            to={buttonLink}
            className={`block w-full text-center py-3 rounded-xl font-bold transition-colors ${
                highlight 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
        >
            {buttonText}
        </Link>
    </div>
);
