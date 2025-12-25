import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RecipeItemDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID của ingredient'
    })
    @IsString()
    @IsNotEmpty()
    ingredientId: string;

    @ApiProperty({
        example: 500,
        description: 'Số lượng nguyên liệu cần dùng'
    })
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({
        example: 'gram',
        description: 'Đơn vị đo (gram, kg, ml, lít, ...)',
        required: false
    })
    @IsString()
    @IsOptional()
    unit?: string;
}

export class CreatePostDto {
    @ApiProperty({
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Link video hướng dẫn nấu ăn'
    })
    @IsString()
    @IsNotEmpty()
    linkVideo: string;

    @ApiProperty({
        example: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        description: 'Link thumbnail của video',
        required: false
    })
    @IsString()
    @IsOptional()
    thumbnail?: string;

    @ApiProperty({
        example: 'Gà chiên nước mắm',
        description: 'Tên món ăn'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'Món gà chiên nước mắm thơm ngon, giòn rụm',
        description: 'Mô tả về món ăn',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: ['Bước 1: Ướp gà với gia vị', 'Bước 2: Chiên gà cho vàng giòn', 'Bước 3: Tưới nước mắm lên trên'],
        description: 'Các bước nấu ăn chi tiết (mảng các string)',
        required: false,
        type: [String]
    })
    @IsArray()
    @IsOptional()
    cookingSteps?: string[];

    @ApiProperty({
        example: [1, 2, 3],
        description: 'Array of tag IDs (từ table Tags)',
        type: [Number]
    })
    @IsArray()
    @IsNotEmpty()
    tagIds: number[];

    @ApiProperty({
        example: [
            {
                ingredientId: '550e8400-e29b-41d4-a716-446655440000',
                quantity: 500,
                unit: 'gram'
            },
            {
                ingredientId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
                quantity: 50,
                unit: 'ml'
            }
        ],
        description: 'Danh sách nguyên liệu cần dùng cho món ăn',
        type: [RecipeItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipeItemDto)
    recipeItems: RecipeItemDto[];
}
