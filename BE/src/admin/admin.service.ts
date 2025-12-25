import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getAllUsers(page: number = 1, limit: number = 10, search?: string, role?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.userRoles = {
                some: {
                    role: {
                        code: role,
                    },
                },
            };
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                include: {
                    userRoles: {
                        include: {
                            role: true,
                        },
                    },
                    wallet: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        const formattedUsers = users.map((user) => ({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: user.userRoles.map((ur) => ur.role.code),
            wallet: user.wallet,
            createdAt: user.createdAt,
        }));

        return {
            data: formattedUsers,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                wallet: true,
                posts: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
                ingredients: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: user.userRoles.map((ur) => ur.role.code),
            wallet: user.wallet,
            recentPosts: user.posts,
            recentIngredients: user.ingredients,
            createdAt: user.createdAt,
        };
    }

    async assignRole(userId: number, assignRoleDto: AssignRoleDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const role = await this.prisma.role.findUnique({
            where: { code: assignRoleDto.roleCode },
        });

        if (!role) {
            throw new NotFoundException(`Role ${assignRoleDto.roleCode} not found`);
        }

        // Check if user already has this role
        const existingUserRole = await this.prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId,
                    roleId: role.id,
                },
            },
        });

        if (existingUserRole) {
            throw new ConflictException('User already has this role');
        }

        await this.prisma.userRole.create({
            data: {
                userId,
                roleId: role.id,
            },
        });

        return { message: `Role ${assignRoleDto.roleCode} assigned successfully` };
    }

    async removeRole(userId: number, roleId: number) {
        const userRole = await this.prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
        });

        if (!userRole) {
            throw new NotFoundException('User does not have this role');
        }

        await this.prisma.userRole.delete({
            where: {
                userId_roleId: {
                    userId,
                    roleId,
                },
            },
        });

        return { message: 'Role removed successfully' };
    }

    async getDashboardStats() {
        const [
            totalUsers,
            totalPosts,
            totalIngredients,
            usersByRole,
            recentUsers,
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.post.count(),
            this.prisma.ingredient.count(),
            this.prisma.role.findMany({
                include: {
                    _count: {
                        select: { userRoles: true },
                    },
                },
            }),
            this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    userRoles: {
                        include: {
                            role: true,
                        },
                    },
                },
            }),
        ]);

        const roleStats = usersByRole.map((role) => ({
            role: role.code,
            count: role._count.userRoles,
        }));

        return {
            totalUsers,
            totalPosts,
            totalIngredients,
            roleStats,
            recentUsers: recentUsers.map((user) => ({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                roles: user.userRoles.map((ur) => ur.role.code),
                createdAt: user.createdAt,
            })),
        };
    }

    /**
     * Update user roles (simpler method)
     * Replace all roles with new array
     */
    async updateUserRoles(userId: number, roleCodes: string[]) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // Validate all roles exist
        const roles = await this.prisma.role.findMany({
            where: {
                code: { in: roleCodes },
            },
        });

        if (roles.length !== roleCodes.length) {
            const foundCodes = roles.map(r => r.code);
            const missing = roleCodes.filter(code => !foundCodes.includes(code));
            throw new NotFoundException(`Roles not found: ${missing.join(', ')}`);
        }

        // Delete all existing roles
        await this.prisma.userRole.deleteMany({
            where: { userId },
        });

        // Create new roles
        await this.prisma.userRole.createMany({
            data: roles.map(role => ({
                userId,
                roleId: role.id,
            })),
        });

        return {
            message: 'Roles updated successfully',
            roles: roleCodes,
        };
    }
}
