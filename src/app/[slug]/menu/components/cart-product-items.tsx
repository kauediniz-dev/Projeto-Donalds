import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrent } from "@/helpers/format-current";
import { CartContext, CartProduct } from "../contexts/cart";

interface CartProductItemsProps { // a interface CartProductItemsProps define a estrutura dos props que o componente CartProductItems espera receber, que inclui um objeto product do tipo CartProduct, representando as informações de um produto específico adicionado à sacola de compras, como nome, preço, imagem e quantidade, permitindo que o componente exiba corretamente essas informações para o usuário.
    product: CartProduct; // o prop product é do tipo CartProduct, que é uma interface que define as propriedades de um produto no carrinho de compras, incluindo id, name, price, imageUrl e quantity, permitindo que o componente CartProductItems acesse e exiba essas informações para o usuário.
}

const CartProductItems = ({ product }: CartProductItemsProps) => { // o componente CartProductItems é responsável por exibir as informações de um produto específico que foi adicionado à sacola de compras, incluindo a imagem, nome, preço e quantidade do produto, além de fornecer botões para aumentar ou diminuir a quantidade do produto e um botão para remover o produto da sacola.
    const { decreaseProductQuantity, increaseProductQuantity, removeProduct } = useContext(CartContext); // useContext é um hook do React que permite acessar o contexto do carrinho de compras, que contém as funções decreaseProductQuantity, increaseProductQuantity e removeProduct.
    return (
        <div className="flex items-center justify-between">
            {/* ESQUERDA */}
            <div className="flex items-center gap-3">
                <div className="relative h-20 w-20 rounded-xl bg-gray-100">
                    <Image src={product.imageUrl} alt={product.name} fill />
                </div>
                <div className="space-y-1">
                    <p className="text-sm max-w-[90%] truncate text-ellipsis">{product.name}</p>
                    <p className="text-sm font-semibold">{formatCurrent(product.price)}</p>
                    {/* QUANTIDADE */}
                    <div className="flex items-center gap-1 text-center">
                        <Button
                            className="h-7 w-7 rounded-lg"
                            variant="outline"
                            onClick={() => decreaseProductQuantity(product.id)}
                        >
                            <ChevronLeftIcon size={16} />
                        </Button>
                        <p className="w-7 text-xs">{product.quantity}</p>
                        <Button
                            className="h-7 w-7 rounded-lg"
                            variant="destructive"
                            onClick={() => increaseProductQuantity(product.id)}
                        >
                            <ChevronRightIcon size={16} />
                        </Button>
                    </div>
                </div>
            </div>
            {/* DIREITA */}
            <Button className="h-7 w-7" variant="outline" onClick={() => removeProduct(product.id)}>
                <TrashIcon />
            </Button>
        </div>
    );
};

export default CartProductItems;