"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/context/cartContext";
import { ToastContainer } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { items, addToCart } = useCart(); // Get items as well to verify cart state

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (productId: number) => {
    console.log("Adding product to cart:", productId); // Debug log
    addToCart(productId);
    console.log("Current cart items:", items); // Debug log
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <ToastContainer />
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          {product.images[0] && (
            <img
              src={product.images[0].src}
              alt={product.images[0].alt}
              className="w-full h-48 object-cover"
            />
          )}
          <h2 className="text-xl font-bold mt-2">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
          <button
            onClick={() => handleAddToCart(product.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add to Cart{" "}
            {items.find((item) => item.productId === product.id)?.quantity || 0}
          </button>
        </div>
      ))}
    </div>
  );
}
