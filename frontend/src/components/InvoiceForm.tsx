import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../services/clientService';
import { getProducts } from '../services/productService';
import { createInvoice } from '../services/invoiceService';
import type { Client, Product, InvoiceFormData } from '../types';
import { InvoiceGeneralInfo } from './invoices/InvoiceGeneralInfo';
import { InvoiceItems } from './invoices/InvoiceItems';
import { InvoiceTotals } from './invoices/InvoiceTotals';

export const InvoiceForm: React.FC = () => {
    const navigate = useNavigate();
    const [clients, setClients] = React.useState<Client[]>([]);
    const [products, setProducts] = React.useState<Product[]>([]);

    const { register, control, handleSubmit, watch, setValue } = useForm<InvoiceFormData>({
        defaultValues: {
            client_id: 0,
            items: [{ description: 'Servicio', quantity: 1, unit_price: 0, product_id: 0 }],
            type_code: '31'
        }
    });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsData, productsData] = await Promise.all([
                    getClients(),
                    getProducts()
                ]);
                setClients(clientsData);
                setProducts(productsData);
            } catch (err) {
                console.error('Error fetching data', err);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: InvoiceFormData) => {
        try {
            await createInvoice(data);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Error creating invoice');
        }
    };

    // Calculate totals for preview
    const items = watch('items');
    // Guard against items being undefined/null initially or during updates
    const currentItems = items || [];
    const subtotal = currentItems.reduce((sum, item) => sum + ( (item.quantity || 0) * (item.unit_price || 0) ), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Nueva Factura</h2>
                <p className="text-gray-500 mt-1">Crea un nuevo comprobante fiscal</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <InvoiceGeneralInfo 
                    clients={clients} 
                    register={register} 
                    watch={watch} 
                />

                <InvoiceItems 
                    control={control} 
                    register={register} 
                    setValue={setValue} 
                    products={products}
                    items={currentItems}
                />

                <InvoiceTotals 
                    subtotal={subtotal} 
                    tax={tax} 
                    total={total} 
                />
            </form>
        </div>
    );
};
