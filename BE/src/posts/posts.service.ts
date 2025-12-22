import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(createPostDto: CreatePostDto) {
        const { recipeItems, ...postData } = createPostDto;

        return this.prisma.post.create({
            data: {
                ...postData,
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
}
