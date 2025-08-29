import { PrismaClient } from '@prisma/client';

// Simplified Prisma client configuration for Neon
// Using direct connection string without adapter to avoid native module issues
export const prisma = new PrismaClient({
  log: ['error', 'warn'],
}).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});