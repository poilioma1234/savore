import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user@savore.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Nguyễn Văn A', required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ example: 'SUPPLIER', enum: ['USER', 'CREATOR', 'SUPPLIER'] })
    @IsString()
    @IsNotEmpty()
    @IsIn(['USER', 'CREATOR', 'SUPPLIER'])
    role: 'USER' | 'CREATOR' | 'SUPPLIER';

    // ==================== YÊU CẦU PROVIDER ADDRESS ====================
    @ApiProperty({
        example: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        required: false,
        description: 'Địa chỉ đầy đủ (dùng để hiển thị trên Google Maps)'
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({
        example: 10.7756,
        required: false,
        description: 'GPS Latitude (từ -90 đến 90)',
        minimum: -90,
        maximum: 90
    })
    @IsNumber()
    @Min(-90)
    @Max(90)
    @IsOptional()
    latitude?: number;

    @ApiProperty({
        example: 106.7019,
        required: false,
        description: 'GPS Longitude (từ -180 đến 180)',
        minimum: -180,
        maximum: 180
    })
    @IsNumber()
    @Min(-180)
    @Max(180)
    @IsOptional()
    longitude?: number;
}
