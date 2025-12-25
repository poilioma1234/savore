import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'user@savore.com' })
    email: string;

    @ApiProperty({ example: 'Nguyễn Văn A' })
    fullName: string;

    @ApiProperty({ example: ['USER', 'CREATOR'], isArray: true })
    roles: string[];
}

export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;

    @ApiProperty({ type: UserResponseDto })
    user: UserResponseDto;
}
