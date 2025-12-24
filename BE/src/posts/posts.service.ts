import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(createPostDto: CreatePostDto, userId: number) {
        const { recipeItems, ...postData } = createPostDto;

        return this.prisma.post.create({
            data: {
                ...postData,
                userId, // Automatically use logged-in user's ID
                recipeItems: {
                    create: recipeItems.map((item) => ({
                        ingredientId: item.ingredientId,
                        quantity: item.quantity,
                        unit: item.unit,
                    })),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                recipeItems: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
    }

    // API 1: Get list posts với search theo tag (YÊU CẦU MENTOR)
    async findAll(page: number = 1, limit: number = 10, tag?: string) {
        const skip = (page - 1) * limit;

        const where = tag ? { tagVideo: tag } : {};

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                        },
                    },
                    recipeItems: {
                        include: {
                            ingredient: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // API 2: Get post by ID (YÊU CẦU MENTOR)
    async findOne(id: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                recipeItems: {
                    include: {
                        ingredient: {
                            include: {
                                provider: {
                                    select: {
                                        id: true,
                                        email: true,
                                        fullName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDto, userId: number) {
        const post = await this.findOne(id);

        // Check if user is the creator
        if (post.userId !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        const { recipeItems, ...postData } = updatePostDto;

        // If recipeItems are provided, delete old ones and create new ones
        if (recipeItems) {
            await this.prisma.recipeItem.deleteMany({
                where: { postId: id },
            });
        }

        return this.prisma.post.update({
            where: { id },
            data: {
                ...postData,
                ...(recipeItems && {
                    recipeItems: {
                        create: recipeItems.map((item) => ({
                            ingredientId: item.ingredientId,
                            quantity: item.quantity,
                            unit: item.unit,
                        })),
                    },
                }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                recipeItems: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
    }

    async remove(id: string, userId: number) {
        const post = await this.findOne(id);

        // Check if user is the creator
        if (post.userId !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        return this.prisma.post.delete({
            where: { id },
        });
    }

    /**
     * API ĐẶC BIỆT THEO YÊU CẦU MENTOR:
     * - Nhận list ID của các bài đăng
     * - Lấy dữ liệu công thức của các bài đăng đó
     * - Nhóm các loại nguyên liệu cùng ID với nhau
     * - Cộng dồn số lượng
     * - Trả về list nguyên liệu dạng object "tên nguyên liệu + tổng số lượng"
     */
    async calculateIngredients(postIds: string[]) {
        // Lấy tất cả recipe items từ các posts
        const recipeItems = await this.prisma.recipeItem.findMany({
            where: {
                postId: {
                    in: postIds,
                },
            },
            include: {
                ingredient: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                email: true,
                                fullName: true,
                                address: true,
                                latitude: true,
                                longitude: true,
                            },
                        },
                    },
                },
                post: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        // Nhóm theo ingredientId và cộng dồn số lượng
        const ingredientMap = new Map<string, {
            ingredientId: string;
            ingredientName: string;
            tag: string;
            totalQuantity: number;
            unit: string;
            provider: any;
            usedInPosts: Array<{ postId: string; postName: string; quantity: number }>;
        }>();

        for (const item of recipeItems) {
            const key = item.ingredientId;

            if (ingredientMap.has(key)) {
                const existing = ingredientMap.get(key)!;
                existing.totalQuantity += Number(item.quantity);
                existing.usedInPosts.push({
                    postId: item.post.id,
                    postName: item.post.name,
                    quantity: Number(item.quantity),
                });
            } else {
                ingredientMap.set(key, {
                    ingredientId: item.ingredient.id,
                    ingredientName: item.ingredient.name,
                    tag: item.ingredient.tag,
                    totalQuantity: Number(item.quantity),
                    unit: item.unit || 'gram',
                    provider: item.ingredient.provider,
                    usedInPosts: [{
                        postId: item.post.id,
                        postName: item.post.name,
                        quantity: Number(item.quantity),
                    }],
                });
            }
        }

        // Convert Map to Array
        const aggregatedIngredients = Array.from(ingredientMap.values()).map(item => ({
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName,
            tag: item.tag,
            totalQuantity: item.totalQuantity,
            unit: item.unit,
            provider: item.provider,
            usedInPosts: item.usedInPosts,
        }));

        return {
            postIds,
            totalPosts: postIds.length,
            totalIngredients: aggregatedIngredients.length,
            ingredients: aggregatedIngredients,
        };
    }
}

