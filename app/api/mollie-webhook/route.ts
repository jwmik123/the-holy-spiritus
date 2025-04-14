// app/api/mollie-webhook/route.ts
import { NextResponse } from "next/server";
import { createMollieClient } from "@mollie/api-client";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
});

async function sendOrderConfirmationEmail(
  orderId: number,
  customerEmail: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/order-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          customerEmail,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const paymentId = body.replace("id=", "");
    console.log("Received webhook for payment:", paymentId);

    const payment: any = await mollieClient.payments.get(paymentId);
    console.log("Payment status:", payment.status);

    const orderId = payment.metadata.order_id;
    const wooCommerce = getWooCommerceClient();

    // Get the order to retrieve customer email
    const orderResponse = await wooCommerce.get(`orders/${orderId}`);
    const order = orderResponse.data;
    const customerEmail = order.billing.email;

    switch (payment.status) {
      case "paid":
        console.log("Payment is paid, updating order status to processing");
        await wooCommerce.put(`orders/${orderId}`, {
          status: "processing",
        });

        // Send the order confirmation email
        console.log(`Sending order confirmation email to ${customerEmail}`);
        const emailSent = await sendOrderConfirmationEmail(
          orderId,
          customerEmail
        );
        console.log(
          `Order confirmation email ${
            emailSent ? "sent successfully" : "failed to send"
          }`
        );
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
