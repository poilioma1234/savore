import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(supplierId: number, createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                supplierId,
            },
            include: {
                supplier: {
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
    }

    async findAll(page: number = 1, limit: number = 10, supplierId?: number, status?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (supplierId) where.supplierId = supplierId;
        if (status) where.status = status;

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    supplier: {
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
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                supplier: {
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

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async update(id: number, userId: number, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);

        if (product.supplierId !== userId) {
            throw new ForbiddenException('You can only update your own products');
        }

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                supplier: {
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
    }

    async remove(id: number, userId: number) {
        const product = await this.findOne(id);

        if (product.supplierId !== userId) {
            throw new ForbiddenException('You can only delete your own products');
        }

        return this.prisma.product.delete({
            where: { id },
        });
    }

    async getMyProducts(userId: number, page: number = 1, limit: number = 10) {
        return this.findAll(page, limit, userId);
    }
}
