import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @ApiProperty({
        example: 'PUBLISHED',
        description: 'Trạng thái của post (DRAFT hoặc PUBLISHED)',
        required: false,
        enum: ['DRAFT', 'PUBLISHED']
    })
    @IsOptional()
    @IsString()
    @IsIn(['DRAFT', 'PUBLISHED'])
    status?: string;
}
