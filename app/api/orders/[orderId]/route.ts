// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

export async function GET(request: NextRequest, { params }: any) {
  const orderId = params?.orderId;

  if (!orderId) {
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const wooCommerce = getWooCommerceClient();
    console.log("Fetching order:", orderId);

    const response = await wooCommerce.get(`orders/${orderId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Error fetching order" },
      { status: 500 }
    );
  }
}
