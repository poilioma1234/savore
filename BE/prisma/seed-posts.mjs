import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('📹 Starting posts seeding...');

        // Get creators
        const creators = await prisma.user.findMany({
            where: {
                userRoles: {
                    some: {
                        role: {
                            code: 'CREATOR'
                        }
                    }
                }
            },
            take: 5
        });

        if (creators.length === 0) {
            console.error('❌ No creators found. Please run seed-users.mjs first!');
            process.exit(1);
        }

        console.log(`✅ Found ${creators.length} creators`);

        // Get all ingredients
        const ingredients = await prisma.ingredient.findMany();
        console.log(`✅ Found ${ingredients.length} ingredients`);

        // Get all tags
        const tags = await prisma.tag.findMany();
        console.log(`✅ Found ${tags.length} tags`);

        // Helper function to find ingredient by name (fuzzy match)
        const findIngredient = (name) => {
            const normalized = name.toLowerCase().trim();
            return ingredients.find(ing =>
                ing.name.toLowerCase().includes(normalized) ||
                normalized.includes(ing.name.toLowerCase())
            );
        };

        // Helper function to find tag by name
        const findTag = (name) => {
            return tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
        };

        // Posts data
        const postsData = [
            {
                name: "Gà xào sả ớt",
                linkVideo: "https://www.youtube.com/watch?v=gUyUHPTDaTA",
                thumbnail: "https://i.ytimg.com/vi/gUyUHPTDaTA/hqdefault.jpg",
                description: "Món gà xào sả ớt cay thơm, đậm đà, rất đưa cơm.",
                tagNames: ["Gà", "Xào"],
                cookingSteps: [
                    "Gà rửa sạch, chặt miếng vừa ăn",
                    "Ướp gà với nước mắm, tỏi, ớt trong 30 phút",
                    "Phi thơm sả, cho gà vào xào",
                    "Xào đến khi gà chín vàng",
                    "Nêm nếm và hoàn thành"
                ],
                ingredientsList: [
                    { name: "Thịt gà ta", quantity: 500, unit: "gram" },
                    { name: "Sả", quantity: 50, unit: "gram" },
                    { name: "Ớt", quantity: 20, unit: "gram" },
                    { name: "Nước mắm", quantity: 30, unit: "ml" }
                ]
            },
            {
                name: "Gà chiên nước mắm",
                linkVideo: "https://www.youtube.com/watch?v=ozNNdCjKQzM",
                thumbnail: "https://i.ytimg.com/vi/ozNNdCjKQzM/hqdefault.jpg",
                description: "Gà chiên giòn sốt nước mắm tỏi ớt mặn ngọt hấp dẫn.",
                tagNames: ["Gà", "Chiên"],
                cookingSteps: [
                    "Gà làm sạch, để ráo",
                    "Chiên gà đến khi vàng giòn",
                    "Phi thơm tỏi, cho nước mắm vào",
                    "Áo sốt đều lên gà",
                    "Hoàn thành"
                ],
                ingredientsList: [
                    { name: "Thịt gà", quantity: 600, unit: "gram" },
                    { name: "Tỏi", quantity: 30, unit: "gram" },
                    { name: "Nước mắm", quantity: 40, unit: "ml" }
                ]
            },
            {
                name: "Bò xào rau muống",
                linkVideo: "https://www.youtube.com/watch?v=BlwNWYdM8ks",
                thumbnail: "https://i.ytimg.com/vi/BlwNWYdM8ks/hqdefault.jpg",
                description: "Bò mềm, rau muống giòn xanh, món xào quốc dân.",
                tagNames: ["Bò", "Xào", "Rau"],
                cookingSteps: [
                    "Bò thái mỏng, ướp gia vị",
                    "Rau muống rửa sạch, cắt khúc",
                    "Phi thơm tỏi, xào bò nhanh tay",
                    "Cho rau vào đảo đều",
                    "Nêm nếm và tắt bếp"
                ],
                ingredientsList: [
                    { name: "Thịt bò", quantity: 300, unit: "gram" },
                    { name: "Rau muống", quantity: 200, unit: "gram" },
                    { name: "Tỏi", quantity: 20, unit: "gram" }
                ]
            },
            {
                name: "Bò lúc lắc",
                linkVideo: "https://www.youtube.com/watch?v=0X5m98q3Pn0",
                thumbnail: "https://i.ytimg.com/vi/0X5m98q3Pn0/hqdefault.jpg",
                description: "Bò lúc lắc mềm thơm, ăn kèm rau sống và trứng.",
                tagNames: ["Bò", "Xào"],
                cookingSteps: [
                    "Bò cắt khối vuông",
                    "Ướp bò với gia vị",
                    "Áp chảo bò trên lửa lớn",
                    "Cho hành tây vào đảo nhanh",
                    "Hoàn thành"
                ],
                ingredientsList: [
                    { name: "Thịt bò", quantity: 350, unit: "gram" },
                    { name: "Hành tím", quantity: 100, unit: "gram" }
                ]
            },
            {
                name: "Trứng chiên cà chua",
                linkVideo: "https://www.youtube.com/watch?v=3ZlVvkfeGmA",
                thumbnail: "https://i.ytimg.com/vi/3ZlVvkfeGmA/hqdefault.jpg",
                description: "Món ăn đơn giản, nhanh gọn cho bữa cơm gia đình.",
                tagNames: ["Trứng", "Chiên"],
                cookingSteps: [
                    "Cà chua cắt múi",
                    "Đánh tan trứng",
                    "Xào cà chua cho mềm",
                    "Đổ trứng vào đảo đều",
                    "Nêm nếm vừa ăn"
                ],
                ingredientsList: [
                    { name: "Trứng gà", quantity: 150, unit: "gram" },
                    { name: "Cà chua", quantity: 150, unit: "gram" }
                ]
            },
            {
                name: "Gà kho gừng",
                linkVideo: "https://www.youtube.com/watch?v=bEJtE9XMb-U",
                thumbnail: "https://i.ytimg.com/vi/bEJtE9XMb-U/hqdefault.jpg",
                description: "Gà kho gừng ấm nồng, rất hợp cho bữa cơm gia đình.",
                tagNames: ["Gà", "Kho"],
                cookingSteps: [
                    "Gà chặt miếng vừa ăn",
                    "Gừng thái sợi",
                    "Ướp gà với nước mắm và gừng",
                    "Kho lửa nhỏ đến khi sệt",
                    "Hoàn thành"
                ],
                ingredientsList: [
                    { name: "Thịt gà", quantity: 600, unit: "gram" },
                    { name: "Gừng", quantity: 30, unit: "gram" },
                    { name: "Nước mắm", quantity: 30, unit: "ml" }
                ]
            },
            {
                name: "Gà hấp lá chanh",
                linkVideo: "https://www.youtube.com/watch?v=6q0xpITuqdY",
                thumbnail: "https://i.ytimg.com/vi/6q0xpITuqdY/hqdefault.jpg",
                description: "Gà hấp mềm ngọt, thơm mùi lá chanh tự nhiên.",
                tagNames: ["Gà", "Hấp"],
                cookingSteps: [
                    "Gà làm sạch",
                    "Lá chanh thái sợi",
                    "Ướp gà nhẹ gia vị",
                    "Hấp 30 phút",
                    "Rắc lá chanh và dùng nóng"
                ],
                ingredientsList: [
                    { name: "Thịt gà", quantity: 800, unit: "gram" },
                    { name: "Hành lá", quantity: 20, unit: "gram" }
                ]
            },
            {
                name: "Bò kho",
                linkVideo: "https://www.youtube.com/watch?v=CshmJ0EjMq4",
                thumbnail: "https://i.ytimg.com/vi/CshmJ0EjMq4/hqdefault.jpg",
                description: "Bò kho đậm đà, thơm mùi quế hồi, ăn với bánh mì rất ngon.",
                tagNames: ["Bò", "Kho"],
                cookingSteps: [
                    "Bò cắt khối",
                    "Ướp bò với gia vị bò kho",
                    "Xào săn bò",
                    "Kho lửa nhỏ đến mềm",
                    "Cho cà rốt vào và hoàn thành"
                ],
                ingredientsList: [
                    { name: "Thịt bò", quantity: 500, unit: "gram" },
                    { name: "Cà rốt", quantity: 150, unit: "gram" }
                ]
            },
            {
                name: "Bò xào hành tây",
                linkVideo: "https://www.youtube.com/watch?v=KpNanLvoa8g",
                thumbnail: "https://i.ytimg.com/vi/KpNanLvoa8g/hqdefault.jpg",
                description: "Món bò xào nhanh gọn, thịt mềm, hành tây ngọt.",
                tagNames: ["Bò", "Xào"],
                cookingSteps: [
                    "Bò thái mỏng",
                    "Hành tây cắt múi",
                    "Xào bò nhanh tay",
                    "Cho hành tây vào đảo",
                    "Nêm nếm và tắt bếp"
                ],
                ingredientsList: [
                    { name: "Thịt bò", quantity: 300, unit: "gram" },
                    { name: "Hành tím", quantity: 150, unit: "gram" }
                ]
            },
            {
                name: "Trứng cuộn",
                linkVideo: "https://www.youtube.com/watch?v=9DaLicruyhc",
                thumbnail: "https://i.ytimg.com/vi/9DaLicruyhc/hqdefault.jpg",
                description: "Trứng cuộn đẹp mắt, mềm thơm, rất được trẻ em yêu thích.",
                tagNames: ["Trứng", "Chiên"],
                cookingSteps: [
                    "Đánh tan trứng",
                    "Đổ trứng từng lớp mỏng",
                    "Cuộn trứng khi còn ướt",
                    "Lặp lại đến hết trứng",
                    "Cắt khoanh và trình bày"
                ],
                ingredientsList: [
                    { name: "Trứng gà", quantity: 200, unit: "gram" },
                    { name: "Hành lá", quantity: 20, unit: "gram" }
                ]
            },
            {
                name: "Gà nướng mật ong",
                linkVideo: "https://www.youtube.com/watch?v=kh9BzMC9UQc",
                thumbnail: "https://i.ytimg.com/vi/kh9BzMC9UQc/hqdefault.jpg",
                description: "Gà nướng mật ong vàng óng, thơm ngọt, rất được yêu thích.",
                tagNames: ["Gà", "Nướng"],
                cookingSteps: [
                    "Gà làm sạch, để ráo",
                    "Ướp gà với mật ong và tỏi",
                    "Làm nóng lò hoặc bếp than",
                    "Nướng gà đến khi vàng đều",
                    "Quét thêm sốt và hoàn thành"
                ],
                ingredientsList: [
                    { name: "Thịt gà", quantity: 800, unit: "gram" },
                    { name: "Tỏi", quantity: 20, unit: "gram" },
                    { name: "Đường", quantity: 40, unit: "gram" }
                ]
            },
            {
                name: "Gà rang tỏi",
                linkVideo: "https://www.youtube.com/watch?v=fXCv05S2U6s",
                thumbnail: "https://i.ytimg.com/vi/fXCv05S2U6s/hqdefault.jpg",
                description: "Gà rang tỏi giòn bên ngoài, thơm nức mũi.",
                tagNames: ["Gà", "Chiên"],
                cookingSteps: [
                    "Gà chặt miếng",
                    "Chiên gà vàng giòn",
                    "Phi tỏi cho thơm",
                    "Cho gà vào đảo đều",
                    "Hoàn thành"
                ],
                ingredientsList: [
                    { name: "Thịt gà", quantity: 600, unit: "gram" },
                    { name: "Tỏi", quantity: 40, unit: "gram" }
                ]
            },
            {
                name: "Bò xào nấm",
                linkVideo: "https://www.youtube.com/watch?v=-4SpwAXog7Y",
                thumbnail: "https://i.ytimg.com/vi/-4SpwAXog7Y/hqdefault.jpg",
                description: "Bò mềm kết hợp nấm thanh ngọt, dễ ăn.",
                tagNames: ["Bò", "Xào", "Nấm"],
                cookingSteps: [
                    "Bò thái mỏng, ướp gia vị",
                    "Nấm rửa sạch",
                    "Xào bò nhanh tay",
                    "Cho nấm vào đảo",
                    "Nêm nếm và tắt bếp"
                ],
                ingredientsList: [
                    { name: "Thịt bò", quantity: 300, unit: "gram" },
                    { name: "Nấm rơm", quantity: 200, unit: "gram" }
                ]
            },
            {
                name: "Bò cuốn lá lốt",
                linkVideo: "https://www.youtube.com/watch?v=l-4lrZF0c14",
                thumbnail: "https://i.ytimg.com/vi/l-4lrZF0c14/hqdefault.jpg",
                description: "Bò cuốn lá lốt nướng thơm lừng, đậm đà.",
                tagNames: ["Bò", "Nướng"],
                cookingSteps: [
                    "Bò băm nhỏ",
                    "Cuốn bò với lá lốt",
                    "Xếp lên vỉ nướng",
                    "Nướng chín đều",
                    "Dùng nóng"
                ],
                ingredientsList: [
                    { name: "Thịt bò", quantity: 400, unit: "gram" },
                    { name: "Hành lá", quantity: 30, unit: "gram" }
                ]
            },
            {
                name: "Trứng hấp thịt",
                linkVideo: "https://www.youtube.com/watch?v=m9b5yzJP3gU",
                thumbnail: "https://i.ytimg.com/vi/m9b5yzJP3gU/hqdefault.jpg",
                description: "Trứng hấp thịt mềm mịn, dễ ăn cho cả gia đình.",
                tagNames: ["Trứng", "Hấp"],
                cookingSteps: [
                    "Đánh tan trứng",
                    "Trộn trứng với thịt",
                    "Nêm gia vị",
                    "Hấp 20 phút",
                    "Hoàn thành"
                ],
                ingredientsList: [
                    { name: "Trứng gà", quantity: 150, unit: "gram" },
                    { name: "Thịt heo", quantity: 150, unit: "gram" }
                ]
            },
            {
                name: "Rau muống xào tỏi",
                linkVideo: "https://www.youtube.com/watch?v=MZ-P29p--X0",
                thumbnail: "https://i.ytimg.com/vi/MZ-P29p--X0/hqdefault.jpg",
                description: "Rau muống xào tỏi xanh giòn, món rau quốc dân.",
                tagNames: ["Rau", "Xào"],
                cookingSteps: [
                    "Rau muống nhặt sạch, cắt khúc",
                    "Phi thơm tỏi",
                    "Cho rau vào xào nhanh tay",
                    "Nêm gia vị vừa ăn",
                    "Hoàn thành"
                ],
                ingredientsList: [
                    { name: "Rau muống", quantity: 300, unit: "gram" },
                    { name: "Tỏi", quantity: 20, unit: "gram" }
                ]
            },
            {
                name: "Đậu hũ sốt cà chua",
                linkVideo: "https://www.youtube.com/watch?v=jHMANsB2hkc",
                thumbnail: "https://i.ytimg.com/vi/jHMANsB2hkc/hqdefault.jpg",
                description: "Đậu hũ mềm béo quyện sốt cà chua chua ngọt.",
                tagNames: ["Rau", "Xào"],
                cookingSteps: [
                    "Đậu hũ chiên vàng",
                    "Cà chua xào nhuyễn",
                    "Cho đậu hũ vào sốt",
                    "Nêm gia vị",
                    "Hoàn thành"
                ],
                ingredientsList: [
                    { name: "Cà chua", quantity: 200, unit: "gram" },
                    { name: "Tỏi", quantity: 15, unit: "gram" }
                ]
            }
        ];

        console.log('\n📹 Creating posts...');
        const createdPosts = [];
        let creatorIndex = 0;

        for (const postData of postsData) {
            // Get creator (rotate through creators)
            const creator = creators[creatorIndex % creators.length];
            creatorIndex++;

            // Map tag names to tag IDs
            const tagIds = postData.tagNames
                .map(tagName => findTag(tagName))
                .filter(tag => tag !== undefined)
                .map(tag => tag.id);

            if (tagIds.length === 0) {
                console.log(`  ⚠️  Skipping "${postData.name}" - no valid tags found`);
                continue;
            }

            // Map ingredient names to ingredient IDs
            const recipeItems = postData.ingredientsList
                .map(item => {
                    const ingredient = findIngredient(item.name);
                    if (!ingredient) {
                        console.log(`    ⚠️  Ingredient "${item.name}" not found, skipping...`);
                        return null;
                    }
                    return {
                        ingredientId: ingredient.id,
                        quantity: item.quantity,
                        unit: item.unit
                    };
                })
                .filter(item => item !== null);

            if (recipeItems.length === 0) {
                console.log(`  ⚠️  Skipping "${postData.name}" - no valid ingredients found`);
                continue;
            }

            try {
                // Create post
                const post = await prisma.post.create({
                    data: {
                        userId: creator.id,
                        linkVideo: postData.linkVideo,
                        thumbnail: postData.thumbnail,
                        name: postData.name,
                        description: postData.description,
                        cookingSteps: postData.cookingSteps,
                        tagIds: tagIds,
                        status: 'PUBLISHED'
                    }
                });

                // Create recipe items
                await prisma.recipeItem.createMany({
                    data: recipeItems.map(item => ({
                        postId: post.id,
                        ingredientId: item.ingredientId,
                        quantity: item.quantity,
                        unit: item.unit
                    }))
                });

                createdPosts.push(post);
                console.log(`  ✅ Created: "${post.name}" by ${creator.fullName} (${recipeItems.length} ingredients)`);
            } catch (error) {
                console.log(`  ❌ Error creating "${postData.name}": ${error.message}`);
            }
        }

        console.log('\n🎉 Posts seeding completed successfully!');
        console.log(`\n📋 Summary:`);
        console.log(`- Total Posts Created: ${createdPosts.length}`);
        console.log(`- Creators Used: ${creators.length}`);
        console.log(`- Posts per Creator: ~${Math.ceil(createdPosts.length / creators.length)}`);

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
