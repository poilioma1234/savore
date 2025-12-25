import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Orders/Receipts')
@Controller('receipts')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

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
