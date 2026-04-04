import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrent } from "@/helpers/format-current";
import { CartContext } from "../contexts/cart";
import CartProductItems from "./cart-product-items";
import FinishOrderDialog from "./finish-order-dialog";

const CartSheet = () => {
    const [FinishOrderDialogOpen, setFinishOrderDialogIsOpen] = useState(false); // o estado FinishOrderDialogOpen é um booleano que controla a abertura e fechamento do diálogo de finalização de pedido, e a função setFinishOrderDialogIsOpen é usada para atualizar esse estado quando o usuário clica no botão "Finalizar Pedido", garantindo que o diálogo seja exibido corretamente para o usuário quando ele deseja finalizar a compra, e escondido quando ele fecha o diálogo ou conclui a finalização do pedido.
    const { isOpen, toggleCart, products, total } = useContext(CartContext);
    return (
        <Sheet open={isOpen} onOpenChange={toggleCart}> {/* o componente Sheet é usado para criar uma sacola de compras que desliza a partir da lateral da tela, e as propriedades open e onOpenChange são usadas para controlar a abertura e fechamento da sacola de compras, permitindo que o usuário veja os produtos adicionados à sacola e o total da compra quando a sacola estiver aberta, e escondendo essas informações quando a sacola estiver fechada, melhorando a experiência do usuário ao navegar pelo menu e adicionar produtos à sacola. */}
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