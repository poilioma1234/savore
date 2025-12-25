import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean, IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({
        description: 'ID của post được comment',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    postId: string;

    @ApiProperty({
        description: 'Nội dung comment',
        example: 'Món này trông ngon quá! Mình sẽ thử làm.'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Danh sách URL hình ảnh đính kèm',
        example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        required: false,
        type: [String]
    })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiProperty({
        description: 'Có phải là comment đánh giá không (chỉ người đã đặt món mới được đánh giá)',
        example: false,
        required: false,
        default: false
    })
    @IsBoolean()
    @IsOptional()
    isRatingComment?: boolean;

    @ApiProperty({
        description: 'Điểm đánh giá (1-5 sao). Bắt buộc nếu isRatingComment = true',
        example: 4.5,
        required: false,
        minimum: 1,
        maximum: 5
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number;
}
