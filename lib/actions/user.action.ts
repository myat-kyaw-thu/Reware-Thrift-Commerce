"use server";

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { ShippingAddress } from '@/types';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { z } from 'zod';
import { hash } from '../encrypt';
import { convertToPlainObject, formatError } from '../utils';
import {
  basicProfileSchema,
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateProfileSchema,
  userPreferencesSchema
} from '../validators';

export async function signInWithCredentials(
  _prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user
  // const currentCart = await getMyCart();

  // if (currentCart?.id) {
  //   await prisma.cart.delete({ where: { id: currentCart.id } });
  // } else {
  console.warn('No cart found for deletion.');
  // }
  await signOut();
}
export async function signUpUser(_prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = await hash(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}


export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

export async function getUserInfo() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: 'User not authenticated' };
    }

    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        firstName: true,
        lastName: true,
        bio: true,
        dateOfBirth: true,
        phone: true,
        gender: true,
        country: true,
        state: true,
        city: true,
        zipCode: true,
        website: true,
        linkedIn: true,
        twitter: true,
        instagram: true,
        facebook: true,
        occupation: true,
        company: true,
        newsletter: true,
        smsUpdates: true,
        language: true,
        timezone: true,
        currency: true,
        profileViews: true,
        isVerified: true,
        lastLoginAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Legacy fields
        address: true,
        paymentMethod: true,
      },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      data: convertToPlainObject(user),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type }
    });
    return {
      success: true,
      message: 'Payment method updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateBasicProfile(data: z.infer<typeof basicProfileSchema>) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    const validatedData = basicProfileSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: validatedData,
    });

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    const validatedData = updateProfileSchema.parse(data);

    // Convert dateOfBirth string to Date if provided
    const updateData: any = { ...validatedData };
    if (validatedData.dateOfBirth) {
      updateData.dateOfBirth = new Date(validatedData.dateOfBirth);
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: updateData,
    });

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPreferences(data: z.infer<typeof userPreferencesSchema>) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    const validatedData = userPreferencesSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: validatedData,
    });

    return {
      success: true,
      message: 'Preferences updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateLastLogin(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        profileViews: { increment: 1 }
      },
    });
  } catch (error) {
    console.error('Failed to update last login:', error);
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    return {
      success: true,
      message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function verifyUser(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    return {
      success: true,
      message: 'User verified successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
