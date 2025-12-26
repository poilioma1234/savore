import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new order
     */
    async create(userId: number, createOrderDto: CreateOrderDto) {
        const { orderItems } = createOrderDto;

        // Check user's wallet
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId }
        });

        if (!wallet) {
            throw new BadRequestException('Wallet not found. Please contact support.');
        }

        // Validate and fetch products
        const productIds = orderItems.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { supplier: true }
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException('Some products not found');
        }

        // Calculate total price and prepare data
        let totalPrice = 0;
        const orderItemsData: any[] = [];
        const supplierPayments = new Map<number, number>(); // supplierId -> amount
        const creatorPayments = new Map<number, number>(); // creatorId -> amount

        for (const item of orderItems) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new BadRequestException(`Product ${item.productId} not found`);
            }

            const itemTotal = Number(product.price) * item.quantity;
            totalPrice += itemTotal;

            // Commission calculation (5% for creator if sourcePostId provided)
            const commissionRate = item.creatorId && item.sourcePostId ? 5 : 0;
            const commissionAmount = (itemTotal * commissionRate) / 100;
            const supplierAmount = itemTotal - commissionAmount;

            // Track payments
            const currentSupplierAmount = supplierPayments.get(product.supplierId) || 0;
            supplierPayments.set(product.supplierId, currentSupplierAmount + supplierAmount);

            if (item.creatorId && commissionAmount > 0) {
                const currentCreatorAmount = creatorPayments.get(item.creatorId) || 0;
                creatorPayments.set(item.creatorId, currentCreatorAmount + commissionAmount);
            }

            orderItemsData.push({
                productId: item.productId,
                supplierId: product.supplierId,
                creatorId: item.creatorId || null,
                sourcePostId: item.sourcePostId || null,
                productNameAtPurchase: product.name,
                priceAtPurchase: product.price,
                quantity: item.quantity,
                commissionRate: commissionRate > 0 ? commissionRate : null,
                commissionAmount: commissionAmount > 0 ? commissionAmount : null,
                supplierAmount: supplierAmount,
            });
        }

        // Check if user has enough balance
        const currentBalance = Number(wallet.balance);
        if (currentBalance < totalPrice) {
            throw new BadRequestException(
                `Insufficient balance. Required: ${totalPrice.toLocaleString('vi-VN')} VND, Available: ${currentBalance.toLocaleString('vi-VN')} VND`
            );
        }

        // Create order and update wallets in a transaction
        const order = await this.prisma.$transaction(async (prisma) => {
            // Create order
            const newOrder = await prisma.order.create({
                data: {
                    userId,
                    totalPrice,
                    status: 'PENDING',
                    orderItems: {
                        create: orderItemsData,
                    },
                },
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
                                },
                            },
                        },
                    },
                },
            });

            // Deduct from user wallet
            const newUserBalance = currentBalance - totalPrice;
            await prisma.wallet.update({
                where: { userId },
                data: { balance: newUserBalance },
            });

            // Create user transaction record
            await prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: -totalPrice,
                    type: 'DEBIT',
                    sourceType: 'ORDER',
                    sourceId: newOrder.id,
                    balanceAfter: newUserBalance,
                    status: 'COMPLETED',
                },
            });

            // Add to supplier wallets
            for (const [supplierId, amount] of supplierPayments.entries()) {
                const supplierWallet = await prisma.wallet.findUnique({
                    where: { userId: supplierId }
                });

                if (supplierWallet) {
                    const newSupplierBalance = Number(supplierWallet.balance) + amount;
                    await prisma.wallet.update({
                        where: { userId: supplierId },
                        data: { balance: newSupplierBalance },
                    });

                    // Create supplier transaction
                    await prisma.transaction.create({
                        data: {
                            walletId: supplierWallet.id,
                            amount: amount,
                            type: 'CREDIT',
                            sourceType: 'ORDER',
                            sourceId: newOrder.id,
                            balanceAfter: newSupplierBalance,
                            status: 'COMPLETED',
                        },
                    });
                }
            }

            // Add to creator wallets (5% commission)
            for (const [creatorId, amount] of creatorPayments.entries()) {
                const creatorWallet = await prisma.wallet.findUnique({
                    where: { userId: creatorId }
                });

                if (creatorWallet) {
                    const newCreatorBalance = Number(creatorWallet.balance) + amount;
                    await prisma.wallet.update({
                        where: { userId: creatorId },
                        data: { balance: newCreatorBalance },
                    });

                    // Create creator transaction
                    await prisma.transaction.create({
                        data: {
                            walletId: creatorWallet.id,
                            amount: amount,
                            type: 'CREDIT',
                            sourceType: 'COMMISSION',
                            sourceId: newOrder.id,
                            balanceAfter: newCreatorBalance,
                            status: 'COMPLETED',
                        },
                    });
                }
            }

            return newOrder;
        });

        return {
            success: true,
            message: 'Order created successfully. Payment processed.',
            data: {
                ...order,
                userWalletBalance: currentBalance - totalPrice,
                paymentSummary: {
                    total: totalPrice,
                    suppliers: Array.from(supplierPayments.entries()).map(([id, amount]) => ({
                        supplierId: id,
                        amount: amount,
                        percentage: 95
                    })),
                    creators: Array.from(creatorPayments.entries()).map(([id, amount]) => ({
                        creatorId: id,
                        amount: amount,
                        percentage: 5
                    }))
                }
            },
        };
    }


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
