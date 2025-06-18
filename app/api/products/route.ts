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
      per_page: per_page * 2, // Request more products to account for filtering
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

    // Filter products that have both a category and a valid price
    const validProducts = response.data
      .filter((product: any) => {
        const price = Number(product.price);
        const hasCategory = product.categories && product.categories.length > 0;
        return !isNaN(price) && price > 0 && hasCategory;
      })
      .map((product: any) => {
        // Process primary category from meta_data
        let primaryCategoryId = null;

        // Look for Yoast SEO primary category in meta_data
        if (product.meta_data) {
          const primaryCategoryMeta = product.meta_data.find(
            (meta: any) => meta.key === "_yoast_wpseo_primary_product_cat"
          );
          if (primaryCategoryMeta) {
            primaryCategoryId = parseInt(primaryCategoryMeta.value);
          }
        }

        // Mark the primary category if found
        if (primaryCategoryId && product.categories) {
          product.categories = product.categories.map((category: any) => ({
            ...category,
            primary: category.id === primaryCategoryId,
          }));
        }

        return product;
      });

    // Take only the requested number of products
    const paginatedProducts = validProducts.slice(0, per_page);

    // Calculate total valid products and pages
    const validTotalProducts = Math.ceil(
      (totalProducts * validProducts.length) / response.data.length
    );
    const validTotalPages = Math.ceil(validTotalProducts / per_page);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        total: validTotalProducts,
        totalPages: validTotalPages,
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
