import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
            access_token: this.jwtService.sign(payload),
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
            access_token: this.jwtService.sign(payload),
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
            roles,
            wallet: user.wallet,
            createdAt: user.createdAt,
        };
    }
}
