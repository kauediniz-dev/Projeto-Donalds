"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";

const OrderHeader = () => {
    const router = useRouter();

    const handleBackClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/"); // fallback
        }
    };

    return (
        <div className="space-y-6 p-6">
            <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={handleBackClick}
            >
                <ChevronLeftIcon />
            </Button>

            <div className="flex items-center gap-3">
                <ScrollTextIcon />
                <h2 className="text-lg font-semibold">
                    Meus Pedidos
                </h2>
            </div>
        </div>
    );
};

export default OrderHeader;