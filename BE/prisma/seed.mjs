import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('🌱 Starting database seeding...');

        // Seed Roles
        console.log('📝 Creating roles...');
        const roles = await Promise.all([
            prisma.role.upsert({
                where: { code: 'ADMIN' },
                update: {},
                create: { code: 'ADMIN' },
            }),
            prisma.role.upsert({
                where: { code: 'CREATOR' },
                update: {},
                create: { code: 'CREATOR' },
            }),
            prisma.role.upsert({
                where: { code: 'USER' },
                update: {},
                create: { code: 'USER' },
            }),
            prisma.role.upsert({
                where: { code: 'SUPPLIER' },
                update: {},
                create: { code: 'SUPPLIER' },
            }),
        ]);

        console.log('✅ Roles created:', roles.map((r) => r.code).join(', '));

        // Seed Admin User
        console.log('👤 Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@savore.com' },
            update: {},
            create: {
                email: 'admin@savore.com',
                passwordHash: hashedPassword,
                fullName: 'System Administrator',
            },
        });

        console.log('✅ Admin user created:', adminUser.email);

        // Assign ADMIN role to admin user
        console.log('🔑 Assigning ADMIN role...');
        const adminRole = roles.find((r) => r.code === 'ADMIN');

        if (adminRole) {
            await prisma.userRole.upsert({
                where: {
                    userId_roleId: {
                        userId: adminUser.id,
                        roleId: adminRole.id,
                    },
                },
                update: {},
                create: {
                    userId: adminUser.id,
                    roleId: adminRole.id,
                },
            });
            console.log('✅ ADMIN role assigned to admin user');
        }

        // Create wallet for admin user
        console.log('💰 Creating wallet for admin user...');
        await prisma.wallet.upsert({
            where: { userId: adminUser.id },
            update: {},
            create: {
                userId: adminUser.id,
                balance: 0,
                currency: 'VND',
            },
        });
        console.log('✅ Wallet created for admin user');

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log('- Roles: 4 (ADMIN, CREATOR, USER, SUPPLIER)');
        console.log('- Users: 1 (admin@savore.com)');
        console.log('- Admin credentials:');
        console.log('  Email: admin@savore.com');
        console.log('  Password: admin123');
    } catch (error) {
        console.error('❌ Error during seeding:');
        console.error(error);
        throw error;
    }
}

main()
    .catch((e) => {
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
