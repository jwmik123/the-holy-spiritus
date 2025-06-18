// app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

export async function GET(request: NextRequest, { params }: any) {
  if (!params?.slug) {
    return NextResponse.json(
      { message: "Product slug is required" },
      { status: 400 }
    );
  }

  try {
    const wooCommerce = getWooCommerceClient();
    const slug = params.slug;

    // First, we need to find the product by slug
    const productsResponse = await wooCommerce.get("products", {
      slug: slug,
      stock_status: "instock",
    });

    if (!productsResponse.data || productsResponse.data.length === 0) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Get the first product from the response (slug should be unique)
    const product = productsResponse.data[0];

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

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}
