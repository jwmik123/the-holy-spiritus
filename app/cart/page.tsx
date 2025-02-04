// app/cart/page.tsx
"use client";
import { useCart } from "@/context/cartContext";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

export default function CartPage() {
  const { items, removeFromCart } = useCart();
  const [products, setProducts] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Cart items on render:", items); // Debug log

  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        console.log("No items in cart"); // Debug log
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching products for cart items:", items); // Debug log
        const productIds = items.map((item) => item.productId);
        const queryString = productIds.map((id) => `ids[]=${id}`).join("&");
        console.log("Query string:", queryString); // Debug log

        const response = await fetch(`/api/products/batch?${queryString}`);
        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
          throw new Error("Failed to fetch cart products");
        }

        const data = await response.json();
        console.log("Fetched products:", data); // Debug log

        const productMap = new Map();
        data.forEach((product: Product) => {
          productMap.set(product.id, product);
        });
        setProducts(productMap);
      } catch (error) {
        console.error("Error fetching cart products:", error);
        setError("Failed to load cart products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCartProducts();
  }, [items]);

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (items.length === 0) return <div className="p-4">Your cart is empty</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Your Cart ({items.length} items)
      </h1>
      {items.map((item) => {
        const product = products.get(item.productId);
        console.log("Rendering product:", item.productId, product); // Debug log

        if (!product) return null;

        return (
          <div key={item.productId} className="flex items-center border-b py-4">
            {product.images[0] && (
              <img
                src={product.images[0].src}
                alt={product.name}
                className="w-24 h-24 object-cover"
              />
            )}
            <div className="ml-4 flex-grow">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">
                Quantity: {item.quantity} x ${product.price}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}
