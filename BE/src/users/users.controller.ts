import { Controller, Get, Param, ParseIntPipe, Query, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get user profile by ID (Public - No auth required)' })
    @ApiParam({ name: 'id', example: 1, description: 'User ID' })
    @ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        schema: {
            example: {
                success: true,
                data: {
                    id: 1,
                    fullName: 'John Doe',
                    description: 'Food lover and chef',
                    avatar: 'https://example.com/avatar.jpg',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    followersCount: 150,
                    followingCount: 80,
                    postsCount: 25
                }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserById(id);
    }

    @Get(':id/posts')
    @ApiOperation({ summary: 'Get posts by user ID (Public)' })
    @ApiParam({ name: 'id', example: 1, description: 'User ID' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'User posts retrieved successfully' })
    getUserPosts(
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.usersService.getUserPosts(id, pageNum, limitNum);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Patch('profile')
    @ApiOperation({ summary: 'Update own profile (Auth required)' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    updateProfile(@Body() body: { description?: string; avatar?: string; fullName?: string }, @Request() req) {
        return this.usersService.updateProfile(req.user.userId, body);
    }

    @Get(':id/followers')
    @ApiOperation({ summary: 'Get followers of a user (Public)' })
    @ApiParam({ name: 'id', example: 1, description: 'User ID' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'Followers retrieved successfully' })
    getFollowers(
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.usersService.getFollowers(id, pageNum, limitNum);
    }

    @Get(':id/following')
    @ApiOperation({ summary: 'Get users that a user is following (Public)' })
    @ApiParam({ name: 'id', example: 1, description: 'User ID' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'Following retrieved successfully' })
    getFollowing(
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.usersService.getFollowing(id, pageNum, limitNum);
    }
}
