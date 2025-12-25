import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Thịt gà hữu cơ', description: 'Tên sản phẩm' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 150000, description: 'Giá sản phẩm (VND)' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;
}
