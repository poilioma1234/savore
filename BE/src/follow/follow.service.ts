import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
    constructor(private prisma: PrismaService) { }

    /**
     * Toggle follow/unfollow
     * If follow exists -> delete (unfollow)
     * If not exists -> create (follow)
     */
    async toggleFollow(followerId: number, followingId: number) {
        // Check if already following
        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (existingFollow) {
            // Unfollow
            await this.prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            });

            return {
                success: true,
                message: 'Unfollowed successfully',
                isFollowing: false
            };
        } else {
            // Follow
            await this.prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            });

            return {
                success: true,
                message: 'Followed successfully',
                isFollowing: true
            };
        }
    }

    /**
     * Check if user A is following user B
     */
    async checkFollowing(followerId: number, followingId: number) {
        const follow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        return {
            success: true,
            isFollowing: !!follow
        };
    }
}
