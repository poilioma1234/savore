import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class AssignRoleDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['ADMIN', 'CREATOR', 'USER', 'SUPPLIER'])
    roleCode: 'ADMIN' | 'CREATOR' | 'USER' | 'SUPPLIER';
}
