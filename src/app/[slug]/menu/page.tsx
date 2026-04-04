
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
    params: Promise<{ slug: string }>; //
    searchParams: Promise<{ consumptionMethod: string }> // os parâmetros de busca são os parâmetros que são passados na url, como por exemplo, o método de consumo, que é passado como parâmetro na url quando o usuário clica em uma das opções de consumo, e é usado para filtrar os produtos do restaurante, mostrando apenas os produtos que estão disponíveis para o método de consumo selecionado pelo usuário
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
    return ["DINE_IN", "TAKEWAY"].includes(consumptionMethod.toLocaleUpperCase());
};

const RestaurantMenuPage = async ({ params, searchParams }: RestaurantMenuPageProps) => {
    const { slug } = await params;
    const { consumptionMethod } = await searchParams;
    if (!isConsumptionMethodValid(consumptionMethod)) {
        return notFound();
    }
    const restaurant = await db.restaurant.findUnique({
        where: { slug },
        include: {
            menuCategory: {
                include: {
                    products: true
                }
            }
        },
    });
    if (!restaurant) {
        return notFound();
    }
    return (
        <div>
            <RestaurantHeader restaurant={restaurant} />
            <RestaurantCategories restaurante={restaurant} />
        </div>
    );
}

export default RestaurantMenuPage;