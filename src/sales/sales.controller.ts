import { Controller, Get, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleRequestDto } from './dto/create-sale.dto';
import type { SaleResponse } from './interfaces/sale-response.interface';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Get()
    getSales(): SaleResponse[] {
        return this.salesService.getSales();
    }

    @Post()
    createSale(@Body() createSaleDto: CreateSaleRequestDto): SaleResponse {
        return this.salesService.createSale(createSaleDto);
    }
}