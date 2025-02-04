// app/api/mollie-webhook/route.ts
import { NextResponse } from "next/server";
import { createMollieClient } from "@mollie/api-client";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const paymentId = body.replace("id=", "");
    console.log("Received webhook for payment:", paymentId);

    const payment: any = await mollieClient.payments.get(paymentId);
    console.log("Payment status:", payment.status);

    const orderId = payment.metadata.order_id;
    const wooCommerce = getWooCommerceClient();

    switch (payment.status) {
      case "paid":
        console.log("Payment is paid, updating order status to processing");
        await wooCommerce.put(`orders/${orderId}`, {
          status: "processing",
        });
        break;

      case "failed":
      case "expired":
      case "canceled":
        console.log("Payment failed/expired/canceled, updating order status");
        await wooCommerce.put(`orders/${orderId}`, {
          status: "cancelled",
        });
        break;

      case "pending":
        console.log("Payment is pending");
        await wooCommerce.put(`orders/${orderId}`, {
          status: "pending",
        });
        break;

      default:
        console.log("Unhandled payment status:", payment.status);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
