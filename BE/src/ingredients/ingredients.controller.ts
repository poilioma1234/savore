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
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new ingredient (SUPPLIER only)' })
    @ApiResponse({ status: 201, description: 'Ingredient created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - SUPPLIER role required' })
    @Post()
    create(@Body() createIngredientDto: CreateIngredientDto, @Request() req) {
        return this.ingredientsService.create(createIngredientDto, req.user.userId);
    }

    // ==================== YÊU CẦU MENTOR #4: FILTER BY PROVIDER ID ====================
    @Get()
    @ApiOperation({
        summary: 'Get all ingredients with filters (Public)',
        description: 'Lấy danh sách nguyên liệu với filter theo tag hoặc providerId (YÊU CẦU MENTOR)'
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'tag', required: false, example: 'gà' })
    @ApiQuery({ name: 'providerId', required: false, example: 4, description: 'Filter theo ID của provider (YÊU CẦU MENTOR)' })
    @ApiResponse({ status: 200, description: 'Ingredients retrieved successfully' })
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('tag') tag?: string,
        @Query('providerId') providerId?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const providerIdNum = providerId ? parseInt(providerId, 10) : undefined;
        return this.ingredientsService.findAll(pageNum, limitNum, tag, providerIdNum);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ingredient by ID (Public)' })
    @ApiResponse({ status: 200, description: 'Ingredient retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Ingredient not found' })
    findOne(@Param('id') id: string) {
        return this.ingredientsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update ingredient (SUPPLIER only - own ingredients)' })
    @ApiResponse({ status: 200, description: 'Ingredient updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only update own ingredients' })
    @ApiResponse({ status: 404, description: 'Ingredient not found' })
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateIngredientDto: UpdateIngredientDto,
        @Request() req,
    ) {
        return this.ingredientsService.update(id, updateIngredientDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete ingredient (SUPPLIER only - own ingredients)' })
    @ApiResponse({ status: 200, description: 'Ingredient deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own ingredients' })
    @ApiResponse({ status: 404, description: 'Ingredient not found' })
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.ingredientsService.remove(id, req.user.userId);
    }
}
