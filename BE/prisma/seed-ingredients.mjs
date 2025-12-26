import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🥬 Starting ingredients seeding...');

        // Get suppliers
        const suppliers = await prisma.user.findMany({
            where: {
                userRoles: {
                    some: {
                        role: {
                            code: 'SUPPLIER'
                        }
                    }
                }
            },
            take: 5
        });

        if (suppliers.length < 2) {
            console.error('❌ Need at least 2 suppliers in database. Please run seed-users.mjs first!');
            process.exit(1);
        }

        const supplier1 = suppliers[0];
        const supplier2 = suppliers[1];
        const supplier3 = suppliers.length > 2 ? suppliers[2] : supplier1;
        const supplier4 = suppliers.length > 3 ? suppliers[3] : supplier2;
        const supplier5 = suppliers.length > 4 ? suppliers[4] : supplier1;

        console.log(`\n✅ Found ${suppliers.length} suppliers`);
        console.log(`  Using: ${supplier1.email}, ${supplier2.email}...`);

        // ==================== SEED INGREDIENTS ====================
        console.log('\n🥬 Creating ingredients with prices...');
        const ingredientsData = [
            // Thịt
            { name: 'Thịt gà ta', tag: 'gà', providerId: supplier1.id, pricePerKg: 150000 },
            { name: 'Thịt gà công nghiệp', tag: 'gà', providerId: supplier2.id, pricePerKg: 85000 },
            { name: 'Thịt bò Úc', tag: 'bò', providerId: supplier1.id, pricePerKg: 360000 },
            { name: 'Thịt bò Việt Nam', tag: 'bò', providerId: supplier2.id, pricePerKg: 280000 },
            { name: 'Thịt heo ba chỉ', tag: 'heo', providerId: supplier3.id, pricePerKg: 120000 },
            { name: 'Thịt heo nạc', tag: 'heo', providerId: supplier1.id, pricePerKg: 110000 },

            // Hải sản
            { name: 'Tôm sú tươi', tag: 'hải sản', providerId: supplier3.id, pricePerKg: 450000 },
            { name: 'Cá hồi Na Uy', tag: 'hải sản', providerId: supplier3.id, pricePerKg: 520000 },
            { name: 'Mực ống tươi', tag: 'hải sản', providerId: supplier3.id, pricePerKg: 180000 },

            // Gia vị
            { name: 'Sả', tag: 'gia vị', providerId: supplier1.id, pricePerKg: 20000 },
            { name: 'Ớt', tag: 'gia vị', providerId: supplier1.id, pricePerKg: 30000 },
            { name: 'Tỏi', tag: 'gia vị', providerId: supplier2.id, pricePerKg: 40000 },
            { name: 'Hành tím', tag: 'gia vị', providerId: supplier2.id, pricePerKg: 25000 },
            { name: 'Gừng', tag: 'gia vị', providerId: supplier4.id, pricePerKg: 35000 },
            { name: 'Nước mắm', tag: 'gia vị', providerId: supplier1.id, pricePerKg: 50000 },
            { name: 'Đường', tag: 'gia vị', providerId: supplier1.id, pricePerKg: 18000 },
            { name: 'Muối', tag: 'gia vị', providerId: supplier4.id, pricePerKg: 8000 },
            { name: 'Dầu ăn', tag: 'gia vị', providerId: supplier4.id, pricePerKg: 45000 },

            // Rau củ
            { name: 'Rau muống', tag: 'rau', providerId: supplier5.id, pricePerKg: 15000 },
            { name: 'Cà chua', tag: 'rau', providerId: supplier5.id, pricePerKg: 30000 },
            { name: 'Cà rốt Đà Lạt', tag: 'củ', providerId: supplier5.id, pricePerKg: 25000 },
            { name: 'Khoai tây', tag: 'củ', providerId: supplier5.id, pricePerKg: 22000 },
            { name: 'Hành lá', tag: 'rau', providerId: supplier2.id, pricePerKg: 18000 },
            { name: 'Rau thơm', tag: 'rau', providerId: supplier5.id, pricePerKg: 20000 },

            // Trứng & sữa
            { name: 'Trứng gà', tag: 'trứng', providerId: supplier2.id, pricePerKg: 45000 },
            { name: 'Trứng vịt', tag: 'trứng', providerId: supplier2.id, pricePerKg: 50000 },

            // Nấm
            { name: 'Nấm hương khô', tag: 'nấm', providerId: supplier4.id, pricePerKg: 280000 },
            { name: 'Nấm rơm tươi', tag: 'nấm', providerId: supplier5.id, pricePerKg: 35000 },
        ];

        const ingredients = [];
        for (const ingData of ingredientsData) {
            const ingredient = await prisma.ingredient.create({
                data: ingData,
            });
            ingredients.push(ingredient);
            console.log(`  ✅ Created: ${ingredient.name} - ${ingredient.pricePerKg} VND/kg`);
        }

        console.log('\n🎉 Ingredients seeding completed successfully!');
        console.log(`\n📋 Summary:`);
        console.log(`- Total Ingredients: ${ingredients.length}`);
        console.log(`- Suppliers used: ${suppliers.length}`);

        console.log('\n💰 Price Range:');
        const prices = ingredients.map(i => parseFloat(i.pricePerKg));
        console.log(`  Min: ${Math.min(...prices).toLocaleString('vi-VN')} VND/kg`);
        console.log(`  Max: ${Math.max(...prices).toLocaleString('vi-VN')} VND/kg`);
        console.log(`  Avg: ${Math.round(prices.reduce((a, b) => a + b, 0) / prices.length).toLocaleString('vi-VN')} VND/kg`);

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
