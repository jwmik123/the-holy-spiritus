// app/api/coupons/validate/route.ts
import { NextResponse } from "next/server";
import { getWooCommerceClient } from "@/utils/woocommerce.server";

interface CouponValidateRequest {
  code: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: CouponValidateRequest = await request.json();
    const { code, items } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Geen couponcode opgegeven" },
        { status: 400 }
      );
    }

    console.log(`Validating coupon code: ${code}`);
    const wooCommerce = getWooCommerceClient();

    // Log that we're about to make the API call
    console.log("Making WooCommerce API call to fetch coupon");

    try {
      // First, try to fetch all coupons to see if API is working
      const allCouponsResponse = await wooCommerce.get("coupons");
      console.log(
        `Found ${allCouponsResponse.data.length} total coupons in system`
      );
    } catch (err) {
      console.error("Error fetching all coupons:", err);
    }

    // Now try to get the specific coupon, with different approach
    // Note: Some WooCommerce installations have issues with the 'code' parameter
    // So we'll fetch all coupons and filter manually
    const couponsResponse = await wooCommerce.get("coupons");
    console.log(`Total coupons returned: ${couponsResponse.data.length}`);

    // Find the coupon with the matching code (case-insensitive)
    const coupon = couponsResponse.data.find(
      (c: any) => c.code.toLowerCase() === code.toLowerCase()
    );

    // Check if the coupon exists
    if (!coupon) {
      console.log(`No coupon found with code: ${code}`);
      return NextResponse.json(
        { valid: false, message: "Ongeldige couponcode" },
        { status: 200 }
      );
    }

    console.log("Coupon found:", {
      id: coupon.id,
      code: coupon.code,
      status: coupon.status,
      enabled: coupon.enabled,
      discount_type: coupon.discount_type,
      amount: coupon.amount,
    });

    // Check if the coupon is published/active
    if (coupon.status !== "publish") {
      console.log(`Coupon status is ${coupon.status}, not 'publish'`);
      return NextResponse.json(
        {
          valid: false,
          message: "Deze coupon is niet actief (status is niet 'publish')",
        },
        { status: 200 }
      );
    }

    // Additional check for the 'enabled' property which sometimes controls status too
    if (coupon.enabled === false) {
      console.log("Coupon is explicitly disabled (enabled=false)");
      return NextResponse.json(
        { valid: false, message: "Deze coupon is uitgeschakeld" },
        { status: 200 }
      );
    }

    // Check expiry date if it exists
    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      console.log(`Coupon expired on ${coupon.date_expires}`);
      return NextResponse.json(
        { valid: false, message: "Deze coupon is verlopen" },
        { status: 200 }
      );
    }

    // Check usage limits
    if (
      coupon.usage_limit &&
      coupon.usage_count &&
      coupon.usage_count >= coupon.usage_limit
    ) {
      console.log(
        `Coupon usage limit reached: ${coupon.usage_count}/${coupon.usage_limit}`
      );
      return NextResponse.json(
        { valid: false, message: "Deze coupon is al te vaak gebruikt" },
        { status: 200 }
      );
    }

    // Fetch product data for items in the cart to calculate discount
    let subtotal = 0;
    const productIds = items.map((item) => item.productId);

    if (productIds.length > 0) {
      console.log("Fetching product data for cart items");
      try {
        // Get all products in one request with include parameter
        const productIdsParam = productIds.join(",");
        const productsResponse = await wooCommerce.get(
          `products?include=${productIdsParam}`
        );

        if (productsResponse.data) {
          console.log(`Got data for ${productsResponse.data.length} products`);

          // Create a map of product id to price
          const productPrices = new Map();
          productsResponse.data.forEach((product: any) => {
            productPrices.set(product.id, parseFloat(product.price));
            console.log(
              `Product ${product.id}: ${product.name}, price: ${product.price}`
            );
          });

          // Calculate subtotal
          items.forEach((item) => {
            const price = productPrices.get(item.productId) || 0;
            subtotal += price * item.quantity;
            console.log(
              `Cart item: ${item.productId}, quantity: ${item.quantity}, price: ${price}`
            );
          });

          console.log(`Cart subtotal: ${subtotal}`);
        } else {
          console.log("No product data returned");
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
        // Fallback: use a dummy subtotal
        subtotal = 100; // Assume €100 if we can't get real product data
        console.log(`Using fallback subtotal of €${subtotal}`);
      }
    }

    // Calculate discount
    let discountAmount = 0;
    let discountType = coupon.discount_type;

    if (discountType === "percent") {
      const discountPercent = parseFloat(coupon.amount);
      discountAmount = (subtotal * discountPercent) / 100;
      console.log(
        `Calculated ${discountPercent}% discount: €${discountAmount}`
      );
    } else if (discountType === "fixed_cart") {
      discountAmount = parseFloat(coupon.amount);
      // Ensure the discount isn't greater than the cart total
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
      console.log(`Applied fixed cart discount: €${discountAmount}`);
    } else if (discountType === "fixed_product") {
      // Handle product-specific discounts if needed
      const discountPerItem = parseFloat(coupon.amount);
      items.forEach((item) => {
        discountAmount += discountPerItem * item.quantity;
      });

      // Ensure the discount isn't greater than the cart total
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
      console.log(`Applied fixed product discount: €${discountAmount}`);
    }

    // Format discount type for display
    let discountDisplay = "";
    if (discountType === "percent") {
      discountDisplay = `${coupon.amount}%`;
    } else {
      discountDisplay = `€${parseFloat(coupon.amount).toFixed(2)}`;
    }

    console.log("Successfully validated coupon");
    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountDisplay,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      message: `Coupon "${coupon.code}" toegepast! (${discountDisplay} korting)`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      {
        valid: false,
        message: "Er is een fout opgetreden bij het valideren van de coupon",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
