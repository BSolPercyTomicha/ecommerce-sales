import { Controller, Get, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleRequestDto } from './dto/create-sale.dto';
import type { SaleResponse } from './interfaces/sale-response.interface';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Get()
    async getSales(): Promise<SaleResponse[]> {
        return this.salesService.getSales(); // ← Con async/await
    }

    @Post()
    async createSale(@Body() createSaleDto: CreateSaleRequestDto): Promise<SaleResponse> {
        return this.salesService.createSale(createSaleDto); // ← Con async/await
    }
}