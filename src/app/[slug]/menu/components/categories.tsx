"use client";
import { Prisma, Restaurant } from "@prisma/client";
import { Car, ClockIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Products from "./products";
import { CartContext } from "../contexts/cart";
import { format } from "path";
import { formatCurrent } from "@/helpers/format-current";
import CartSheet from "./cart-sheet";

interface RestaurantCategoriesProps {
    restaurante: Prisma.RestaurantGetPayload<{
        include: {
            menuCategory: {
                include: {
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

const RestaurantCategories = ({ restaurante }: RestaurantCategoriesProps) => {
    const [selectedCategory, setSelectedCategory] = useState<MenuCategoryWithProducts>(
        restaurante.menuCategory[0]
    );
    const { products, total, toggleCart, totalQuantity } = useContext(CartContext);
    const handleCategoryClick = (category: MenuCategoryWithProducts) => {
        setSelectedCategory(category);
    }
    const getCategoryButtonVariant = (category: MenuCategoryWithProducts) => {
        return selectedCategory?.id === category.id ? "default" : "secondary";
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
