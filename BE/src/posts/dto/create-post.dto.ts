import { IsNotEmpty, IsString, IsInt, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeItemDto {
    @IsString()
    @IsNotEmpty()
    ingredientId: string;

    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    unit?: string;
}

export class CreatePostDto {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    linkVideo: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    cookingSteps?: string;

    @IsString()
    @IsNotEmpty()
    tagVideo: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RecipeItemDto)
    recipeItems: RecipeItemDto[];
}
