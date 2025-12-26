import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🌱 Starting database seeding...');

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
        console.log('\n👤 Creating users...');
        const testUsers = [
            {
                email: 'admin@savore.com',
                password: 'admin123',
                fullName: 'Admin User',
                roleCode: 'ADMIN',
                address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
                latitude: 10.7769,
                longitude: 106.7009,
            },
            {
                email: 'creator@savore.com',
                password: 'creator123',
                fullName: 'Nguyễn Văn A',
                roleCode: 'CREATOR',
                address: '456 Lê Lợi, Quận 1, TP.HCM',
                latitude: 10.7756,
                longitude: 106.7019,
            },
            {
                email: 'user@savore.com',
                password: 'user123',
                fullName: 'Trần Thị B',
                roleCode: 'USER',
                address: '789 Hai Bà Trưng, Quận 3, TP.HCM',
                latitude: 10.7881,
                longitude: 106.6892,
            },
            {
                email: 'supplier@savore.com',
                password: 'supplier123',
                fullName: 'Nhà Cung Cấp Thực Phẩm Sạch',
                roleCode: 'SUPPLIER',
                address: '321 Võ Văn Tần, Quận 3, TP.HCM',
                latitude: 10.7823,
                longitude: 106.6908,
            },
            {
                email: 'supplier2@savore.com',
                password: 'supplier123',
                fullName: 'Chợ Nông Sản Organic',
                roleCode: 'SUPPLIER',
                address: '555 Điện Biên Phủ, Bình Thạnh, TP.HCM',
                latitude: 10.8012,
                longitude: 106.7145,
            },
        ];

        const createdUsers = [];
        for (const userData of testUsers) {
            console.log(`  Creating ${userData.roleCode}: ${userData.email}...`);

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: {
                    email: userData.email,
                    passwordHash: hashedPassword,
                    fullName: userData.fullName,
                    address: userData.address,
                    latitude: userData.latitude,
                    longitude: userData.longitude,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random`,
                },
            });

            createdUsers.push({ ...user, roleCode: userData.roleCode });

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
            }

            // Create wallet
            await prisma.wallet.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    balance: 1000000, // 1 triệu VND
                    currency: 'VND',
                },
            });

            console.log(`  ✅ ${userData.email} created`);
        }

        // Get specific users for later use
        const creatorUser = createdUsers.find((u) => u.roleCode === 'CREATOR');
        const supplierUser = createdUsers.find((u) => u.roleCode === 'SUPPLIER');
        const supplierUser2 = createdUsers.find((u) => u.email === 'supplier2@savore.com');

        // ==================== SEED INGREDIENTS ====================
        console.log('\n🥬 Creating ingredients...');
        const ingredientsData = [
            { name: 'Thịt gà ta', tag: 'gà', providerId: supplierUser.id, pricePerKg: 150000 },
            { name: 'Thịt gà công nghiệp', tag: 'gà', providerId: supplierUser2.id, pricePerKg: 85000 },
            { name: 'Sả', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 20000 },
            { name: 'Ớt', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 30000 },
            { name: 'Tỏi', tag: 'gia vị', providerId: supplierUser2.id, pricePerKg: 40000 },
            { name: 'Hành tím', tag: 'gia vị', providerId: supplierUser2.id, pricePerKg: 25000 },
            { name: 'Nước mắm', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 50000 },
            { name: 'Đường', tag: 'gia vị', providerId: supplierUser.id, pricePerKg: 18000 },
            { name: 'Thịt bò', tag: 'bò', providerId: supplierUser.id, pricePerKg: 360000 },
            { name: 'Rau muống', tag: 'rau', providerId: supplierUser2.id, pricePerKg: 15000 },
            { name: 'Cà chua', tag: 'rau', providerId: supplierUser.id, pricePerKg: 30000 },
            { name: 'Trứng gà', tag: 'trứng', providerId: supplierUser2.id, pricePerKg: 45000 },
        ];

        const ingredients = [];
        for (const ingData of ingredientsData) {
            const ingredient = await prisma.ingredient.create({
                data: ingData,
            });
            ingredients.push(ingredient);
            console.log(`  ✅ Created: ${ingredient.name}`);
        }

        // ==================== SEED TAGS ====================
        console.log('\n🏷️  Creating tags...');
        const tagNames = ['Gà', 'Bò', 'Xào', 'Chiên', 'Rau', 'Trứng', 'Cà chua'];
        const tags = [];
        for (const tagName of tagNames) {
            const tag = await prisma.tag.upsert({
                where: { name: tagName },
                update: {},
                create: { name: tagName },
            });
            tags.push(tag);
            console.log(`  ✅ Created/Found: ${tag.name} (ID: ${tag.id})`);
        }

        // ==================== SEED PRODUCTS ====================
        console.log('\n🛒 Creating products...');
        const productsData = [
            { name: 'Thịt gà ta nguyên con (1kg)', price: 150000, supplierId: supplierUser.id },
            { name: 'Thịt gà công nghiệp (1kg)', price: 85000, supplierId: supplierUser2.id },
            { name: 'Combo gia vị nấu gà (sả, ớt, tỏi)', price: 25000, supplierId: supplierUser.id },
            { name: 'Thịt bò úc nhập khẩu (500g)', price: 180000, supplierId: supplierUser.id },
            { name: 'Rau muống hữu cơ (500g)', price: 15000, supplierId: supplierUser2.id },
            { name: 'Cà chua Đà Lạt (1kg)', price: 30000, supplierId: supplierUser.id },
            { name: 'Trứng gà sạch (10 quả)', price: 45000, supplierId: supplierUser2.id },
        ];

        const products = [];
        for (const prodData of productsData) {
            const product = await prisma.product.create({
                data: prodData,
            });
            products.push(product);
            console.log(`  ✅ Created: ${product.name} - ${product.price} VND`);
        }

        // ==================== SEED POSTS ====================
        console.log('\n📹 Creating posts (recipes)...');

        // Post 1: Gà Xào Sả Ớt
        const post1 = await prisma.post.create({
            data: {
                userId: creatorUser.id,
                linkVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                thumbnail: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
                name: 'Gà Xào Sả Ớt Thơm Ngon',
                description: 'Món gà xào sả ớt đậm đà, thơm ngon, dễ làm cho bữa cơm gia đình',
                cookingSteps: [
                    'Bước 1: Sơ chế gà, rửa sạch, chặt miếng vừa ăn',
                    'Bước 2: Ướp gà với nước mắm, đường, tỏi băm trong 30 phút',
                    'Bước 3: Đập dập sả, cắt khúc. Ớt cắt lát',
                    'Bước 4: Phi thơm sả, ớt rồi cho gà vào xào',
                    'Bước 5: Nêm nếm lại gia vị, xào đến khi gà chín vàng'
                ],
                tagIds: [tags.find(t => t.name === 'Gà').id, tags.find(t => t.name === 'Xào').id],
                status: 'PUBLISHED',
            },
        });

        // Recipe items for Post 1
        await prisma.recipeItem.createMany({
            data: [
                {
                    postId: post1.id,
                    ingredientId: ingredients.find((i) => i.name === 'Thịt gà ta').id,
                    quantity: 500,
                    unit: 'gram',
                },
                {
                    postId: post1.id,
                    ingredientId: ingredients.find((i) => i.name === 'Sả').id,
                    quantity: 50,
                    unit: 'gram',
                },
                {
                    postId: post1.id,
                    ingredientId: ingredients.find((i) => i.name === 'Ớt').id,
                    quantity: 30,
                    unit: 'gram',
                },
                {
                    postId: post1.id,
                    ingredientId: ingredients.find((i) => i.name === 'Tỏi').id,
                    quantity: 20,
                    unit: 'gram',
                },
                {
                    postId: post1.id,
                    ingredientId: ingredients.find((i) => i.name === 'Nước mắm').id,
                    quantity: 30,
                    unit: 'ml',
                },
            ],
        });
        console.log(`  ✅ Created: ${post1.name}`);

        // Post 2: Bò Xào Rau Muống
        const post2 = await prisma.post.create({
            data: {
                userId: creatorUser.id,
                linkVideo: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
                thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                name: 'Bò Xào Rau Muống',
                description: 'Món bò xào rau muống giòn ngon, bổ dưỡng',
                cookingSteps: [
                    'Bước 1: Thịt bò thái lát mỏng, ướp gia vị',
                    'Bước 2: Rau muống nhặt sạch, cắt khúc',
                    'Bước 3: Phi thơm tỏi, cho bò vào xào nhanh tay',
                    'Bước 4: Cho rau muống vào xào cùng',
                    'Bước 5: Nêm nếm và tắt bếp'
                ],
                tagIds: [tags.find(t => t.name === 'Bò').id, tags.find(t => t.name === 'Xào').id, tags.find(t => t.name === 'Rau').id],
                status: 'PUBLISHED',
            },
        });

        await prisma.recipeItem.createMany({
            data: [
                {
                    postId: post2.id,
                    ingredientId: ingredients.find((i) => i.name === 'Thịt bò').id,
                    quantity: 300,
                    unit: 'gram',
                },
                {
                    postId: post2.id,
                    ingredientId: ingredients.find((i) => i.name === 'Rau muống').id,
                    quantity: 200,
                    unit: 'gram',
                },
                {
                    postId: post2.id,
                    ingredientId: ingredients.find((i) => i.name === 'Tỏi').id,
                    quantity: 15,
                    unit: 'gram',
                },
                {
                    postId: post2.id,
                    ingredientId: ingredients.find((i) => i.name === 'Nước mắm').id,
                    quantity: 20,
                    unit: 'ml',
                },
            ],
        });
        console.log(`  ✅ Created: ${post2.name}`);

        // Post 3: Trứng Chiên Cà Chua
        const post3 = await prisma.post.create({
            data: {
                userId: creatorUser.id,
                linkVideo: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
                thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
                name: 'Trứng Chiên Cà Chua',
                description: 'Món ăn đơn giản, nhanh gọn cho bữa sáng',
                cookingSteps: [
                    'Bước 1: Cà chua rửa sạch, cắt múi cau',
                    'Bước 2: Đập trứng vào bát, đánh tan',
                    'Bước 3: Phi thơm hành tím, cho cà chua vào xào',
                    'Bước 4: Đổ trứng vào, đảo đều',
                    'Bước 5: Nêm gia vị vừa ăn'
                ],
                tagIds: [tags.find(t => t.name === 'Trứng').id, tags.find(t => t.name === 'Cà chua').id, tags.find(t => t.name === 'Chiên').id],
                status: 'PUBLISHED',
            },
        });

        await prisma.recipeItem.createMany({
            data: [
                {
                    postId: post3.id,
                    ingredientId: ingredients.find((i) => i.name === 'Trứng gà').id,
                    quantity: 3,
                    unit: 'quả',
                },
                {
                    postId: post3.id,
                    ingredientId: ingredients.find((i) => i.name === 'Cà chua').id,
                    quantity: 150,
                    unit: 'gram',
                },
                {
                    postId: post3.id,
                    ingredientId: ingredients.find((i) => i.name === 'Hành tím').id,
                    quantity: 20,
                    unit: 'gram',
                },
                {
                    postId: post3.id,
                    ingredientId: ingredients.find((i) => i.name === 'Nước mắm').id,
                    quantity: 10,
                    unit: 'ml',
                },
            ],
        });
        console.log(`  ✅ Created: ${post3.name}`);

        // ==================== SUMMARY ====================
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`- Roles: ${roles.length}`);
        console.log(`- Users: ${createdUsers.length}`);
        console.log(`- Ingredients: ${ingredients.length}`);
        console.log(`- Products: ${products.length}`);
        console.log(`- Posts (Recipes): 3`);
        console.log('\n📝 Test accounts:');
        console.log('  Admin:     admin@savore.com / admin123');
        console.log('  Creator:   creator@savore.com / creator123');
        console.log('  User:      user@savore.com / user123');
        console.log('  Supplier:  supplier@savore.com / supplier123');
        console.log('  Supplier2: supplier2@savore.com / supplier123');
        console.log('\n💡 You can now test the API with these accounts!');
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
