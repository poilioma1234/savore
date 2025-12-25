import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                description: true,
                avatar: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            success: true,
            data: {
                ...user,
                followersCount: user._count.followers,
                followingCount: user._count.following,
                postsCount: user._count.posts,
            }
        };
    }

    async getUserPosts(userId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

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
            this.prisma.post.count({ where: { userId } })
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

    async updateProfile(userId: number, updateData: { description?: string; avatar?: string; fullName?: string }) {
        const updatePayload: any = {};

        if (updateData.description !== undefined) {
            updatePayload.description = updateData.description;
        }
        if (updateData.avatar !== undefined) {
            updatePayload.avatar = updateData.avatar;
        }
        if (updateData.fullName !== undefined) {
            updatePayload.fullName = updateData.fullName;
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updatePayload,
            select: {
                id: true,
                fullName: true,
                description: true,
                avatar: true,
            }
        });

        return {
            success: true,
            message: 'Profile updated successfully',
            data: user
        };
    }

    /**
     * Get followers of a user
     */
    async getFollowers(userId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [followers, total] = await Promise.all([
            this.prisma.follow.findMany({
                where: { followingId: userId },
                skip,
                take: limit,
                include: {
                    follower: {
                        select: {
                            id: true,
                            fullName: true,
                            avatar: true,
                            description: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.follow.count({ where: { followingId: userId } })
        ]);

        return {
            success: true,
            data: followers.map(f => f.follower),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    /**
     * Get users that a user is following
     */
    async getFollowing(userId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [following, total] = await Promise.all([
            this.prisma.follow.findMany({
                where: { followerId: userId },
                skip,
                take: limit,
                include: {
                    following: {
                        select: {
                            id: true,
                            fullName: true,
                            avatar: true,
                            description: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.follow.count({ where: { followerId: userId } })
        ]);

        return {
            success: true,
            data: following.map(f => f.following),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }
}
