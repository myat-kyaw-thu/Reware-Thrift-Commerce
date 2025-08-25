import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('🌱 Starting database seed...');

    // Clean up existing data in correct order (respecting foreign key constraints)
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleaned existing data');

    // Create users first
    const createdUsers = await prisma.user.createManyAndReturn({
      data: sampleData.users,
    });
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create products
    const createdProducts = await prisma.product.createManyAndReturn({
      data: sampleData.products,
    });
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create sample reviews
    const reviewsWithIds = sampleData.reviews.map((review, index) => ({
      ...review,
      userId: createdUsers[index % createdUsers.length].id,
      productId: createdProducts[index % createdProducts.length].id,
    }));

    await prisma.review.createMany({
      data: reviewsWithIds,
    });
    console.log(`⭐ Created ${reviewsWithIds.length} reviews`);

    // Update product ratings based on reviews
    for (const product of createdProducts) {
      const reviews = await prisma.review.findMany({
        where: { productId: product.id },
      });

      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        await prisma.product.update({
          where: { id: product.id },
          data: {
            rating: avgRating,
            numReviews: reviews.length,
          },
        });
      }
    }
    console.log('📊 Updated product ratings');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample accounts:');
    console.log('Admin: admin@example.com (password: password)');
    console.log('User: user@example.com (password: password)');
    console.log('User: mike@example.com (password: password)');
    console.log('User: sarah@example.com (password: password)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
