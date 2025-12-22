/**
 * SAVORE PLATFORM - PRISMA CLIENT EXAMPLES
 * 
 * File này chứa các ví dụ về cách sử dụng Prisma Client
 * để thao tác với database trong NestJS application
 */

import { PrismaClient } from './src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

// Khởi tạo Prisma Client với PostgreSQL adapter (Prisma 7 requirement)
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ================================================
// 1. USER MANAGEMENT
// ================================================

/**
 * Tạo user mới với role
 */
async function createUserWithRole(
    email: string,
    password: string,
    fullName: string,
    roleCode: 'ADMIN' | 'CREATOR' | 'USER' | 'SUPPLIER'
) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tìm role
    const role = await prisma.role.findUnique({
        where: { code: roleCode },
    });

    if (!role) {
        throw new Error(`Role ${roleCode} not found`);
    }

    // Tạo user với role và wallet trong một transaction
    const user = await prisma.$transaction(async (tx) => {
        // Tạo user
        const newUser = await tx.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName,
            },
        });

        // Gán role
        await tx.userRole.create({
            data: {
                userId: newUser.id,
                roleId: role.id,
            },
        });

        // Tạo wallet
        await tx.wallet.create({
            data: {
                userId: newUser.id,
                balance: 0,
                currency: 'VND',
            },
        });

        return newUser;
    });

    return user;
}

/**
 * Lấy user với tất cả thông tin liên quan
 */
async function getUserWithDetails(userId: number) {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userRoles: {
                include: {
                    role: true,
                },
            },
            wallet: true,
            products: {
                where: { status: 'ACTIVE' },
            },
            posts: {
                where: { status: 'PUBLISHED' },
            },
        },
    });
}

/**
 * Cập nhật thông tin user
 */
async function updateUser(userId: number, data: { fullName?: string; email?: string }) {
    return await prisma.user.update({
        where: { id: userId },
        data,
    });
}

// ================================================
// 2. PRODUCT MANAGEMENT
// ================================================

/**
 * Tạo sản phẩm mới
 */
async function createProduct(
    supplierId: number,
    name: string,
    price: number
) {
    return await prisma.product.create({
        data: {
            supplierId,
            name,
            price,
            status: 'ACTIVE',
        },
    });
}

/**
 * Lấy tất cả sản phẩm của supplier
 */
async function getSupplierProducts(supplierId: number) {
    return await prisma.product.findMany({
        where: { supplierId },
        include: {
            supplier: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

/**
 * Cập nhật giá sản phẩm
 */
async function updateProductPrice(productId: number, newPrice: number) {
    return await prisma.product.update({
        where: { id: productId },
        data: { price: newPrice },
    });
}

// ================================================
// 3. POSTS & CONTENT
// ================================================

/**
 * Tạo post với ingredients
 */
async function createPostWithIngredients(
    creatorId: number,
    title: string,
    videoUrl: string,
    ingredients: Array<{ productId: number; quantityNeeded: number }>
) {
    return await prisma.$transaction(async (tx) => {
        // Tạo post
        const post = await tx.post.create({
            data: {
                creatorId,
                title,
                videoUrl,
                status: 'DRAFT',
            },
        });

        // Thêm ingredients
        await tx.recipeIngredient.createMany({
            data: ingredients.map((ing) => ({
                postId: post.id,
                productId: ing.productId,
                quantityNeeded: ing.quantityNeeded,
            })),
        });

        return post;
    });
}

/**
 * Publish post
 */
async function publishPost(postId: number) {
    return await prisma.post.update({
        where: { id: postId },
        data: { status: 'PUBLISHED' },
    });
}

/**
 * Lấy post với tất cả ingredients
 */
async function getPostWithIngredients(postId: number) {
    return await prisma.post.findUnique({
        where: { id: postId },
        include: {
            creator: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                },
            },
            recipeIngredients: {
                include: {
                    product: true,
                },
            },
        },
    });
}

// ================================================
// 4. ORDER PROCESSING
// ================================================

/**
 * Tạo đơn hàng với items
 */
async function createOrder(
    userId: number,
    items: Array<{
        productId: number;
        quantity: number;
        sourcePostId?: number;
    }>
) {
    return await prisma.$transaction(async (tx) => {
        // Lấy thông tin products
        const products = await tx.product.findMany({
            where: {
                id: { in: items.map((item) => item.productId) },
            },
        });

        // Tính tổng giá
        let totalPrice = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            const itemTotal = Number(product.price) * item.quantity;
            totalPrice += itemTotal;

            // Tính commission (giả sử 10% nếu có sourcePostId)
            const commissionRate = item.sourcePostId ? 10 : 0;
            const commissionAmount = (itemTotal * commissionRate) / 100;
            const supplierAmount = itemTotal - commissionAmount;

            // Lấy creator từ post nếu có
            let creatorId = null;
            if (item.sourcePostId) {
                const post = await tx.post.findUnique({
                    where: { id: item.sourcePostId },
                });
                creatorId = post?.creatorId;
            }

            orderItemsData.push({
                productId: product.id,
                supplierId: product.supplierId,
                creatorId,
                sourcePostId: item.sourcePostId,
                productNameAtPurchase: product.name,
                priceAtPurchase: product.price,
                quantity: item.quantity,
                commissionRate: commissionRate > 0 ? commissionRate : null,
                commissionAmount: commissionAmount > 0 ? commissionAmount : null,
                supplierAmount,
            });
        }

        // Tạo order
        const order = await tx.order.create({
            data: {
                userId,
                totalPrice,
                status: 'PENDING',
            },
        });

        // Tạo order items
        const orderItems = await Promise.all(
            orderItemsData.map((itemData) =>
                tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        ...itemData,
                    },
                })
            )
        );

        // Tạo commissions cho các items có creator
        for (const orderItem of orderItems) {
            if (orderItem.creatorId && orderItem.commissionAmount) {
                await tx.commission.create({
                    data: {
                        orderItemId: orderItem.id,
                        creatorId: orderItem.creatorId,
                        amount: orderItem.commissionAmount,
                        status: 'PENDING',
                    },
                });
            }
        }

        return { order, orderItems };
    });
}

