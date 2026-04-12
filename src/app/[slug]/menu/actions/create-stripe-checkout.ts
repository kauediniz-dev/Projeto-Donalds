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
  // aqui estamos usando destructuring para pegar os produtos do input
  orderId,
  products,
  slug,
  consumptionMethod,
  cpf,
}: CreateStripeCheckoutInput) => {
  try {
    const origin = (await headers()).get("origin") as string;
    const produceWithPrices = await db.product.findMany({
      where: {
        id: {
          in: products.map((product) => product.id),
        },
      },
    });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // aqui estamos usando o process.env.STRIPE_SECRET_KEY para pegar a chave privada do stripe
      apiVersion: "2025-02-24.acacia",
    });
    const searchParams = new URLSearchParams();
    searchParams.set("consumptionMethod", consumptionMethod);
    searchParams.set("cpf", removeCpfPoctuation(cpf));
    const session = await stripe.checkout.sessions.create({
      // aqui estamos criando a sessão de checkout do stripe
      payment_method_types: ["card", "boleto"],
      mode: "payment",
      success_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
      cancel_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
      metadata: {
        orderId: String(orderId), // aqui estamos enviando o ID do pedido nos metadados da sessão de checkout, para que possamos usar esse ID no webhook do stripe para atualizar o status do pedido no banco de dados
      },
      line_items: products.map((product) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(
            Number(produceWithPrices.find((p) => p.id === product.id)!.price) *
              100,
          ),
        },
        quantity: product.quantity,
      })),
    });
    return { sessionId: session.id };
  } catch (error) {
    console.error(error);
  }
};
