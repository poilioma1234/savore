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

@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @Post()
    create(@Body() createIngredientDto: CreateIngredientDto) {
        return this.ingredientsService.create(createIngredientDto);
    }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('tag') tag?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.ingredientsService.findAll(pageNum, limitNum, tag);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ingredientsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
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
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.ingredientsService.remove(id, req.user.userId);
    }
}
