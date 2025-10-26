import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesModule } from './sales/sales.module';
import { Sale } from './sales/entities/sale.entity';
import { SaleProduct } from './sales/entities/sale-product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      // entities: [Sale, SaleProduct],
      synchronize: true,  // Solo en dev; desactiva en prod
      logging: true,
    }),
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    SalesModule,
  ],
})
export class AppModule { }