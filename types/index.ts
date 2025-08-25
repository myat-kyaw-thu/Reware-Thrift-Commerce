import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  insertReviewSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateProfileSchema,
  userPreferencesSchema
} from '@/lib/validators';
import { z } from 'zod';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string; };
  paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string; };
};
export type UserProfile = z.infer<typeof updateProfileSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  dateOfBirth: Date | null;
  phone: string | null;
  gender: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  website: string | null;
  linkedIn: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  occupation: string | null;
  company: string | null;
  newsletter: boolean;
  smsUpdates: boolean;
  language: string;
  timezone: string | null;
  currency: string;
  profileViews: number;
  isVerified: boolean;
  lastLoginAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};