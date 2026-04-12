import { Card, CardContent } from "@/components/ui/card";
import { formatCurrent } from "@/helpers/format-current";
import { OrderStatus, Prisma } from "@prisma/client";
import Image from "next/image";

interface OrderListProps {
    orders: Prisma.OrderGetPayload<{
        include: {
            restaurant: {
                select: {
                    name: true,
                    avatarImageUrl: true
                }
            }
            orderProducts: {
                include: {
                    product: true
                }
            }
        }
    }>[]
}

const getStatusLabel = (status: OrderStatus) => {
    if (status === 'FINISHED') return 'Finalizado'
    if (status === 'IN_PREPARATION') return 'Em preparo'
    if (status === 'PENDING') return 'pendente'
    if (status === 'PAYMENT_CONFIRMED') return 'Pagamento confirmado'
    if (status === 'PAYMENT_FAILED') return 'Pagamento falhou'
    return ""
}

const OrderList = ({ orders }: OrderListProps) => {
    return (
        <div className="space-y-6 p-6">
            {orders.map((order) => {
                return (
                    <Card key={order.id}>
                        <CardContent className="space-y-4 p-5">
                            <div className={`w-fit text-white rounded-full px-2 py-1 text-xs font-semibold
                                ${([OrderStatus.PAYMENT_CONFIRMED, OrderStatus.FINISHED] as OrderStatus[]).includes(order.status) ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"}
                            `}>
                                {getStatusLabel(order.status)}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative h-5 w-5">
                                    <Image
                                        src={order.restaurant.avatarImageUrl}
                                        alt={order.restaurant.name}
                                        className="rounded-sm"
                                        fill
                                    />
                                </div>
                                <p className="text-sm font-semibold">{order.restaurant.name}</p>
                            </div>
                            {/* <Separetor /> npx shadcn@2.3.0 add separetor */}
                            <div className="space-y-2">
                                {order.orderProducts.map(orderProduct => {
                                    return (
                                        <div key={orderProduct.id} className="flex items-center gap-2">
                                            <div className="h-5 w-5 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-semibold">
                                                {orderProduct.quantity}
                                            </div>
                                            <p className="text-sm">{orderProduct.product.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-sm font-medium">{formatCurrent(order.total)}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default OrderList;