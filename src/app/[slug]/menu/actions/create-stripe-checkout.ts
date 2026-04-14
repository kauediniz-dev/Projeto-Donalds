"use server";

import Stripe from "stripe";
import { CartProduct } from "../contexts/cart";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { ConsumptionMethod } from "@prisma/client";
import { removeCpfPoctuation } from "../helpers/cpf";

interface CreateStripeCheckoutInput {
  products: CartProduct[];
  orderId: number;
  slug: string;
  consumptionMethod: ConsumptionMethod;
  cpf: string;
}

export const createStripeCheckout = async ({
  orderId,
  products,
  slug,
  consumptionMethod,
  cpf,
}: CreateStripeCheckoutInput): Promise<{ sessionId: string }> => {
  try {
    const origin = (await headers()).get("origin");

    if (!origin) {
      throw new Error("Origin não encontrado.");
    }

    const productsWithPrices = await db.product.findMany({
      where: {
        id: {
          in: products.map((product) => product.id),
        },
      },
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });

    const searchParams = new URLSearchParams();
    searchParams.set("consumptionMethod", consumptionMethod);
    searchParams.set("cpf", removeCpfPoctuation(cpf));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      mode: "payment",
      success_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
      cancel_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
      metadata: {
        orderId: String(orderId),
      },
      line_items: products.map((product) => {
        const dbProduct = productsWithPrices.find((p) => p.id === product.id);

        if (!dbProduct) {
          throw new Error(`Produto ${product.id} não encontrado.`);
        }

        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: dbProduct.name,
              images: [dbProduct.imageUrl],
            },
            unit_amount: Math.round(Number(dbProduct.price) * 100),
          },
          quantity: product.quantity,
        };
      }),
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    throw new Error("Erro ao criar sessão de checkout.");
  }
};
