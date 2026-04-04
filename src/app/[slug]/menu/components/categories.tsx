"use client";
import { Prisma } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Products from "./products";
import { CartContext } from "../contexts/cart";
import { formatCurrent } from "@/helpers/format-current";
import CartSheet from "./cart-sheet";

interface RestaurantCategoriesProps {
    restaurante: Prisma.RestaurantGetPayload<{
        include: {
            menuCategory: {
                include: { // é como se fosse um join no banco de dados, onde eu incluo os produtos dentro de cada categoria, para que eu possa mostrar os produtos de cada categoria na página de menu do restaurante, sem precisar fazer uma nova consulta ao banco de dados para buscar os produtos de cada categoria, o que otimiza a performance da aplicação, e evita consultas desnecessárias ao banco de dados
                    products: true;
                };
            };
        };
    }>;
}

type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<{
    include: {
        products: true;
    };
}>;

const RestaurantCategories = ({ restaurante }: RestaurantCategoriesProps) => { // o componente de categorias do restaurante é responsável por mostrar as categorias do restaurante, e os produtos de cada categoria, além de permitir que o usuário adicione os produtos ao carrinho, usando o contexto de carrinho para gerenciar os produtos adicionados, e mostrar o total dos pedidos e a quantidade de itens no carrinho, além de permitir que o usuário veja a sacola com os itens adicionados
    const [selectedCategory, setSelectedCategory] = useState<MenuCategoryWithProducts>( // o estado selectedCategory é usado para armazenar a categoria selecionada pelo usuário, e mostrar os produtos dessa categoria, inicialmente, a categoria selecionada é a primeira categoria do restaurante, que é acessada através do restaurante.menuCategory[0], que é a primeira categoria do restaurante, e que inclui os produtos dessa categoria, graças ao include feito na consulta do banco de dados na página de menu do restaurante
        restaurante.menuCategory[0]
    );
    const { products, total, toggleCart, totalQuantity } = useContext(CartContext); // o contexto de carrinho é usado para gerenciar os produtos adicionados ao carrinho, e mostrar o total dos pedidos e a quantidade de itens no carrinho, além de permitir que o usuário veja a sacola com os itens adicionados, usando a função toggleCart para mostrar ou esconder a sacola, e as variáveis products, total e totalQuantity para mostrar os produtos adicionados, o total dos pedidos e a quantidade de itens no carrinho, respectivamente
    const handleCategoryClick = (category: MenuCategoryWithProducts) => {
        setSelectedCategory(category);
    }
    const getCategoryButtonVariant = (category: MenuCategoryWithProducts) => {
        return selectedCategory?.id === category.id ? "default" : "secondary"; // a função getCategoryButtonVariant é usada para definir a variante do botão da categoria, para que o botão da categoria selecionada tenha uma aparência diferente dos outros botões, usando a variante "default" para a categoria selecionada, e a variante "secondary" para as outras categorias, comparando o id da categoria com o id da categoria selecionada
    }

    return (
        <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl  bg-white">
            <div className="p-5">
                <div className="flex items-center gap-3 ">
                    <Image
                        src={restaurante.avatarImageUrl}
                        alt={restaurante.name}
                        height={45}
                        width={45}
                    />
                    <div>
                        <h2 className="text-lg font-semibold">{restaurante.name}</h2>
                        <p className="text-xs opacity-55">{restaurante.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500 mt-3">
                    <ClockIcon size={12} />
                    <p>Aberto!</p>
                </div>
                <ScrollArea className="w-full">
                    <div className="flex w-max space-x-4 pb-2 pt-3 p-1">
                        {restaurante.menuCategory.map(category => (
                            <Button onClick={() => handleCategoryClick(category)} key={category.id} variant={getCategoryButtonVariant(category)}
                                size="sm" className="rounded-full">
                                {category.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <h3 className="px-5 pt-2 font-semibold">{selectedCategory.name}</h3>
                <Products products={selectedCategory.products} />
                {products.length > 0 && (
                    <div className="fixed bottom-0 z-50 flex w-full items-center justify-between border-t bg-white px-5 py-2">
                        <div className="flex items-center gap-4">
                            <p className="text-xs text-muted-foreground">Total dos pedidos</p>
                            <p className="text-sm font-semibold">{formatCurrent(total)}
                                <span className="text-xs text-muted-foreground">
                                    / {totalQuantity} {totalQuantity === 1 ? "item" : "itens"}
                                </span>
                            </p>
                        </div>
                        <Button onClick={toggleCart}>Ver sacola</Button>
                        <CartSheet />
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestaurantCategories;
