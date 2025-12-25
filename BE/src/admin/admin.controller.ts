import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth('JWT-auth')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    @ApiOperation({ summary: 'Get all users with pagination and filters (ADMIN only)' })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Số trang' })
    @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Số lượng items mỗi trang' })
    @ApiQuery({ name: 'search', required: false, example: 'john@example.com', description: 'Tìm kiếm theo email hoặc tên' })
    @ApiQuery({ name: 'role', required: false, example: 'SUPPLIER', description: 'Lọc theo role' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
    getAllUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('role') role?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.adminService.getAllUsers(pageNum, limitNum, search, role);
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Get user by ID (ADMIN only)' })
    @ApiParam({ name: 'id', example: 1, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.getUserById(id);
    }

    @Post('users/:id/roles')
    @ApiOperation({ summary: 'Assign role to user (ADMIN only)' })
    @ApiParam({ name: 'id', example: 1, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Role assigned successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
    assignRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() assignRoleDto: AssignRoleDto,
    ) {
        return this.adminService.assignRole(id, assignRoleDto);
    }

    @Delete('users/:id/roles/:roleId')
    @ApiOperation({ summary: 'Remove role from user (ADMIN only)' })
    @ApiParam({ name: 'id', example: 1, description: 'User ID' })
    @ApiParam({ name: 'roleId', example: 2, description: 'Role ID to remove' })
    @ApiResponse({ status: 200, description: 'Role removed successfully' })
    @ApiResponse({ status: 404, description: 'User or role not found' })
    @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
    removeRole(
        @Param('id', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number,
    ) {
        return this.adminService.removeRole(userId, roleId);
    }

    @Put('users/:id/roles')
    @ApiOperation({
        summary: 'Update user roles (ADMIN only) - EASIER METHOD',
        description: 'Thay thế tất cả roles của user bằng array roles mới. Đơn giản hơn nhiều!'
    })
    @ApiParam({ name: 'id', example: 3, description: 'User ID' })
    @ApiResponse({
        status: 200,
        description: 'Roles updated successfully',
        schema: {
            example: {
                message: 'Roles updated successfully',
                roles: ['CREATOR', 'USER']
            }
        }
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    updateUserRoles(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { roles: string[] },
    ) {
        return this.adminService.updateUserRoles(id, body.roles);
    }

    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get dashboard statistics (ADMIN only)' })
    @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - ADMIN role required' })
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
}