/**
 * Thanh toán đơn hàng
 */
async function payOrder(orderId: number) {
    return await prisma.$transaction(async (tx) => {
        // Cập nhật trạng thái order
        const order = await tx.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
            include: {
                orderItems: true,
            },
        });

        // Cộng tiền vào ví của suppliers
        for (const item of order.orderItems) {
            const wallet = await tx.wallet.findUnique({
                where: { userId: item.supplierId },
            });

            if (wallet) {
                const newBalance = Number(wallet.balance) + Number(item.supplierAmount);

                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: { balance: newBalance },
                });

                // Tạo transaction record
                await tx.transaction.create({
                    data: {
                        walletId: wallet.id,
                        amount: item.supplierAmount,
                        type: 'CREDIT',
                        sourceType: 'ORDER',
                        sourceId: order.id,
                        balanceAfter: newBalance,
                        status: 'COMPLETED',
                    },
                });
            }
        }

        return order;
    });
}

/**
 * Lấy chi tiết đơn hàng
 */
async function getOrderDetails(orderId: number) {
    return await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                },
            },
            orderItems: {
                include: {
                    product: true,
                    supplier: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                    creator: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                    sourcePost: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            },
        },
    });
}

// ================================================
// 5. COMMISSION MANAGEMENT
// ================================================

/**
 * Thanh toán hoa hồng cho creator
 */
async function payCommission(commissionId: number) {
    return await prisma.$transaction(async (tx) => {
        const commission = await tx.commission.findUnique({
            where: { id: commissionId },
        });

        if (!commission) {
            throw new Error('Commission not found');
        }

        if (commission.status === 'PAID') {
            throw new Error('Commission already paid');
        }

        // Lấy wallet của creator
        const wallet = await tx.wallet.findUnique({
            where: { userId: commission.creatorId },
        });

        if (!wallet) {
            throw new Error('Creator wallet not found');
        }

        // Cộng tiền vào ví
        const newBalance = Number(wallet.balance) + Number(commission.amount);

        await tx.wallet.update({
            where: { id: wallet.id },
            data: { balance: newBalance },
        });

        // Tạo transaction record
        await tx.transaction.create({
            data: {
                walletId: wallet.id,
                amount: commission.amount,
                type: 'CREDIT',
                sourceType: 'COMMISSION',
                sourceId: commission.id,
                balanceAfter: newBalance,
                status: 'COMPLETED',
            },
        });

        // Cập nhật trạng thái commission
        return await tx.commission.update({
            where: { id: commissionId },
            data: { status: 'PAID' },
        });
    });
}

