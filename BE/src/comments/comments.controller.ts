import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('posts/:postId')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new comment (Authenticated users)' })
    @ApiParam({ name: 'postId', description: 'ID của post', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 201, description: 'Comment created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Rating comments require order history' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @Post('comments')
    create(
        @Param('postId') postId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req
    ) {
        // Override postId from URL params
        createCommentDto.postId = postId;
        return this.commentsService.create(createCommentDto, req.user.userId);
    }

    @Get('comments')
    @ApiOperation({ summary: 'Get all regular comments for a post (Public)' })
    @ApiParam({ name: 'postId', description: 'ID của post', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
    findAllComments(@Param('postId') postId: string) {
        return this.commentsService.findAllByPost(postId, false);
    }

    @Get('ratingComments')
    @ApiOperation({ summary: 'Get all rating comments for a post (Public)' })
    @ApiParam({ name: 'postId', description: 'ID của post', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiResponse({ status: 200, description: 'Rating comments retrieved successfully' })
    findAllRatingComments(@Param('postId') postId: string) {
        return this.commentsService.findAllByPost(postId, true);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update a comment (Own comments only)' })
    @ApiParam({ name: 'postId', description: 'ID của post', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiParam({ name: 'id', description: 'ID của comment', example: '123e4567-e89b-12d3-a456-426614174001' })
    @ApiResponse({ status: 200, description: 'Comment updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only update own comments' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    @Patch('comments/:id')
    update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Request() req
    ) {
        return this.commentsService.update(id, updateCommentDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a comment (Own comments only)' })
    @ApiParam({ name: 'postId', description: 'ID của post', example: '123e4567-e89b-12d3-a456-426614174000' })
    @ApiParam({ name: 'id', description: 'ID của comment', example: '123e4567-e89b-12d3-a456-426614174001' })
    @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own comments' })
    @ApiResponse({ status: 404, description: 'Comment not found' })
    @Delete('comments/:id')
    remove(@Param('id') id: string, @Request() req) {
        return this.commentsService.remove(id, req.user.userId);
    }
}
