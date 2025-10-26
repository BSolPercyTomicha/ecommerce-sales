import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SaleProduct } from './sale-product.entity';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    customerId: string;

    @Column({ nullable: true })
    billingName: string;

    @Column({ nullable: true })
    billingTaxId: string;

    @Column('decimal')
    totalAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => SaleProduct, (saleProduct) => saleProduct.sale)
    saleProducts: SaleProduct[];
}