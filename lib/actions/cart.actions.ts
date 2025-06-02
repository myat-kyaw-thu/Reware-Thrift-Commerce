"use server"

import { CartItem } from "../../types"
import { round2 } from "../utils"

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
  }
}
