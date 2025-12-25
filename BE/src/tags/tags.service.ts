import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Create a new tag
     */
    async create(name: string) {
        // Check if tag already exists
        const existing = await this.prisma.tag.findUnique({
            where: { name }
        });

        if (existing) {
            throw new ConflictException('Tag already exists');
        }

        const tag = await this.prisma.tag.create({
            data: { name }
        });

        return {
            success: true,
            message: 'Tag created successfully',
            data: tag
        };
    }

    /**
     * Get all tags
     */
    async findAll() {
        const tags = await this.prisma.tag.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return {
            success: true,
            data: tags,
            total: tags.length
        };
    }

    /**
     * Get tag by ID
     */
    async findOne(id: number) {
        const tag = await this.prisma.tag.findUnique({
            where: { id }
        });

        if (!tag) {
            throw new NotFoundException('Tag not found');
        }

        return {
            success: true,
            data: tag
        };
    }

    /**
     * Get popular tags (tags used most in posts)
     */
    async getPopularTags(limit: number = 10) {
        // Get all posts with their tagIds
        const posts = await this.prisma.post.findMany({
            select: {
                tagIds: true
            }
        });

        // Count tag occurrences
        const tagCounts = new Map<number, number>();

        for (const post of posts) {
            for (const tagId of post.tagIds) {
                tagCounts.set(tagId, (tagCounts.get(tagId) || 0) + 1);
            }
        }

        // Sort by count and get top tags
        const sortedTagIds = Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([tagId]) => tagId);

        // Get tag details
        const tags = await this.prisma.tag.findMany({
            where: {
                id: { in: sortedTagIds }
            }
        });

        // Add count to each tag
        const tagsWithCount = tags.map(tag => ({
            ...tag,
            postCount: tagCounts.get(tag.id) || 0
        }));

        // Sort by count again (since findMany doesn't preserve order)
        tagsWithCount.sort((a, b) => b.postCount - a.postCount);

        return {
            success: true,
            data: tagsWithCount
        };
    }

    /**
     * Search posts by tag IDs
     */
    async searchPostsByTags(tagIds: number[], page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where: {
                    tagIds: {
                        hasSome: tagIds
                    }
                },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatar: true,
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.post.count({
                where: {
                    tagIds: {
                        hasSome: tagIds
                    }
                }
            })
        ]);

        return {
            success: true,
            data: posts,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    /**
     * Delete a tag
     */
    async remove(id: number) {
        const tag = await this.prisma.tag.findUnique({
            where: { id }
        });

        if (!tag) {
            throw new NotFoundException('Tag not found');
        }

        await this.prisma.tag.delete({
            where: { id }
        });

        return {
            success: true,
            message: 'Tag deleted successfully'
        };
    }
}
