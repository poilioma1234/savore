import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({ example: 'ACTIVE', description: 'Trạng thái sản phẩm', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'], required: false })
    @IsOptional()
    @IsString()
    @IsIn(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'])
    status?: string;
}
