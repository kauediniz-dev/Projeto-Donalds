import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import { db } from "@/lib/prisma";
import { get } from "http";
import Image from "next/image";
import { notFound } from "next/navigation";

interface RestaurantPageProps {
    params: Promise<{ slug: string }>;  
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
    const { slug } = await params;
    const restaurant = await getRestaurantBySlug(slug);
    if (!restaurant) {
        return notFound;
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center px-6 pt-24">
            <div className="flex flex-col items-center gap-2">
                <Image src={restaurant?.avatarImageUrl} alt={restaurant.name} width={82} height={82} />
                <h2 className="font-semibold">
                    {restaurant.name}
                </h2>
            </div>
        </div>
    );
};
export default RestaurantPage;