import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleRequestDto } from './dto/create-sale.dto';
import {
    SaleResponse,
    CustomerResponse,
    ProductResponse,
    SaleProductResponse,
} from './interfaces/sale-response.interface';
import { Sale } from './entities/sale.entity';
import { SaleProduct } from './entities/sale-product.entity';

@Injectable()
export class SalesService {
    private readonly logger = new Logger(SalesService.name);
    private readonly customersUrl: string;
    private readonly productsUrl: string;

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Sale) private readonly saleRepo: Repository<Sale>,
        @InjectRepository(SaleProduct) private readonly saleProductRepo: Repository<SaleProduct>,
    ) {
        this.customersUrl = process.env.CUSTOMERS_BASE_URL || 'http://customers-micro:9000/api';
        this.productsUrl = process.env.PRODUCTS_BASE_URL || 'http://products-micro:3001/products-micro';

        this.logger.log(`Customers URL: ${this.customersUrl}`);
        this.logger.log(`Products URL: ${this.productsUrl}`);
    }

    private async getCustomerById(id: string): Promise<CustomerResponse> {
        try {
            const url = `${this.customersUrl}/customers/${id}`;
            this.logger.log(`Fetching customer from: ${url}`);

            const response = await firstValueFrom(
                this.httpService.get<CustomerResponse>(url),
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Error fetching customer ${id}:`, error.response?.data || error.message);
            throw new InternalServerErrorException(`Failed to fetch customer ${id}`);
        }
    }

    private async getProductById(id: string): Promise<ProductResponse> {
        try {
            const url = `${this.productsUrl}/products/${id}`;
            this.logger.log(`Fetching product from: ${url}`);

            const response = await firstValueFrom(
                this.httpService.get<ProductResponse>(url, {
                    timeout: 10000,
                    validateStatus: (status) => status >= 200 && status < 400,
                }),
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Error fetching product ${id}:`, {
                url: `${this.productsUrl}/products/${id}`,
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            throw new InternalServerErrorException(`Failed to fetch product ${id}`);
        }
    }

    async getSales(): Promise<SaleResponse[]> {
        const sales = await this.saleRepo.find({ relations: ['saleProducts'] });
        const enrichedSales: SaleResponse[] = [];

        for (const sale of sales) {
            try {
                const customer = await this.getCustomerById(sale.customerId);
                const saleProducts: SaleProductResponse[] = [];

                for (const sp of sale.saleProducts) {
                    const product = await this.getProductById(sp.productId);
                    saleProducts.push({ ...sp, product, saleId: sale.id });
                }

                enrichedSales.push({
                    ...sale,
                    customer,
                    saleProducts,
                    billingName: sale.billingName,
                    billingTaxId: sale.billingTaxId,
                    totalAmount: sale.totalAmount,
                });
            } catch (error) {
                this.logger.error(`Error enriching sale ${sale.id}:`, error.message);
            }
        }
        return enrichedSales;
    }

    async createSale(createSaleDto: CreateSaleRequestDto): Promise<SaleResponse> {
        const customer = await this.getCustomerById(createSaleDto.customerId);
        let totalAmount = 0;
        const sale = this.saleRepo.create({
            customerId: createSaleDto.customerId,
            billingName: createSaleDto.billingName || `${customer.firstName} ${customer.lastName}`,
            billingTaxId: createSaleDto.billingTaxId || customer.identificationNumber,
            totalAmount: 0,
        });

        await this.saleRepo.save(sale);

        const saleProducts: SaleProductResponse[] = [];

        for (const item of createSaleDto.saleProducts) {
            const product = await this.getProductById(item.productId);
            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            const sp = this.saleProductRepo.create({
                sale,
                productId: item.productId,
                unitPrice: product.price,
                quantity: item.quantity,
                totalAmount: subtotal,
            });
            await this.saleProductRepo.save(sp);

            saleProducts.push({ ...sp, product, saleId: sale.id });
        }

        sale.totalAmount = totalAmount;
        await this.saleRepo.save(sale);

        return {
            ...sale,
            customer,
            saleProducts,
        };
    }
}