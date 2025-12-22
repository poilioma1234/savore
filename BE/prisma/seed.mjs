import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

        // Create 4 test users
        const testUsers = [
            { email: 'admin@savore.com', password: 'admin123', fullName: 'Admin User', roleCode: 'ADMIN' },
            { email: 'creator@savore.com', password: 'creator123', fullName: 'Creator User', roleCode: 'CREATOR' },
            { email: 'user@savore.com', password: 'user123', fullName: 'Normal User', roleCode: 'USER' },
            { email: 'supplier@savore.com', password: 'supplier123', fullName: 'Supplier User', roleCode: 'SUPPLIER' },
        ];

        for (const userData of testUsers) {
            console.log(`👤 Creating ${userData.roleCode} user: ${userData.email}...`);

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: {
                    email: userData.email,
                    passwordHash: hashedPassword,
                    fullName: userData.fullName,
                },
            });

            console.log(`✅ User created: ${user.email}`);

            // Assign role
            const role = roles.find((r) => r.code === userData.roleCode);
            if (role) {
                await prisma.userRole.upsert({
                    where: {
                        userId_roleId: {
                            userId: user.id,
                            roleId: role.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        roleId: role.id,
                    },
                });
                console.log(`✅ ${userData.roleCode} role assigned`);
            }

            // Create wallet
            await prisma.wallet.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    balance: 0,
                    currency: 'VND',
                },
            });
            console.log(`✅ Wallet created for ${userData.email}`);
        }

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log('- Roles: 4 (ADMIN, CREATOR, USER, SUPPLIER)');
        console.log('- Users: 4');
        console.log('\n📝 Test accounts:');
        console.log('  Admin:    admin@savore.com / admin123');
        console.log('  Creator:  creator@savore.com / creator123');
        console.log('  User:     user@savore.com / user123');
        console.log('  Supplier: supplier@savore.com / supplier123');
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
