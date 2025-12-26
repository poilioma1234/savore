import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
    @ApiProperty({
        example: 'Thịt gà hữu cơ',
        description: 'Tên nguyên liệu'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'gà',
        description: 'Tag để phân loại nguyên liệu (dùng cho search)'
    })
    @IsString()
    @IsNotEmpty()
    tag: string;

    @ApiProperty({
        example: 150000,
        description: 'Giá tiền 1kg nguyên liệu (VND)'
    })
    @IsNumber()
    @IsNotEmpty()
    pricePerKg: number;
}
