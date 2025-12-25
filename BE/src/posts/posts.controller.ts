import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CalculateIngredientsDto } from './dto/calculate-ingredients.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CREATOR')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new post (CREATOR only)' })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - CREATOR role required' })
    @Post()
    create(@Body() createPostDto: CreatePostDto, @Request() req) {
        return this.postsService.create(createPostDto, req.user.userId);
    }

    // API ĐẶC BIỆT THEO YÊU CẦU MENTOR
    @Post('calculate-ingredients')
    @ApiOperation({
        summary: 'Calculate aggregated ingredients from multiple posts (YÊU CẦU MENTOR)',
        description: 'Nhận list ID của các bài đăng, nhóm nguyên liệu cùng loại và cộng dồn số lượng'
    })
    @ApiResponse({
        status: 200,
        description: 'Trả về danh sách nguyên liệu đã được tổng hợp với tổng số lượng và thông tin provider (có địa chỉ, lat/long)'
    })
    calculateIngredients(@Body() calculateIngredientsDto: CalculateIngredientsDto) {
        return this.postsService.calculateIngredients(calculateIngredientsDto.postIds);
    }

    // API 1: Get list posts với search theo tag (YÊU CẦU MENTOR)
    @Get()
    @ApiOperation({ summary: 'Get all posts with optional tag filter (Public)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'tagId', required: false, example: 1, description: 'Filter by tag ID' })
    @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('tagId') tagId?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const tagIdNum = tagId ? parseInt(tagId, 10) : undefined;
        return this.postsService.findAll(pageNum, limitNum, tagIdNum);
    }

    // Get random post (for social media feed)
    @Get('random')
    @ApiOperation({
        summary: 'Get a random post with weighted selection (Public)',
        description: 'Returns a random post prioritizing rating > like > view. Auto-increments view count.'
    })
    @ApiResponse({ status: 200, description: 'Random post retrieved successfully' })
    @ApiResponse({ status: 404, description: 'No posts available' })
    getRandom() {
        return this.postsService.getRandom();
    }

    // Get posts by user ID with sorting
    @Get('user/:userId')
    @ApiOperation({
        summary: 'Get posts by user ID with sorting (Public)',
        description: 'Sort types: 1=newest, 2=most viewed, 3=most liked, 4=highest rated'
    })
    @ApiQuery({ name: 'sortType', required: false, example: 1, description: '1=newest, 2=most viewed, 3=most liked, 4=highest rated' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'User posts retrieved successfully' })
    findByUserId(
        @Param('userId') userId: string,
        @Query('sortType') sortType?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const userIdNum = parseInt(userId, 10);
        const sortTypeNum = sortType ? parseInt(sortType, 10) : 1;
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.postsService.findByUserId(userIdNum, sortTypeNum, pageNum, limitNum);
    }

    // API 2: Get post by ID (YÊU CẦU MENTOR)
    @Get(':id')
    @ApiOperation({ summary: 'Get post by ID with full details (Public)' })
    @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CREATOR')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update post (CREATOR only - own posts)' })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only update own posts' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Request() req,
    ) {
        return this.postsService.update(id, updatePostDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CREATOR')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete post (CREATOR only - own posts)' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own posts' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.postsService.remove(id, req.user.userId);
    }
}
