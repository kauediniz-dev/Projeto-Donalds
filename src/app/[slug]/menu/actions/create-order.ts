"use server";

import { db } from "@/lib/prisma";
import { ConsumptionMethod, OrderStatus } from "@prisma/client";
import { removeCpfPoctuation } from "../helpers/cpf";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface createOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}

//  É como uma rota de API
export const createOrder = async (input: createOrderInput) => {
  // essa server action é como uma rota de API que recebe os dados necessários para criar um pedido.
  const restaurant = await db.restaurant.findUnique({
    where: {
      slug: input.slug,
    },
  });
  if (!restaurant) {
    throw new Error(`Restaurant ${input.slug} not found`);
  }
  const produceWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const productsWithPricesQuantities = input.products.map((product) => {
    const dbProduct = produceWithPrices.find((p) => p.id === product.id);

    if (!dbProduct) {
      throw new Error(`Product ${product.id} not found`);
    }

    return {
      productId: product.id,
      quantity: product.quantity,
      price: dbProduct.price,
    };
  });

  const total = productsWithPricesQuantities.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  await db.order.create({
    data: {
      status: OrderStatus.PENDING,
      customerName: input.customerName,
      customerCpf: removeCpfPoctuation(input.customerCpf),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
      total,
      orderProducts: {
        createMany: {
          data: productsWithPricesQuantities,
        },
      },
    },
  });
  revalidatePath(`/${input.slug}/orders`); // revalida a página de pedidos do restaurante para que o novo pedido apareça na lista de pedidos sem precisar atualizar a página manualmente, garantindo que os dados exibidos estejam sempre atualizados.
  redirect(
    `/${input.slug}/orders?cpf=${removeCpfPoctuation(input.customerCpf)}`,
  );
};