/**
 * Lấy tất cả commissions chưa thanh toán của creator
 */
async function getPendingCommissions(creatorId: number) {
    return await prisma.commission.findMany({
        where: {
            creatorId,
            status: 'PENDING',
        },
        include: {
            orderItem: {
                include: {
                    order: true,
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

// ================================================
// 6. ANALYTICS
// ================================================

/**
 * Thống kê doanh thu theo supplier
 */
async function getSupplierRevenue(supplierId: number) {
    const result = await prisma.orderItem.aggregate({
        where: {
            supplierId,
            order: {
                status: { in: ['PAID', 'COMPLETED'] },
            },
        },
        _sum: {
            supplierAmount: true,
        },
        _count: {
            id: true,
        },
    });

    return {
        totalRevenue: result._sum.supplierAmount || 0,
        totalOrders: result._count.id,
    };
}

/**
 * Thống kê hoa hồng theo creator
 */
async function getCreatorCommissionStats(creatorId: number) {
    const [pending, paid] = await Promise.all([
        prisma.commission.aggregate({
            where: {
                creatorId,
                status: 'PENDING',
            },
            _sum: { amount: true },
            _count: { id: true },
        }),
        prisma.commission.aggregate({
            where: {
                creatorId,
                status: 'PAID',
            },
            _sum: { amount: true },
            _count: { id: true },
        }),
    ]);

    return {
        pending: {
            amount: pending._sum.amount || 0,
            count: pending._count.id,
        },
        paid: {
            amount: paid._sum.amount || 0,
            count: paid._count.id,
        },
        total: {
            amount: Number(pending._sum.amount || 0) + Number(paid._sum.amount || 0),
            count: pending._count.id + paid._count.id,
        },
    };
}

/**
 * Top selling products
 */
async function getTopSellingProducts(limit: number = 10) {
    const products = await prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
            order: {
                status: { in: ['PAID', 'COMPLETED'] },
            },
        },
        _sum: {
            quantity: true,
        },
        _count: {
            id: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: limit,
    });

    // Lấy thông tin chi tiết của products
    const productDetails = await prisma.product.findMany({
        where: {
            id: { in: products.map((p) => p.productId) },
        },
        include: {
            supplier: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
        },
    });

    return products.map((p) => {
        const product = productDetails.find((pd) => pd.id === p.productId);
        return {
            product,
            totalQuantitySold: p._sum.quantity || 0,
            totalOrders: p._count.id,
        };
    });
}

// ================================================
// EXAMPLE USAGE
// ================================================

async function main() {
    try {
        console.log('🚀 Prisma Client Examples\n');

        // Example 1: Create a new creator
        console.log('1. Creating a new creator...');
        const creator = await createUserWithRole(
            'creator@example.com',
            'password123',
            'John Creator',
            'CREATOR'
        );
        console.log('✅ Creator created:', creator.email);

        // Example 2: Create a product
        console.log('\n2. Creating a product...');
        const supplier = await prisma.user.findFirst({
            where: {
                userRoles: {
                    some: {
                        role: { code: 'SUPPLIER' },
                    },
                },
            },
        });

        if (supplier) {
            const product = await createProduct(
                supplier.id,
                'Organic Tomatoes',
                25000
            );
            console.log('✅ Product created:', product.name);
        }

        // Example 3: Get user with details
        console.log('\n3. Getting user details...');
        const userDetails = await getUserWithDetails(creator.id);
        console.log('✅ User details:', JSON.stringify(userDetails, null, 2));

        console.log('\n✨ Examples completed successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Uncomment to run examples
// main();

// Export functions for use in your application
export {
    createUserWithRole,
    getUserWithDetails,
    updateUser,
    createProduct,
    getSupplierProducts,
    updateProductPrice,
    createPostWithIngredients,
    publishPost,
    getPostWithIngredients,
    createOrder,
    payOrder,
    getOrderDetails,
    payCommission,
    getPendingCommissions,
    getSupplierRevenue,
    getCreatorCommissionStats,
    getTopSellingProducts,
};
