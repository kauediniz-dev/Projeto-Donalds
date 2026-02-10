import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrent } from "@/helpers/format-current";

import { CartContext } from "../contexts/cart";
import CartProductItems from "./cart-product-items";
import FinishOrderDialog from "./finish-order-dialog";

const CartSheet = () => {
    const [FinishOrderDialogOpen, setFinishOrderDialogIsOpen] = useState(false);
    const { isOpen, toggleCart, products, total } = useContext(CartContext);
    return (
        <Sheet open={isOpen} onOpenChange={toggleCart}>
            <SheetContent className="w-[80%]">
                <SheetHeader>
                    <SheetTitle className="text-left">Sacola</SheetTitle>
                </SheetHeader>
                <div className="py-5 flex flex-col h-full">
                    <div className="flex-auto">
                        {products.map((product) => (
                            <CartProductItems key={product.id} product={product} />
                        ))}
                    </div>
                    <Card className="mb-6">
                        <CardContent className="p-5">
                            <div className="flex justify-between">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-sm font-semibold">{formatCurrent(total)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button className="w-full rounded-full" onClick={() => setFinishOrderDialogIsOpen(true)}>Finalizar Pedido</Button>
                    <FinishOrderDialog open={FinishOrderDialogOpen} onOpenChange={setFinishOrderDialogIsOpen} />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartSheet;