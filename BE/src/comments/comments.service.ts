import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(createCommentDto: CreateCommentDto, userId: number) {
        const { postId, description, images, isRatingComment, rating } = createCommentDto;

        // Verify post exists
        const post = await this.prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Validate rating for rating comments
        if (isRatingComment) {
            if (!rating) {
                throw new ForbiddenException('Rating is required for rating comments');
            }

            // Verify user has ordered from this post
            const hasOrdered = await this.prisma.orderItem.findFirst({
                where: {
                    sourcePostId: postId,
                    order: {
                        userId: userId
                    }
                }
            });

            if (!hasOrdered) {
                throw new ForbiddenException('Only users who have ordered from this post can leave rating comments');
            }
        }

        const comment = await this.prisma.comment.create({
            data: {
                postId,
                userId,
                description,
                images: images || [],
                isRatingComment: isRatingComment || false,
                rating: rating || null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            }
        });

        // Update post rating if this is a rating comment
        if (isRatingComment && rating) {
            await this.updatePostRating(postId);
        }

        return {
            success: true,
            message: 'Comment created successfully',
            data: comment
        };
    }

    /**
     * Calculate and update post rating based on all rating comments
     */
    private async updatePostRating(postId: string) {
        const ratingComments = await this.prisma.comment.findMany({
            where: {
                postId,
                isRatingComment: true,
                rating: { not: null }
            },
            select: {
                rating: true
            }
        });

        if (ratingComments.length === 0) {
            return;
        }

        // Calculate average rating
        const totalRating = ratingComments.reduce((sum, comment) => {
            return sum + Number(comment.rating);
        }, 0);

        const averageRating = totalRating / ratingComments.length;

        // Update post rating
        await this.prisma.post.update({
            where: { id: postId },
            data: {
                rating: averageRating
            }
        });
    }

    async findAllByPost(postId: string, isRatingComment: boolean = false) {
        const comments = await this.prisma.comment.findMany({
            where: {
                postId,
                isRatingComment
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            success: true,
            data: comments,
            total: comments.length
        };
    }

    async findOne(id: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        return {
            success: true,
            data: comment
        };
    }

    async update(id: string, updateCommentDto: UpdateCommentDto, userId: number) {
        const comment = await this.prisma.comment.findUnique({
            where: { id }
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only update your own comments');
        }

        const updatedComment = await this.prisma.comment.update({
            where: { id },
            data: updateCommentDto,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true
                    }
                }
            }
        });

        return {
            success: true,
            message: 'Comment updated successfully',
            data: updatedComment
        };
    }

    async remove(id: string, userId: number) {
        const comment = await this.prisma.comment.findUnique({
            where: { id }
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.prisma.comment.delete({
            where: { id }
        });

        return {
            success: true,
            message: 'Comment deleted successfully'
        };
    }
}
