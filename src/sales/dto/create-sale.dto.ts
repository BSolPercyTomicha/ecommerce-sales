export class CreateSaleRequestDto {
    customerId: string;
    billingName: string;
    billingTaxId: string;
    totalAmount: number;
    saleProducts: CreateSaleProductDto[];
}

export class CreateSaleProductDto {
    productId: string;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
}