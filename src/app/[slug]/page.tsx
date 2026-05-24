import Image from "next/image";
import { notFound } from "next/navigation";

import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";

import ConsumptionMethodOption from "./components/consumption-method-option";

interface RestaurantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => { // o slug é o identificador do restaurante, que é passado na url, e é usado para buscar as informações do restaurante no banco de dados
  const { slug } = await params;

  const restaurant = await getRestaurantBySlug(slug); // busca as informações do restaurante no banco de dados, usando o slug como identificador

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between px-6 py-10">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant.avatarImageUrl}
          alt={restaurant.name}
          width={82}
          height={82}
        />

        <h2 className="font-semibold">{restaurant.name}</h2>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <h3 className="text-2xl font-semibold">Seja bem-vindo</h3>

        <p className="opacity-55">
          Escolha como prefere aproveitar sua refeição.
          Estamos oferecendo praticidade e sabor em cada detalhe
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <ConsumptionMethodOption
          slug={slug}
          buttonText="Para comer aqui"
          imageUrl="/dine_in.png"
          imageAlt="Comer aqui"
          option="DINE_IN"
        />

        <ConsumptionMethodOption
          slug={slug}
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
