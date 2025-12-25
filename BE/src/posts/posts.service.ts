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
    async findAll(page: number = 1, limit: number = 10, tagId?: number) {
        const skip = (page - 1) * limit;

        // Build where clause - filter by tagId if provided
        const where = tagId ? { tagIds: { has: tagId } } : {};

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

    /**
     * Get posts by user ID with sorting
     * @param userId - ID of the user
     * @param sortType - 1: newest, 2: most viewed, 3: most liked, 4: highest rated
     */
    async findByUserId(userId: number, sortType: number = 1, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        let orderBy: any = { createdAt: 'desc' }; // Default: newest

        switch (sortType) {
            case 2:
                orderBy = { view: 'desc' };
                break;
            case 3:
                // Sort by like count (using Like model)
                orderBy = { likes: { _count: 'desc' } };
                break;
            case 4:
                orderBy = { rating: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatar: true,
                        },
                    },
                    recipeItems: {
                        include: {
                            ingredient: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                            likes: true,
                        }
                    }
                },
                orderBy,
            }),
            this.prisma.post.count({ where: { userId } }),
        ]);

        return {
            success: true,
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                sortType,
            },
        };
    }

    /**
     * Get a random post with weighted selection (prioritize rating > like > view)
     */
    async getRandom() {
        // Get all posts with their metrics and like counts
        const posts = await this.prisma.post.findMany({
            select: {
                id: true,
                rating: true,
                view: true,
                _count: {
                    select: {
                        likes: true,
                    }
                }
            },
        });

        if (posts.length === 0) {
            throw new NotFoundException('No posts available');
        }

        // Calculate weights (rating * 3 + likes * 2 + view)
        const weightedPosts = posts.map(post => ({
            id: post.id,
            weight: Number(post.rating) * 3 + post._count.likes * 2 + post.view,
        }));

        // Calculate total weight
        const totalWeight = weightedPosts.reduce((sum, post) => sum + post.weight, 0);

        // If all weights are 0, pick random
        let selectedId: string;
        if (totalWeight === 0) {
            selectedId = posts[Math.floor(Math.random() * posts.length)].id;
        } else {
            // Weighted random selection
            let random = Math.random() * totalWeight;
            selectedId = weightedPosts[0].id;

            for (const post of weightedPosts) {
                random -= post.weight;
                if (random <= 0) {
                    selectedId = post.id;
                    break;
                }
            }
        }

        // Increment view count
        await this.incrementView(selectedId);

        // Return full post data
        return this.findOne(selectedId);
    }

    /**
     * Increment view count for a post
     */
    async incrementView(id: string) {
        await this.prisma.post.update({
            where: { id },
            data: {
                view: {
                    increment: 1,
                },
            },
        });
    }
}

