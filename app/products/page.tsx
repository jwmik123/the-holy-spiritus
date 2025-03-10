"use client";
import { useState, useEffect } from "react";
import { Product, Collection } from "@/types/product";

import { useCart } from "@/context/cartContext";
import { ToastContainer } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const { items, addToCart } = useCart();

  // Keep the original fetch function
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

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/products/collections");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Failed to load collections. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  // Create array of collection titles with "ALL" as first option
  const collectionTitles = [
    "ALL",
    ...collections.map((collection) => collection.name),
  ];

  // Filter products by collection
  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((product) =>
          collections?.some((collection) => collection.name === activeCategory)
        );

  const handleAddToCart = (productId: number) => {
    console.log("Adding product to cart:", productId);
    addToCart(productId);
    console.log("Current cart items:", items);
  };

  // if (loading) return <div className="p-4 min-h-screen">Loading...</div>;
  // if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className=" px-4 py-8 bg-white min-h-screen text-black">
      <div className="container mx-auto">
        {/* Collection/Category Filter */}
        <h3 className="text-2xl font-bold mb-4">Categorie</h3>
        <div className="mb-8 flex justify-center space-x-6">
          {collectionTitles.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium tracking-wider ${
                activeCategory === category
                  ? "border-b-2 border-black font-bold"
                  : "text-gray-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ToastContainer />
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              {/* Product Category - Display collection name or "ALL" */}
              <div className="text-xs text-gray-500 mb-2">
                {product.categories?.[0].name || "ALL"}
              </div>

              {/* Product Name */}
              <h2 className="text-2xl font-bold mb-4 leading-tight">
                {product.name}
              </h2>

              {/* Product Image with Background */}
              <div className="bg-gray-100 p-4 mb-4 flex items-center justify-center">
                {product.images[0] && (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="h-64 object-contain"
                  />
                )}
              </div>

              {/* Hardcoded ABV and Volume (since it's not in the original data structure) */}
              <div className="text-sm text-gray-500 mb-2">
                ABV: 40.0% | VOLUME: 70CL
              </div>

              {/* Price */}
              <div className="text-3xl font-bold mb-4">
                €{Number(product.price).toFixed(2)}
              </div>

              {/* Add to Basket Button */}
              <button
                onClick={() => handleAddToCart(product.id)}
                className="flex items-center justify-center  bg-primary text-white px-4 py-2 font-medium"
              >
                Voeg toe aan winkelmand
                {items.find((item) => item.productId === product.id)?.quantity >
                  0 &&
                  ` (${
                    items.find((item) => item.productId === product.id)
                      ?.quantity
                  })`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
