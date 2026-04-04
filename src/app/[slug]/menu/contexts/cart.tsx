"use client";
import { Product } from "@prisma/client";
import { createContext, useState } from "react";

export interface CartProduct extends Pick<Product, "id" | "name" | "price" | "imageUrl"> { // o Pick<> permite escolher quais propriedades do objeto Product queremos incluir na interface CartProduct, garantindo que a interface CartProduct tenha apenas as propriedades necessárias para representar um produto no carrinho de compras, e a propriedade quantity é adicionada para controlar a quantidade de cada produto no carrinho, permitindo que o usuário adicione múltiplas unidades do mesmo produto e que o total da compra seja calculado corretamente com base na quantidade de cada produto.
    quantity: number;
}

export interface ICartContext {
    isOpen: boolean; // a propriedade isOpen é um booleano que indica se a sacola de compras está aberta ou fechada, e é usada para controlar a exibição da sacola de compras na interface do usuário, permitindo que o usuário veja os produtos adicionados à sacola e o total da compra quando a sacola estiver aberta, e escondendo essas informações quando a sacola estiver fechada, melhorando a experiência do usuário ao navegar pelo menu e adicionar produtos à sacola.
    products: CartProduct[];
    total: number;
    totalQuantity: number;
    toggleCart: () => void;
    addProduct: (product: CartProduct) => void;
    decreaseProductQuantity: (productId: string) => void;
    increaseProductQuantity: (productId: string) => void;
    removeProduct: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
    isOpen: false,
    products: [],
    total: 0,
    totalQuantity: 0,
    toggleCart: () => { },
    addProduct: () => { },
    decreaseProductQuantity: () => { },
    increaseProductQuantity: () => { },
    removeProduct: () => { },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => { // o componente CartProvider é um server component, quando eu exporto ele como children para um client component, ele é convertido automaticamente para um client component, permitindo que o estado e as funções de manipulação de produtos sejam compartilhados entre os componentes filhos, e o CartProvider é usado para envolver os componentes que precisam acessar o contexto do carrinho, garantindo que eles tenham acesso às informações e funcionalidades do carrinho de compras.
    const [products, setProducts] = useState<CartProduct[]>([]); // o estado products é um array de objetos do tipo CartProduct, que representa os produtos atualmente adicionados ao carrinho de compras, e a função setProducts é usada para atualizar esse estado quando o usuário adiciona, remove ou altera a quantidade de produtos no carrinho, garantindo que a interface do usuário seja atualizada corretamente para refletir as mudanças no carrinho de compras.
    const [isOpen, setIsOpen] = useState<boolean>(false); // o usestate isOpen é um booleano que controla a abertura e fechamento da sacola de compras, e a função setIsOpen é usada para atualizar esse estado quando o usuário clica no botão para abrir ou fechar a sacola, garantindo que a sacola seja exibida corretamente para o usuário quando ele deseja ver os produtos adicionados à sacola e o total da compra, e escondida quando ele fecha a sacola, melhorando a experiência do usuário ao navegar pelo menu e adicionar produtos à sacola.

    const total = products.reduce((acc, product) => { // o método reduce é usado para calcular o total da compra somando o preço de cada produto multiplicado pela quantidade, e o valor inicial do acumulador é 0, garantindo que o total seja calculado corretamente com base nos produtos atualmente adicionados ao carrinho de compras, e atualizado sempre que um produto é adicionado, removido ou tem sua quantidade alterada.
        return acc + (product.price * product.quantity);
    }, 0);
    const totalQuantity = products.reduce((acc, product) => {
        return acc + product.quantity;
    }, 0);
    const toggleCart = () => {
        setIsOpen((prev) => !prev);
    };
    const addProduct = (product: CartProduct) => {
        const productIsAlreadyOnTheCart = products.some(
            (prevProduct) => prevProduct.id === product.id); // o prevProduct é um objeto do tipo CartProduct que representa um produto atualmente presente no carrinho de compras, e a função some é usada para verificar se existe algum produto no carrinho que tenha o mesmo id do produto que está sendo adicionado, retornando true se o produto já estiver no carrinho e false caso contrário, garantindo que o sistema possa identificar corretamente quando um produto já foi adicionado ao carrinho e atualizar a quantidade em vez de adicionar um novo item ao carrinho, melhorando a experiência do usuário ao gerenciar os produtos no carrinho de compras.
        if (!productIsAlreadyOnTheCart) {
            return setProducts((prev) => [...prev, product]);
        }
        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                if (prevProduct.id === product.id) {
                    return {
                        ...prevProduct,
                        quantity: prevProduct.quantity + product.quantity
                    };
                }
                return prevProduct;
            });
        });
    };
    const decreaseProductQuantity = (productId: string) => {
        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                if (prevProduct.id !== productId) {
                    return prevProduct;
                }
                if (prevProduct.quantity === 1) {
                    return prevProduct;
                }
                return {
                    ...prevProduct,
                    quantity: prevProduct.quantity - 1
                };
            });
        })
    };
    const increaseProductQuantity = (productId: string) => {
        setProducts(prevProducts => {
            return prevProducts.map(prevProduct => {
                if (prevProduct.id !== productId) {
                    return prevProduct;
                }
                return {
                    ...prevProduct,
                    quantity: prevProduct.quantity + 1
                };
            });
        })
    };
    const removeProduct = (productId: string) => {
        setProducts(prevProducts => prevProducts.filter(prevProduct => prevProduct.id !== productId));
    };
    return (
        <CartContext.Provider value={{
            isOpen,
            products,
            total,
            totalQuantity,
            toggleCart,
            addProduct,
            decreaseProductQuantity,
            increaseProductQuantity,
            removeProduct
        }}
        >
            {children} {/* o children é um prop especial do React que representa os elementos filhos que são passados para o componente CartProvider, e ao renderizar {children} dentro do CartContext.Provider, estamos garantindo que todos os componentes filhos que estão envolvidos pelo CartProvider tenham acesso ao contexto do carrinho de compras, permitindo que eles possam acessar as informações e funcionalidades do carrinho de compras, como os produtos adicionados, o total da compra e as funções para manipular os produtos no carrinho, melhorando a experiência do usuário ao navegar pelo menu e gerenciar os produtos no carrinho de compras. */}
        </CartContext.Provider>
    )
}