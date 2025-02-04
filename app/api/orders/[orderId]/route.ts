// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  if (!params?.orderId) {
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const wooCommerce = getWooCommerceClient();
    const orderId = await Promise.resolve(params.orderId);
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
