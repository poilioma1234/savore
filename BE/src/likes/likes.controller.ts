import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @Post()
  @ApiOperation({
    summary: 'Toggle like/unlike a post (Public)',
    description: 'If already liked -> unlike. If not liked -> like.'
  })
  @ApiResponse({
    status: 200,
    description: 'Like toggled successfully',
    schema: {
      example: {
        success: true,
        message: 'Post liked successfully',
        isLiked: true
      }
    }
  })
  toggleLike(@Body() body: { userId: number; postId: string }) {
    return this.likesService.toggleLike(body.userId, body.postId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get all posts liked by a user (Public)',
    description: 'Lấy danh sách posts user đã lưu - dùng để đặt hàng'
  })
  @ApiParam({ name: 'userId', example: 1, description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Liked posts retrieved successfully' })
  getLikedPostsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.likesService.getLikedPostsByUser(userId, pageNum, limitNum);
  }

  @Get('post/:postId/count')
  @ApiOperation({ summary: 'Get like count for a post (Public)' })
  @ApiParam({ name: 'postId', example: 'uuid', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Like count retrieved successfully' })
  getLikeCount(@Param('postId') postId: string) {
    return this.likesService.getLikeCount(postId);
  }

  @Get('check')
  @ApiOperation({
    summary: 'Check if user has liked a post (Public)',
    description: 'Check like status for a specific user and post'
  })
  @ApiQuery({ name: 'userId', required: true, example: 1, description: 'User ID' })
  @ApiQuery({ name: 'postId', required: true, example: 'uuid', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Like status retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          postId: 'uuid',
          isLiked: true
        }
      }
    }
  })
  checkLikeStatus(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('postId') postId: string
  ) {
    return this.likesService.checkLikeStatus(userId, postId);
  }
}
