import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) { }

  /**
   * Toggle like/unlike a post
   * If like exists -> delete (unlike)
   * If not exists -> create (like)
   */
  async toggleLike(userId: number, postId: string) {
    // Check if already liked
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });

      return {
        success: true,
        message: 'Post unliked successfully',
        isLiked: false
      };
    } else {
      // Like
      await this.prisma.like.create({
        data: {
          userId,
          postId
        }
      });

      return {
        success: true,
        message: 'Post liked successfully',
        isLiked: true
      };
    }
  }

  /**
   * Get all posts liked by a user (for ordering)
   */
  async getLikedPostsByUser(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.prisma.like.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          post: {
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
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.like.count({ where: { userId } })
    ]);

    return {
      success: true,
      data: likes.map(like => like.post),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Get like count for a post
   */
  async getLikeCount(postId: string) {
    const count = await this.prisma.like.count({
      where: { postId }
    });

    return {
      success: true,
      data: {
        postId,
        likeCount: count
      }
    };
  }

  /**
   * Check if user has liked a post
   */
  async checkLikeStatus(userId: number, postId: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    return {
      success: true,
      data: {
        postId,
        isLiked: !!like
      }
    };
  }
}
