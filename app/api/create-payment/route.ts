// app/api/create-payment/route.ts
import { NextResponse } from "next/server";
import { createMollieClient } from "@mollie/api-client";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

// Initialize Mollie client
const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY || "test_8mxgBZyUXn6p4TAD9jQ4kjrwCrE3Hi",
});

export async function POST(request: Request) {
  try {
    const { items, shippingAddress, paymentMethod } = await request.json();
    console.log("Received request data:", {
      items,
      shippingAddress,
      paymentMethod,
    });

    // 1. Create order in WooCommerce
    const wooCommerce = getWooCommerceClient();
    const orderData = {
      payment_method: "mollie_wc_gateway_" + paymentMethod,
      payment_method_title: paymentMethod === "ideal" ? "iDEAL" : "Bancontact",
      set_paid: false,
      billing: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        address_1: shippingAddress.address,
        city: shippingAddress.city,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country,
        email: shippingAddress.email,
      },
      shipping: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        address_1: shippingAddress.address,
        city: shippingAddress.city,
        postcode: shippingAddress.postcode,
        country: shippingAddress.country,
      },
      line_items: items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };

    console.log("Creating WooCommerce order with data:", orderData);

    const order = await wooCommerce.post("orders", orderData);
    console.log("WooCommerce order created:", order.data);

    const orderId = order.data.id;
    const totalAmount = parseFloat(order.data.total);
    console.log("Total amount:", totalAmount, "Type:", typeof totalAmount);

    console.log("Creating Mollie payment with data:", {
      amount: {
        currency: "EUR",
        value: totalAmount.toFixed(2).toString(),
      },
      method: paymentMethod,
      description: `Order #${orderId}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?order_id=${orderId}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mollie-webhook`,
      metadata: {
        order_id: orderId,
      },
    });

    // 3. Create Mollie payment
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: totalAmount.toFixed(2),
      },
      method: paymentMethod,
      description: `Order #${orderId}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?order_id=${orderId}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mollie-webhook`,
      metadata: {
        order_id: orderId,
      },
    });

    console.log("Mollie payment created:", payment);

    // 4. Update WooCommerce order with Mollie payment ID
    await wooCommerce.put(`orders/${orderId}`, {
      meta_data: [
        {
          key: "_mollie_payment_id",
          value: payment.id,
        },
      ],
    });

    const checkoutUrl = payment.getCheckoutUrl();
    console.log("Redirecting to checkout URL:", checkoutUrl);

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    // Detailed error logging
    console.error("Payment creation error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.details || "No additional details",
    });

    // Check if it's a Mollie API error
    if (error.details) {
      return NextResponse.json(
        { message: "Mollie API Error: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error creating payment: " + error.message },
      { status: 500 }
    );
  }
}
