// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "12");
    const category = searchParams.get("category") || "";

    const wooCommerce = getWooCommerceClient();

    // Build query parameters
    const queryParams: any = {
      page,
      per_page,
      orderby: "menu_order",
      order: "asc",
      stock_status: "instock", // Only show products that are in stock
    };

    // Add category filter if provided
    if (category && category !== "ALL") {
      queryParams.category = category;
    }

    const response = await wooCommerce.get("products", queryParams);

    // Get total products and total pages from headers
    const totalProducts = parseInt(response.headers["x-wp-total"] || "0");
    const totalPages = parseInt(response.headers["x-wp-totalpages"] || "0");

    return NextResponse.json({
      products: response.data,
      pagination: {
        total: totalProducts,
        totalPages: totalPages,
        currentPage: page,
        perPage: per_page,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
