import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { InvoiceFormData, Product } from '../../types';

interface InvoiceItemsProps {
    control: Control<InvoiceFormData>;
    register: UseFormRegister<InvoiceFormData>;
    setValue: UseFormSetValue<InvoiceFormData>;
    products: Product[];
    items: any[]; // Watched items for calculations
}

export const InvoiceItems: React.FC<InvoiceItemsProps> = ({ control, register, setValue, products, items }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                    Detalle de Productos
                </h3>
                <button
                    type="button"
                    onClick={() => append({ description: '', quantity: 1, unit_price: 0, product_id: 0 })}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Agregar Item
                </button>
            </div>

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="group flex gap-4 items-start bg-gray-50/50 hover:bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Producto / Servicio</label>
                            <div className="space-y-2">
                                <select
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                                    onChange={(e) => {
                                        const prodId = parseInt(e.target.value);
                                        if (prodId) {
                                            const product = products.find((p) => p.id === prodId);
                                            if (product) {
                                                setValue(`items.${index}.product_id`, product.id);
                                                setValue(`items.${index}.description`, product.description);
                                                setValue(`items.${index}.unit_price`, product.unit_price);
                                            }
                                        } else {
                                            setValue(`items.${index}.product_id`, 0);
                                        }
                                    }}
                                >
                                    <option value="">Seleccionar del catálogo (Opcional)...</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.sku ? `[${p.sku}] ` : ''}{p.description} - RD${p.unit_price}</option>
                                    ))}
                                </select>
                                <input
                                    {...register(`items.${index}.description`)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                    placeholder="Descripción del producto"
                                />
                            </div>
                        </div>
                        <div className="w-28">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                            />
                        </div>
                        <div className="w-36">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Precio Unitario</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                                    className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="w-32">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Total</label>
                            <div className="px-3 py-2 bg-gray-100 rounded-lg text-right font-medium text-gray-700">
                                {((items[index]?.quantity || 0) * (items[index]?.unit_price || 0)).toFixed(2)}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
