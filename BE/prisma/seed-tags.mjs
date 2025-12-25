// Script to seed tags into database
// Run: node prisma/seed-tags.mjs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TAGS = [
    // Loại thịt
    'Gà',
    'Bò',
    'Heo',
    'Cá',
    'Tôm',
    'Mực',
    'Vịt',
    'Dê',

    // Rau củ
    'Rau',
    'Củ',
    'Nấm',
    'Đậu',

    // Món ăn
    'Canh',
    'Xào',
    'Chiên',
    'Nướng',
    'Hấp',
    'Luộc',
    'Kho',
    'Rim',
    'Gỏi',
    'Salad',

    // Món chính
    'Cơm',
    'Bún',
    'Phở',
    'Mì',
    'Bánh',

    // Khác
    'Chay',
    'Healthy',
    'Ăn kiêng',
    'Ăn vặt',
    'Tráng miệng',
    'Đồ uống',

    // Vùng miền
    'Miền Bắc',
    'Miền Trung',
    'Miền Nam',

    // Quốc tế
    'Nhật Bản',
    'Hàn Quốc',
    'Thái Lan',
    'Trung Quốc',
    'Âu Mỹ',
];

async function seedTags() {
    console.log('🌱 Starting to seed tags...');

    let created = 0;
    let skipped = 0;

    for (const tagName of TAGS) {
        try {
            // Check if tag already exists
            const existing = await prisma.tag.findUnique({
                where: { name: tagName }
            });

            if (existing) {
                console.log(`⏭️  Tag "${tagName}" already exists, skipping...`);
                skipped++;
                continue;
            }

            // Create tag
            await prisma.tag.create({
                data: { name: tagName }
            });

            console.log(`✅ Created tag: ${tagName}`);
            created++;

        } catch (error) {
            console.error(`❌ Error creating tag "${tagName}":`, error.message);
        }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Created: ${created} tags`);
    console.log(`⏭️  Skipped: ${skipped} tags (already exist)`);
    console.log(`📝 Total: ${TAGS.length} tags`);

    // Display all tags
    const allTags = await prisma.tag.findMany({
        orderBy: { name: 'asc' }
    });

    console.log('\n📋 All tags in database:');
    allTags.forEach((tag, index) => {
        console.log(`${index + 1}. [ID: ${tag.id}] ${tag.name}`);
    });
}

seedTags()
    .catch((error) => {
        console.error('❌ Error seeding tags:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
