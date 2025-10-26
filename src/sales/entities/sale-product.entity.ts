import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Sale } from './sale.entity';

@Entity('sale_products')
export class SaleProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sale, (sale) => sale.saleProducts, { onDelete: 'CASCADE' })
    sale: Sale;

    @Column()
    productId: string;

    @Column('decimal')
    unitPrice: number;

    @Column('int')
    quantity: number;

    @Column('decimal')
    totalAmount: number;

    @CreateDateColumn()
    createdAt: Date;
}