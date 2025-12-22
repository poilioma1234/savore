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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CREATOR')
    @Post()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    // API 1: Get list posts với search theo tag (YÊU CẦU MENTOR)
    @Get()
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
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('CREATOR')
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
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.postsService.remove(id, req.user.userId);
    }
}
