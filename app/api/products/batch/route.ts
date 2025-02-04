import { NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("ids[]");

    if (!ids.length) {
      return NextResponse.json([]);
    }

    const wooCommerce = getWooCommerceClient();
    const response = await wooCommerce.get("products", {
      include: ids,
      per_page: 100,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
