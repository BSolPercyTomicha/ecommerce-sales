import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';  // ← ¡AGREGA ESTO!
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';
import { SaleProduct } from './entities/sale-product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale, SaleProduct]),
        HttpModule,
    ],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule { }