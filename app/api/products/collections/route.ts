import { NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

export async function GET() {
  try {
    const wooCommerce = getWooCommerceClient();
    const response = await wooCommerce.get("products/categories", {
      per_page: 15,
    });

    // Log the response data to help diagnose image issues
    console.log("Categories response:", JSON.stringify(response.data, null, 2));

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("WooCommerce API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
