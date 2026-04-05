"use client";

import { Restaurant } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface RestaurantHeaderProps {
  restaurant: Pick<Restaurant, "name" | "coverImageUrl">;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const { slug } = useParams<{ slug: string }>(); // o hook useParams é usado para acessar os parâmetros da rota, e o parâmetro slug é extraído para ser usado na construção do caminho da página de pedidos do restaurante, garantindo que o usuário seja levado para a página correta de pedidos do restaurante selecionado.
  const router = useRouter();
  const handleBackClick = () => router.back(); // a função handleBackClick é usada para voltar para a página anterior, usando a função router.back() do Next.js, que é uma função de navegação que volta para a página anterior na pilha de navegação do navegador
  const handleOrdersClick = () => router.push(`/${slug}/orders`); // a função handleOrdersClick é usada para navegar para a página de pedidos do restaurante, usando a função router.push() do Next.js, que é uma função de navegação que leva o usuário para uma nova página, e o caminho da página de pedidos é construído dinamicamente usando o slug do restaurante, garantindo que o usuário seja levado para a página correta de pedidos do restaurante selecionado.
  return (
    <div className="w-full relative h-[250px]">
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-4 z-50 rounded-full"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>

      <Image
        src={restaurant.coverImageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
      />

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-4 top-4 z-50 rounded-full"
        onClick={handleOrdersClick}
      >
        <ScrollTextIcon />
      </Button>
    </div>
  );
};

export default RestaurantHeader;
