import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import Image from "next/image";
import { notFound } from "next/navigation";
import ConsumptionMethodOption from "./components/consumption-method-option";

interface RestaurantPageProps {
  params: {
    slug: string;
  };
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = params;

  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 pt-24">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant.avatarImageUrl}
          alt={restaurant.name}
          width={82}
          height={82}
        />
        <h2 className="font-semibold">{restaurant.name}</h2>
      </div>

      <div className="p-24 text-center space-y-2">
        <h3 className="text-2xl font-semibold">Seja bem-vindo</h3>
        <p className="opacity-55">
          Escolha como prefere aproveitar sua refeição. Estamos oferecendo
          praticidade e sabor em cada detalhe
        </p>
      </div>
      <div className="pt-14 grid grid-cols-2 gap-4">
        <ConsumptionMethodOption
            buttonText="Para comer aqui"
            imageUrl="/dine_in.png"
            imageAlt="Comer aqui"
            option="DINE_IN"
        />
        <ConsumptionMethodOption
            buttonText="Para levar"
            imageUrl="/take_way.png"
            imageAlt="Para levar"
            option="TAKEWAY"
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
