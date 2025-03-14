"use client";
import { useCart } from "@/context/cartContext";
import { useEffect, useState, useRef } from "react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import Link from "next/link";
import { gsap } from "gsap";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeFromCart, addToCart } = useCart();
  const [products, setProducts] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Animation for opening/closing the sidebar
  useEffect(() => {
    if (!sidebarRef.current || !overlayRef.current) return;

    const sidebar = sidebarRef.current;
    const overlay = overlayRef.current;

    if (isOpen) {
      // Open animation
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        display: "block",
      });
      gsap.fromTo(
        sidebar,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power2.out" }
      );
    } else {
      // Close animation
      gsap.to(sidebar, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  // Fetch products in cart
  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = items.map((item) => item.productId);
        const queryString = productIds.map((id) => `ids[]=${id}`).join("&");
        const response = await fetch(`/api/products/batch?${queryString}`);

        if (!response.ok) {
          throw new Error("Failed to fetch cart products");
        }

        const data = await response.json();
        const productMap = new Map();
        data.forEach((product: Product) => {
          productMap.set(product.id, product);
        });
        setProducts(productMap);
      } catch (error) {
        console.error("Error fetching cart products:", error);
        setError("Failed to load cart products");
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      setLoading(true);
      fetchCartProducts();
    }
  }, [items, isOpen]);

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    items.forEach((item) => {
      const product = products.get(item.productId);
      if (product) {
        total += parseFloat(product.price) * item.quantity;
      }
    });
    return total.toFixed(2);
  };

  // Handle quantity change
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      // Remove and re-add with new quantity
      removeFromCart(productId);
      addToCart(productId, newQuantity);
    }
  };

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Lock body scroll when sidebar is open
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white shadow-lg z-50 transform translate-x-full overflow-auto flex flex-col"
      >
        {/* Header */}
        <div className="px-4 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart size={20} />
            Winkelwagen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Uw winkelwagen is leeg</p>
              <button
                onClick={onClose}
                className="text-primary hover:underline"
              >
                Doorgaan met winkelen
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const product = products.get(item.productId);
                if (!product) return null;

                return (
                  <li key={item.productId} className="border-b pb-4 flex gap-3">
                    {/* Product image */}
                    <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0].src}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-medium text-gray-800 hover:text-primary"
                          onClick={onClose}
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="text-gray-600 mt-1">
                        €{parseFloat(product.price).toFixed(2)}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="text-gray-500 hover:text-primary border rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="mx-2 w-8 text-center text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="text-gray-500 hover:text-primary border rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer with totals and checkout button */}
        {items.length > 0 && !loading && (
          <div className="border-t p-4 bg-white sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Totaal:</span>
              <span className="text-xl font-bold">€{calculateTotal()}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-primary text-center text-white py-3 font-medium hover:bg-opacity-90 transition"
              onClick={onClose}
            >
              Betaling afronden
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center text-gray-700 py-2 mt-2 hover:underline"
            >
              Doorgaan met winkelen
            </button>
          </div>
        )}
      </div>
    </>
  );
}
