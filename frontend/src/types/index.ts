export interface Client {
    id: number;
    name: string;
    // Add other fields as needed based on API response
}

export interface Product {
    id: number;
    sku: string;
    description: string;
    unit_price: number; // Changed from string to number to match usage
}

export interface InvoiceItem {
    product_id: number;
    description: string;
    quantity: number;
    unit_price: number;
}

export interface InvoiceFormData {
    client_id: number;
    items: InvoiceItem[];
    type_code: string;
    reference_ncf?: string;
}
