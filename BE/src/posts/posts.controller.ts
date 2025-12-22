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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new post (CREATOR only)' })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - CREATOR role required' })
    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
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
    @ApiQuery({ name: 'tag', required: false, example: 'gà' })
    @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('tag') tag?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.postsService.findAll(pageNum, limitNum, tag);
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
    @ApiBearerAuth()
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete post (CREATOR only - own posts)' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own posts' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.postsService.remove(id, req.user.userId);
    }
}
