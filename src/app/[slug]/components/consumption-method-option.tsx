import { ConsumptionMethod } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConsumptionMethodOptionProps { //eslint-disable-line
    slug: string;
    imageUrl: string;
    imageAlt: string;
    buttonText: string;
    option: ConsumptionMethod
}

const ConsumptionMethodOption = ({
    slug,
    imageUrl,
    imageAlt,
    buttonText,
    option

}: ConsumptionMethodOptionProps) => {
    return (<Card> {/* o componente de opção de consumo é um card que contém uma imagem e um botão, que redireciona para a página de menu do restaurante, passando o slug e a opção de consumo como parâmetros */}
        <CardContent className="flex flex-col items-center gap-8 py-8">
            <div className="relative h-[80px] w-[78px]">
                <Image src={imageUrl} fill alt={imageAlt} className="object-contain" />
            </div>
            <Button variant="secondary" className="rounded-full" asChild>
                <Link href={`/${slug}/menu?consumptionMethod=${option}`}>
                    {buttonText}
                </Link>
            </Button>
        </CardContent>
    </Card>);
}

export default ConsumptionMethodOption;