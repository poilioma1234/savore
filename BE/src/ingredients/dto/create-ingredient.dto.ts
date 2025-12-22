import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateIngredientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    tag: string;

    @IsInt()
    @IsNotEmpty()
    providerId: number;
}
