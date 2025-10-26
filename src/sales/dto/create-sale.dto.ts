import { IsString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleProductDto {
    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;
}

export class CreateSaleRequestDto {
    @IsString()
    customerId: string;

    @IsOptional() @IsString()
    billingName?: string;

    @IsOptional() @IsString()
    billingTaxId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleProductDto)
    saleProducts: CreateSaleProductDto[];
}