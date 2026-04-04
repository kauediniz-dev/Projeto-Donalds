import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { formatCurrent } from "@/helpers/format-current";

interface ProductsProps {
    products: Product[];
}

const Products = ({ products }: ProductsProps) => {
    const { slug } = useParams<{ slug: string }>(); // essa função useParams do Next.js é usada para acessar os parâmetros da url, e o slug do restaurante é obtido dos parâmetros da url, para que os links dos produtos possam redirecionar para a página de detalhes do produto correta, passando o slug do restaurante como parâmetro na url, e também para que a página de detalhes do produto possa mostrar as informações corretas do produto, filtrando os produtos pelo slug do restaurante, e mostrando apenas os produtos do restaurante selecionado pelo usuário
    const searchParams = useSearchParams();
    const consumptionMethod = searchParams.get("consumptionMethod"); // o método de consumo é obtido dos parâmetros de busca da url, usando a função useSearchParams do Next.js, que é uma função de navegação que permite acessar os parâmetros de busca da url, e o método de consumo é usado para filtrar os produtos do restaurante, mostrando apenas os produtos que estão disponíveis para o método de consumo selecionado pelo usuário
    return (
        <div className="space-y-3 px-5 py-3">
            {products.map((product) => ( // os produtos são renderizados em uma lista, e cada produto é um link que redireciona para a página de detalhes do produto, passando o slug do restaurante, o id do produto e o método de consumo como parâmetros na url, para que a página de detalhes do produto possa mostrar as informações corretas do produto, e também mostrar as opções de personalização do produto, caso existam, filtrando as opções de personalização pelo método de consumo selecionado pelo usuário
                <Link key={product.id}
                    href={`/${slug}/menu/${product.id}?consumptionMethod=${consumptionMethod}`}
                    className="flex items-center justify-between gap-10 py-3 border-b"
                >
                    <div>
                        <h3 className="text-md font-medium">{product.name}</h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {product.description}
                        </p>
                        <p className="pt-3 text-sm font-semibold">
                            {formatCurrent(product.price)}
                        </p>
                    </div>
                    <div className="relative min-h-[82px] min-w-[120px]">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain rounded-lg"
                        />
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Products;