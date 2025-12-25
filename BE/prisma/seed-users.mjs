import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🌱 Starting database seeding with multi-role users...');

        // ==================== SEED ROLES ====================
        console.log('\n📝 Creating roles...');
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

        // ==================== SEED USERS ====================
        console.log('\n👤 Creating 19 users (1 admin + 5 suppliers + 5 users + 5 creators + 3 multi-role)...');

        const testUsers = [
            // 1 ADMIN
            {
                email: 'admin@savore.com',
                password: 'admin123',
                fullName: 'Admin Savore',
                description: 'Quản trị viên hệ thống',
                roleCodes: ['ADMIN'], // Array of roles
                address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
                latitude: 10.7769,
                longitude: 106.7009,
            },

            // 5 SUPPLIERS
            {
                email: 'supplier1@savore.com',
                password: 'supplier123',
                fullName: 'Chợ Nông Sản Organic',
                description: 'Chuyên cung cấp rau củ quả hữu cơ, tươi mỗi ngày',
                roleCodes: ['SUPPLIER'],
                address: '555 Điện Biên Phủ, Bình Thạnh, TP.HCM',
                latitude: 10.8012,
                longitude: 106.7145,
            },
            {
                email: 'supplier2@savore.com',
                password: 'supplier123',
                fullName: 'Thịt Tươi Sạch ABC',
                description: 'Thịt gà, bò, heo sạch, nguồn gốc rõ ràng',
                roleCodes: ['SUPPLIER'],
                address: '321 Võ Văn Tần, Quận 3, TP.HCM',
                latitude: 10.7823,
                longitude: 106.6908,
            },
            {
                email: 'supplier3@savore.com',
                password: 'supplier123',
                fullName: 'Hải Sản Tươi Sống 247',
                description: 'Hải sản tươi sống, giao hàng 24/7',
                roleCodes: ['SUPPLIER'],
                address: '789 Lý Thường Kiệt, Quận 10, TP.HCM',
                latitude: 10.7721,
                longitude: 106.6672,
            },
            {
                email: 'supplier4@savore.com',
                password: 'supplier123',
                fullName: 'Gia Vị Nhập Khẩu XYZ',
                description: 'Gia vị cao cấp nhập khẩu từ Nhật, Hàn, Thái',
                roleCodes: ['SUPPLIER'],
                address: '456 Trần Hưng Đạo, Quận 5, TP.HCM',
                latitude: 10.7545,
                longitude: 106.6759,
            },
            {
                email: 'supplier5@savore.com',
                password: 'supplier123',
                fullName: 'Nông Trại Đà Lạt Fresh',
                description: 'Rau củ quả Đà Lạt tươi, giao trong ngày',
                roleCodes: ['SUPPLIER'],
                address: '234 Phan Văn Trị, Gò Vấp, TP.HCM',
                latitude: 10.8392,
                longitude: 106.6742,
            },

            // 5 USERS (Customers)
            {
                email: 'user1@savore.com',
                password: 'user123',
                fullName: 'Trần Thị Mai',
                description: 'Yêu thích nấu ăn, thích khám phá món mới',
                roleCodes: ['USER'],
                address: '789 Hai Bà Trưng, Quận 3, TP.HCM',
                latitude: 10.7881,
                longitude: 106.6892,
            },
            {
                email: 'user2@savore.com',
                password: 'user123',
                fullName: 'Lê Văn Hùng',
                description: 'Thích ăn healthy, ăn sạch',
                roleCodes: ['USER'],
                address: '123 Cách Mạng Tháng 8, Quận 10, TP.HCM',
                latitude: 10.7756,
                longitude: 106.6653,
            },
            {
                email: 'user3@savore.com',
                password: 'user123',
                fullName: 'Phạm Thị Lan',
                description: 'Mẹ bỉm sữa, tìm món ăn nhanh cho gia đình',
                roleCodes: ['USER'],
                address: '456 Lạc Long Quân, Quận 11, TP.HCM',
                latitude: 10.7625,
                longitude: 106.6345,
            },
            {
                email: 'user4@savore.com',
                password: 'user123',
                fullName: 'Nguyễn Văn Tuấn',
                description: 'Sinh viên, thích nấu ăn tiết kiệm',
                roleCodes: ['USER'],
                address: '789 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
                latitude: 10.7892,
                longitude: 106.6934,
            },
            {
                email: 'user5@savore.com',
                password: 'user123',
                fullName: 'Hoàng Thị Hoa',
                description: 'Food blogger, thích review món ngon',
                roleCodes: ['USER'],
                address: '234 Pasteur, Quận 3, TP.HCM',
                latitude: 10.7789,
                longitude: 106.6923,
            },

            // 5 CREATORS
            {
                email: 'creator1@savore.com',
                password: 'creator123',
                fullName: 'Chef Minh Nhật',
                description: 'Đầu bếp chuyên món Việt truyền thống, 10 năm kinh nghiệm',
                roleCodes: ['CREATOR'],
                address: '456 Lê Lợi, Quận 1, TP.HCM',
                latitude: 10.7756,
                longitude: 106.7019,
            },
            {
                email: 'creator2@savore.com',
                password: 'creator123',
                fullName: 'Bếp Trưởng Thanh Hương',
                description: 'Chuyên món Âu, từng làm việc tại Pháp 5 năm',
                roleCodes: ['CREATOR'],
                address: '789 Nguyễn Văn Cừ, Quận 5, TP.HCM',
                latitude: 10.7567,
                longitude: 106.6678,
            },
            {
                email: 'creator3@savore.com',
                password: 'creator123',
                fullName: 'Anh Tuấn Cooking',
                description: 'YouTuber nấu ăn 500k subscribers, chuyên món Á',
                roleCodes: ['CREATOR'],
                address: '123 Võ Thị Sáu, Quận 3, TP.HCM',
                latitude: 10.7823,
                longitude: 106.6912,
            },
            {
                email: 'creator4@savore.com',
                password: 'creator123',
                fullName: 'Chị Ngọc Healthy Kitchen',
                description: 'Chuyên món ăn healthy, low-carb, ăn kiêng',
                roleCodes: ['CREATOR'],
                address: '456 Trường Chinh, Tân Bình, TP.HCM',
                latitude: 10.8001,
                longitude: 106.6523,
            },
            {
                email: 'creator5@savore.com',
                password: 'creator123',
                fullName: 'Bếp Nhà Mình',
                description: 'Chia sẻ món ăn gia đình đơn giản, dễ làm',
                roleCodes: ['CREATOR'],
                address: '789 Hoàng Văn Thụ, Phú Nhuận, TP.HCM',
                latitude: 10.7978,
                longitude: 106.6789,
            },

            // 3 MULTI-ROLE USERS
            {
                email: 'hybrid1@savore.com',
                password: 'hybrid123',
                fullName: 'Nguyễn Minh Tâm',
                description: 'Vừa là food blogger vừa là creator, chia sẻ công thức và review',
                roleCodes: ['USER', 'CREATOR'], // USER + CREATOR
                address: '123 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
                latitude: 10.7812,
                longitude: 106.6934,
            },
            {
                email: 'hybrid2@savore.com',
                password: 'hybrid123',
                fullName: 'Trần Văn Phúc',
                description: 'Nông dân trồng rau sạch, vừa bán vừa mua nguyên liệu khác',
                roleCodes: ['USER', 'SUPPLIER'], // USER + SUPPLIER
                address: '456 Quốc Lộ 1A, Củ Chi, TP.HCM',
                latitude: 10.9745,
                longitude: 106.4952,
            },
            {
                email: 'hybrid3@savore.com',
                password: 'hybrid123',
                fullName: 'Chef Hùng Farm',
                description: 'Đầu bếp có trang trại riêng, vừa nấu vừa cung cấp nguyên liệu organic',
                roleCodes: ['CREATOR', 'SUPPLIER'], // CREATOR + SUPPLIER
                address: '789 Tỉnh Lộ 8, Hóc Môn, TP.HCM',
                latitude: 10.8823,
                longitude: 106.5934,
            },
        ];

        const createdUsers = [];
        for (const userData of testUsers) {
            console.log(`  Creating ${userData.roleCodes.join('+')}:  ${userData.email}...`);

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: {
                    email: userData.email,
                    passwordHash: hashedPassword,
                    fullName: userData.fullName,
                    description: userData.description,
                    address: userData.address,
                    latitude: userData.latitude,
                    longitude: userData.longitude,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random`,
                },
            });

            createdUsers.push({ ...user, roleCodes: userData.roleCodes });

            // Assign multiple roles
            for (const roleCode of userData.roleCodes) {
                const role = roles.find((r) => r.code === roleCode);
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
                }
            }

            // Create wallet
            await prisma.wallet.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    balance: userData.roleCodes.includes('ADMIN') ? 10000000 : 1000000,
                    currency: 'VND',
                },
            });

            console.log(`  ✅ ${userData.email} created with roles: ${userData.roleCodes.join(', ')}`);
        }

        // ==================== SUMMARY ====================
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`- Roles: ${roles.length}`);
        console.log(`- Total Users: ${createdUsers.length}`);
        console.log(`  • Admin: 1`);
        console.log(`  • Suppliers: 5`);
        console.log(`  • Users: 5`);
        console.log(`  • Creators: 5`);
        console.log(`  • Multi-role: 3`);

        console.log('\n📝 Test accounts:');
        console.log('\n🔐 ADMIN:');
        console.log('  admin@savore.com / admin123');

        console.log('\n🏪 SUPPLIERS:');
        console.log('  supplier1@savore.com / supplier123 (Chợ Nông Sản Organic)');
        console.log('  supplier2@savore.com / supplier123 (Thịt Tươi Sạch ABC)');
        console.log('  supplier3@savore.com / supplier123 (Hải Sản Tươi Sống 247)');
        console.log('  supplier4@savore.com / supplier123 (Gia Vị Nhập Khẩu XYZ)');
        console.log('  supplier5@savore.com / supplier123 (Nông Trại Đà Lạt Fresh)');

        console.log('\n👥 USERS:');
        console.log('  user1@savore.com / user123 (Trần Thị Mai)');
        console.log('  user2@savore.com / user123 (Lê Văn Hùng)');
        console.log('  user3@savore.com / user123 (Phạm Thị Lan)');
        console.log('  user4@savore.com / user123 (Nguyễn Văn Tuấn)');
        console.log('  user5@savore.com / user123 (Hoàng Thị Hoa)');

        console.log('\n👨‍🍳 CREATORS:');
        console.log('  creator1@savore.com / creator123 (Chef Minh Nhật)');
        console.log('  creator2@savore.com / creator123 (Bếp Trưởng Thanh Hương)');
        console.log('  creator3@savore.com / creator123 (Anh Tuấn Cooking)');
        console.log('  creator4@savore.com / creator123 (Chị Ngọc Healthy Kitchen)');
        console.log('  creator5@savore.com / creator123 (Bếp Nhà Mình)');

        console.log('\n🔀 MULTI-ROLE USERS:');
        console.log('  hybrid1@savore.com / hybrid123 (USER + CREATOR - Nguyễn Minh Tâm)');
        console.log('  hybrid2@savore.com / hybrid123 (USER + SUPPLIER - Trần Văn Phúc)');
        console.log('  hybrid3@savore.com / hybrid123 (CREATOR + SUPPLIER - Chef Hùng Farm)');

        console.log('\n💡 You can now test the API with these accounts!');
        console.log('💡 Multi-role users can access features from both roles!');
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
