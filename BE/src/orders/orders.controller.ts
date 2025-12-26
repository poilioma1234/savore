import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders/Receipts')
@Controller('receipts')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Create a new order (Auth required)',
        description: 'Tạo đơn hàng mới từ danh sách products. Hệ thống tự động tính giá và commission cho creator nếu có.'
    })
    @ApiResponse({
        status: 201,
        description: 'Order created successfully',
        schema: {
            example: {
                success: true,
                message: 'Order created successfully',
                data: {
                    id: 1,
                    userId: 1,
                    totalPrice: '150000',
                    status: 'PENDING',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    orderItems: [
                        {
                            id: 1,
                            productId: 1,
                            productNameAtPurchase: 'Gà',
                            priceAtPurchase: '50000',
                            quantity: 2,
                            commissionRate: 10,
                            commissionAmount: '10000',
                            supplierAmount: '90000',
                            product: {
                                id: 1,
                                name: 'Gà',
                                price: '50000'
                            },
                            sourcePost: {
                                id: 'uuid',
                                name: 'Món gà xào',
                                thumbnail: 'url'
                            },
                            creator: {
                                id: 5,
                                fullName: 'Chef ABC'
                            }
                        }
                    ]
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(req.user.userId, createOrderDto);
    }


    @Get('user/:userId')
    @ApiOperation({
        summary: 'Get all receipts/orders for a user (Public)',
        description: 'Lấy danh sách đơn hàng của user để chọn món ăn và đặt đơn'
    })
    @ApiParam({ name: 'userId', example: 1, description: 'User ID' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Receipts retrieved successfully',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: 1,
                        userId: 1,
                        totalPrice: '150000',
                        status: 'COMPLETED',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        orderItems: [
                            {
                                id: 1,
                                productNameAtPurchase: 'Gà',
                                priceAtPurchase: '50000',
                                quantity: '2',
                                sourcePost: {
                                    id: 'uuid',
                                    name: 'Món gà xào',
                                    thumbnail: 'url'
                                }
                            }
                        ]
                    }
                ],
                meta: {
                    total: 10,
                    page: 1,
                    limit: 10,
                    totalPages: 1
                }
            }
        }
    })
    findByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.ordersService.findByUserId(userId, pageNum, limitNum);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get receipt/order by ID (Public)' })
    @ApiParam({ name: 'id', example: 1, description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Receipt retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Receipt not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.findOne(id);
    }
}
