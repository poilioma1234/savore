import { IsNotEmpty, IsBoolean, IsString, IsOptional } from 'class-validator';

export class BlockUserDto {
    @IsBoolean()
    @IsNotEmpty()
    isBlocked: boolean;

    @IsString()
    @IsOptional()
    reason?: string;
}
