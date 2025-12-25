import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all orders (receipts) for a specific user
     */
    async findByUserId(userId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    orderItems: {
                        include: {
                            product: true,
                            sourcePost: {
                                select: {
                                    id: true,
                                    name: true,
                                    thumbnail: true,
                                },
                            },
                            creator: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);

        return {
            success: true,
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get order by ID
     */
    async findOne(id: number, userId?: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                        sourcePost: {
                            select: {
                                id: true,
                                name: true,
                                thumbnail: true,
                            },
                        },
                        creator: {
                            select: {
                                id: true,
                                fullName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // If userId is provided, verify ownership
        if (userId && order.userId !== userId) {
            throw new NotFoundException('Order not found');
        }

        return {
            success: true,
            data: order,
        };
    }
}
