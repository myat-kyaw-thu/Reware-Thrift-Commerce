"use server";

import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { auth } from "../../auth";
import { CartItem } from "../../types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(itemsPrice * 0.15),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("No session cart ID found");
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : null;

    // Validate and parse item
    const item = cartItemSchema.parse(data);

    // Always fetch the latest product
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    // Get the user's cart
    const cart = await getMyCart();

    // If no cart, create one and decrement stock
    if (!cart) {
      if (product.stock < item.qty) throw new Error("Not enough stock");
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });
      // Transaction: create cart and update stock
      await prisma.$transaction([
        prisma.cart.create({ data: newCart }),
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.qty },
        }),
      ]);
      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${product.name} added to cart` };
    }

    // If cart exists, check if item is already in cart
    const cartItems = cart.items as CartItem[];
    const existItem = cartItems.find((x) => x.productId === item.productId);

    if (existItem) {
      // Calculate the difference between new and old quantity
      const qtyDiff = item.qty - existItem.qty;
      if (qtyDiff === 0) {
        // No change, just return success
        return { success: true, message: `${product.name} already in cart` };
      }
      // Always fetch latest product stock before updating
      const latestProduct = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!latestProduct) throw new Error("Product not found");
      if (qtyDiff > 0) {
        // Increasing quantity
        if (latestProduct.stock < qtyDiff) throw new Error("Not enough stock");
        existItem.qty = item.qty;
        await prisma.$transaction([
          prisma.cart.update({
            where: { id: cart.id },
            data: {
              items: cartItems as Prisma.CartUpdateitemsInput[],
              ...calcPrice(cartItems as CartItem[]),
            },
          }),
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: latestProduct.stock - qtyDiff },
          }),
        ]);
      } else {
        // Decreasing quantity
        existItem.qty = item.qty;
        await prisma.$transaction([
          prisma.cart.update({
            where: { id: cart.id },
            data: {
              items: cartItems as Prisma.CartUpdateitemsInput[],
              ...calcPrice(cartItems as CartItem[]),
            },
          }),
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: latestProduct.stock + Math.abs(qtyDiff) },
          }),
        ]);
      }
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} quantity updated in cart`,
      };
    } else {
      // New item in cart
      if (product.stock < item.qty) throw new Error("Not enough stock");
      cartItems.push(item);
      await prisma.$transaction([
        prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: cartItems as Prisma.CartUpdateitemsInput[],
            ...calcPrice(cartItems as CartItem[]),
          },
        }),
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.qty },
        }),
      ]);
      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${product.name} added to cart` };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
export async function removeItemFromCart(productId: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // Check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error('Item not found');

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
