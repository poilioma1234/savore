import { Controller, Post, Body } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    @Post()
    @ApiOperation({
        summary: 'Toggle follow/unfollow (Public)',
        description: 'If already following -> unfollow. If not following -> follow.'
    })
    @ApiResponse({
        status: 200,
        description: 'Follow toggled successfully',
        schema: {
            example: {
                success: true,
                message: 'Followed successfully',
                isFollowing: true
            }
        }
    })
    toggleFollow(@Body() body: { followerId: number; followingId: number }) {
        return this.followService.toggleFollow(body.followerId, body.followingId);
    }
}
