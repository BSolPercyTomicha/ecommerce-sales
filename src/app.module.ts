import { Module } from '@nestjs/common';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [SalesModule],
})
export class AppModule { }