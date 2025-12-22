import {
    Controller,
    Get,
    Post,
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

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
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
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.getUserById(id);
    }

    @Post('users/:id/roles')
    assignRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() assignRoleDto: AssignRoleDto,
    ) {
        return this.adminService.assignRole(id, assignRoleDto);
    }

    @Delete('users/:id/roles/:roleId')
    removeRole(
        @Param('id', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number,
    ) {
        return this.adminService.removeRole(userId, roleId);
    }

    @Get('dashboard/stats')
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
}
