import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
    constructor(private prisma: PrismaService) { }

    async create(createIngredientDto: CreateIngredientDto) {
        return this.prisma.ingredient.create({
            data: createIngredientDto,
            include: {
                provider: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    // ==================== YÊU CẦU MENTOR #4: FILTER BY PROVIDER ID ====================
    async findAll(page: number = 1, limit: number = 10, tag?: string, providerId?: number) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (tag) where.tag = tag;
        if (providerId) where.providerId = providerId; // ← FILTER THEO PROVIDER ID

        const [ingredients, total] = await Promise.all([
            this.prisma.ingredient.findMany({
                where,
                skip,
                take: limit,
                include: {
                    provider: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                            address: true,      // ← Thêm address
                            latitude: true,     // ← Thêm GPS
                            longitude: true,    // ← Thêm GPS
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.ingredient.count({ where }),
        ]);

        return {
            data: ingredients,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const ingredient = await this.prisma.ingredient.findUnique({
            where: { id },
            include: {
                provider: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        address: true,
                        latitude: true,
                        longitude: true,
                    },
                },
            },
        });

        if (!ingredient) {
            throw new NotFoundException(`Ingredient with ID ${id} not found`);
        }

        return ingredient;
    }

    async update(id: string, updateIngredientDto: UpdateIngredientDto, userId: number) {
        const ingredient = await this.findOne(id);

        // Check if user is the provider
        if (ingredient.providerId !== userId) {
            throw new ForbiddenException('You can only update your own ingredients');
        }

        return this.prisma.ingredient.update({
            where: { id },
            data: updateIngredientDto,
            include: {
                provider: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    async remove(id: string, userId: number) {
        const ingredient = await this.findOne(id);

        // Check if user is the provider
        if (ingredient.providerId !== userId) {
            throw new ForbiddenException('You can only delete your own ingredients');
        }

        return this.prisma.ingredient.delete({
            where: { id },
        });
    }
}
