import { Injectable } from '@nestjs/common';
import { CreateSaleRequestDto } from './dto/create-sale.dto';
import {
    SaleResponse,
    CustomerResponse,
    SaleProductResponse,
    ProductResponse
} from './interfaces/sale-response.interface';

@Injectable()
export class SalesService {
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private createMockCustomer(): CustomerResponse {
        return {
            id: this.generateUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            identificationNumber: '1234567890',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phoneNumber: '1234567890',
        };
    }

    private createMockProduct(): ProductResponse {
        return {
            id: this.generateUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
        };
    }

    private createMockSaleProduct(): SaleProductResponse {
        const product = this.createMockProduct();
        return {
            id: this.generateUUID(),
            saleId: this.generateUUID(),
            productId: product.id,
            createdAt: new Date(),
            unitPrice: 100,
            quantity: 1,
            totalAmount: 100,
            product: product,
        };
    }

    private createMockSale(): SaleResponse {
        const customer = this.createMockCustomer();
        return {
            id: this.generateUUID(),
            createdAt: new Date(),
            customerId: customer.id,
            billingName: 'John Doe',
            billingTaxId: '1234567890',
            totalAmount: 100,
            customer: customer,
            saleProducts: [this.createMockSaleProduct()],
        };
    }

    getSales(): SaleResponse[] {
        // Retornar array con 2 ventas de ejemplo
        return [
            this.createMockSale(),
            {
                ...this.createMockSale(),
                id: this.generateUUID(),
                billingName: 'Jane Smith',
                totalAmount: 200,
                saleProducts: [
                    {
                        ...this.createMockSaleProduct(),
                        id: this.generateUUID(),
                        unitPrice: 200,
                        totalAmount: 200,
                        product: {
                            ...this.createMockProduct(),
                            name: 'Product 2',
                            description: 'Description 2',
                            price: 200,
                        },
                    },
                ],
            },
        ];
    }

    createSale(createSaleDto: CreateSaleRequestDto): SaleResponse {
        // Crear una venta mock usando los datos del request combinados con datos mock
        const customer = this.createMockCustomer();
        const saleProduct = this.createMockSaleProduct();

        return {
            id: this.generateUUID(),
            createdAt: new Date(),
            customerId: createSaleDto.customerId || customer.id,
            billingName: createSaleDto.billingName || 'John Doe',
            billingTaxId: createSaleDto.billingTaxId || '1234567890',
            totalAmount: createSaleDto.totalAmount || 100,
            customer: customer,
            saleProducts: [saleProduct],
        };
    }
}