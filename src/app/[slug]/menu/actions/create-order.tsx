"use server";

import { db } from "@/lib/prisma";
import { ConsumptionMethod, Order, OrderStatus } from "@prisma/client";
import { da } from "zod/v4/locales";
import { removeCpfPoctuation } from "../helpers/cpf";


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
    const restaurant = await db.restaurant.findUnique({
        where: {
            slug: input.slug,
        }
    })
    if (!restaurant) {
        throw new Error(`Restaurant ${input.slug} not found`)
    }
    const produceWithPrices = await db.product.findMany({
        where: {
            id: {
                in: input.products.map((product) => product.id),
            },
        },
    });
    const productsWithPricesQuantities = input.products.map((product) => {
        const dbProduct = produceWithPrices.find(p => p.id === product.id)

        if (!dbProduct) {
            throw new Error(`Product ${product.id} not found`)
        }

        return {
            productId: product.id,
            quantity: product.quantity,
            price: dbProduct.price
        }
    })

    await db.order.create({
        data: {
            status: "PENDING",
            customerName: input.customerName,
            customerCpf: removeCpfPoctuation(input.customerCpf),
            consumptionMethod: input.consumptionMethod,
            restaurantId: restaurant.id,
            total: 0, // por enquanto
            orderProducts: {
                createMany: {
                    data: input.products.map((product) => ({
                        productId: product.id,
                        quantity: product.quantity,
                        price: produceWithPrices.find(
                            (p) => p.id === product.id
                        )!.price
                    }))
                }
            }
        }
    })
}