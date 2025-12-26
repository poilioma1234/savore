import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🗑️  Deleting all old posts...');

        // Delete all recipe items first (foreign key constraint)
        const deletedRecipeItems = await prisma.recipeItem.deleteMany();
        console.log(`  ✅ Deleted ${deletedRecipeItems.count} recipe items`);

        // Delete all posts
        const deletedPosts = await prisma.post.deleteMany();
        console.log(`  ✅ Deleted ${deletedPosts.count} posts`);

        console.log('\n✅ All posts deleted successfully!');
        console.log('💡 Now you can run: node prisma/seed-posts.mjs');

    } catch (error) {
        console.error('❌ Error during deletion:');
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
