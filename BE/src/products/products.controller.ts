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
    ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product (SUPPLIER only)' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - SUPPLIER role required' })
    create(@Request() req, @Body() createProductDto: CreateProductDto) {
        return this.productsService.create(req.user.userId, createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products (Public)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'supplierId', required: false, example: 4 })
    @ApiQuery({ name: 'status', required: false, example: 'ACTIVE' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('supplierId') supplierId?: string,
        @Query('status') status?: string,
    ) {
        return this.productsService.findAll(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            supplierId ? parseInt(supplierId) : undefined,
            status,
        );
    }

    @Get('my-products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my products (SUPPLIER only)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'My products retrieved successfully' })
    getMyProducts(
        @Request() req,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.productsService.getMyProducts(
            req.user.userId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID (Public)' })
    @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product (SUPPLIER only - own products)' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only update own products' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.update(id, req.user.userId, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPPLIER')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete product (SUPPLIER only - own products)' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own products' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.productsService.remove(id, req.user.userId);
    }
}
