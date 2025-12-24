import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'user@savore.com',
        description: 'Email của user'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'Mật khẩu (tối thiểu 6 ký tự)'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
