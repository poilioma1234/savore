import { IsNotEmpty, IsString } from 'class-validator';
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
}
