import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['USER', 'CREATOR', 'SUPPLIER'])
    role: 'USER' | 'CREATOR' | 'SUPPLIER';
}
