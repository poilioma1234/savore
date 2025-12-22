import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({ example: 'Nguyễn Văn A', required: false })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({
        example: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        required: false,
        description: 'Địa chỉ đầy đủ'
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
