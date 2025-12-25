import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                passwordHash: hashedPassword,
                fullName: registerDto.fullName,
                address: registerDto.address,
                latitude: registerDto.latitude,
                longitude: registerDto.longitude,
            },
        });

        // Get role
        const role = await this.prisma.role.findUnique({
            where: { code: registerDto.role },
        });

        if (!role) {
            throw new Error('Role not found');
        }

        // Assign role to user
        await this.prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: role.id,
            },
        });

        // Create wallet for user
        await this.prisma.wallet.create({
            data: {
                userId: user.id,
                balance: 0,
                currency: 'VND',
            },
        });

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            roles: [registerDto.role],
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                roles: [registerDto.role],
            },
        };
    }

    async login(loginDto: LoginDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Extract roles
        const roles = user.userRoles.map((ur) => ur.role.code);

        // Generate JWT token
        const payload = {
            sub: user.id,
            email: user.email,
            roles,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                roles,
            },
        };
    }

    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                wallet: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const roles = user.userRoles.map((ur) => ur.role.code);

        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            address: user.address,
            latitude: user.latitude,
            longitude: user.longitude,
            roles,
            wallet: user.wallet,
            createdAt: user.createdAt,
        };
    }

    // ==================== YÊU CẦU MENTOR: UPDATE PROFILE API ====================
    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        // DEBUG: Log incoming data
        console.log('📥 Received updateProfileDto:', updateProfileDto);

        // Build update data object - only include fields that are provided
        const updateData: any = {};

        if (updateProfileDto.fullName !== undefined) {
            updateData.fullName = updateProfileDto.fullName;
        }
        if (updateProfileDto.address !== undefined) {
            updateData.address = updateProfileDto.address;
        }
        if (updateProfileDto.latitude !== undefined) {
            updateData.latitude = updateProfileDto.latitude;
        }
        if (updateProfileDto.longitude !== undefined) {
            updateData.longitude = updateProfileDto.longitude;
        }

        // DEBUG: Log what will be updated
        console.log('🔄 Update data to be sent to Prisma:', updateData);

        // Update user
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                wallet: true,
            },
        });

        const roles = updatedUser.userRoles.map((ur) => ur.role.code);

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            address: updatedUser.address,
            latitude: updatedUser.latitude,
            longitude: updatedUser.longitude,
            roles,
            wallet: updatedUser.wallet,
            createdAt: updatedUser.createdAt,
        };
    }
}

