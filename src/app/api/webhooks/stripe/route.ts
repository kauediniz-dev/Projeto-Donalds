import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    console.log("=== WEBHOOK HIT ===");

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    console.log("Webhook secret exists:", !!webhookSecret);
    console.log("Stripe secret exists:", !!secretKey);

    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    if (!secretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    });

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    const text = await request.text();
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const orderId = event.data.object.metadata?.orderId;

        if (!orderId) {
          return NextResponse.json({
            received: true,
            reason: "missing orderId",
          });
        }

        const existingOrder = await db.order.findUnique({
          where: { id: Number(orderId) },
        });

        if (!existingOrder) {
          return NextResponse.json({
            received: true,
            reason: "order not found",
          });
        }

        const order = await db.order.update({
          where: {
            id: Number(orderId),
          },
          data: {
            status: OrderStatus.PAYMENT_CONFIRMED,
          },
          include: {
            restaurant: {
              select: {
                slug: true,
              },
            },
          },
        });
        revalidatePath(`/${order.restaurant.slug}/orders`);
        break;
      }

      case "charge.failed": {
        const orderId = event.data.object.metadata?.orderId;

        if (!orderId) {
          return NextResponse.json({
            received: true,
            reason: "missing orderId",
          });
        }

        const existingOrder = await db.order.findUnique({
          where: { id: Number(orderId) },
        });

        if (!existingOrder) {
          return NextResponse.json({
            received: true,
            reason: "order not found",
          });
        }

        const order = await db.order.update({
          where: {
            id: Number(orderId),
          },
          data: {
            status: OrderStatus.PAYMENT_FAILED,
          },
          include: {
            restaurant: {
              select: {
                slug: true,
              },
            },
          },
        });
        revalidatePath(`/${order.restaurant.slug}/orders`);
        break;
      }
      default:
        return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown webhook error",
      },
      { status: 400 },
    );
  }
}
