import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
    @ApiProperty({
        example: 'SUPPLIER',
        description: 'Role code để gán cho user',
        enum: ['ADMIN', 'CREATOR', 'USER', 'SUPPLIER']
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(['ADMIN', 'CREATOR', 'USER', 'SUPPLIER'])
    roleCode: 'ADMIN' | 'CREATOR' | 'USER' | 'SUPPLIER';
}
