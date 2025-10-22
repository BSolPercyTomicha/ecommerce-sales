export interface SaleResponse {
    id: string;
    createdAt: Date;
    customerId: string;
    billingName: string;
    billingTaxId: string;
    totalAmount: number;
    customer: CustomerResponse;
    saleProducts: SaleProductResponse[];
}

export interface CustomerResponse {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    identificationNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface SaleProductResponse {
    id: string;
    saleId: string;
    productId: string;
    createdAt: Date;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
    product: ProductResponse;
}

export interface ProductResponse {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    price: number;
}