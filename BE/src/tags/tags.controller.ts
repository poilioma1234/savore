import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new tag' })
    @ApiResponse({ status: 201, description: 'Tag created successfully' })
    @ApiResponse({ status: 409, description: 'Tag already exists' })
    create(@Body('name') name: string) {
        return this.tagsService.create(name);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tags' })
    @ApiResponse({ status: 200, description: 'Tags retrieved successfully' })
    findAll() {
        return this.tagsService.findAll();
    }

    @Get('popular')
    @ApiOperation({
        summary: 'Get popular tags',
        description: 'Get tags sorted by usage count in posts'
    })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'Popular tags retrieved successfully' })
    getPopular(@Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.tagsService.getPopularTags(limitNum);
    }

    @Get('search')
    @ApiOperation({
        summary: 'Search posts by tag IDs',
        description: 'Find posts that contain any of the specified tag IDs'
    })
    @ApiQuery({ name: 'tagIds', required: true, example: '1,2,3', description: 'Comma-separated tag IDs' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
    searchPosts(
        @Query('tagIds') tagIds: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const tagIdArray = tagIds.split(',').map(id => parseInt(id, 10));
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.tagsService.searchPostsByTags(tagIdArray, pageNum, limitNum);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get tag by ID' })
    @ApiResponse({ status: 200, description: 'Tag retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Tag not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tagsService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a tag' })
    @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
    @ApiResponse({ status: 404, description: 'Tag not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tagsService.remove(id);
    }
}
