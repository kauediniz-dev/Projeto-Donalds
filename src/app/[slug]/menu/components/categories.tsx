"use client";
import {  Prisma, Restaurant } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Products from "./products";

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
            </div>
        </div>
    );
}

export default RestaurantCategories;
