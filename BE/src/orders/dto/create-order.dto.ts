import { IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
    @ApiProperty({
        example: 1,
        description: 'Product ID'
    })
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @ApiProperty({
        example: 2,
        description: 'Quantity'
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({
        example: 'uuid-post-id',
        description: 'Source post ID (optional)',
        required: false
    })
    @IsUUID()
    @IsOptional()
    sourcePostId?: string;

    @ApiProperty({
        example: 5,
        description: 'Creator ID (optional - for commission)',
        required: false
    })
    @IsNumber()
    @IsOptional()
    creatorId?: number;
}

export class CreateOrderDto {
    @ApiProperty({
        type: [CreateOrderItemDto],
        description: 'List of order items',
        example: [
            {
                productId: 1,
                quantity: 2,
                sourcePostId: 'uuid-post-id',
                creatorId: 5
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @IsNotEmpty()
    orderItems: CreateOrderItemDto[];

    @ApiProperty({
        example: 'Giao hàng đến 123 Nguyễn Huệ',
        description: 'Delivery note (optional)',
        required: false
    })
    @IsString()
    @IsOptional()
    note?: string;
}
