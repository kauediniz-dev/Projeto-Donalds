"use server";

import { Order } from "@prisma/client";


interface createOrderInput {
    customerName: string;
    customerCpf: string;
    products: Array<{
        id: string;
        price: number;
        quantity: number;
    }>;
    consumptionMethod: string;
    restaurantId: string;
}

export const createOrder = async (input: createOrderInput) => {

}