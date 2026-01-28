import { db } from "@/lib/prisma";

export const getRestaurantBySlug = async (slug: string) => {
    // aqui eu vou chamar o banco de dados
    const restaurant = await db.restaurant.findUnique({ where: { slug } });
    return restaurant;
}