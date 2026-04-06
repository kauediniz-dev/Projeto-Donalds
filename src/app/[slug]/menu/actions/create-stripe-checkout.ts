"use server";

import Stripe from "stripe";
import { CartProduct } from "../contexts/cart";

interface CreateStripeCheckoutInput {
  products: CartProduct[];
}

export const createStripeCheckout = async ({
  products,
}: CreateStripeCheckoutInput) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "pix", "boleto"],
    mode: "payment",
    line_items: products.map((product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
        unit_amount: product.price * 100, // O Stripe espera o valor em centavos
      },
      quantity: product.quantity,
    })),
  });
  return { sessionId: session.id };
};
