"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cartContext";
import CartSidebar from "./CartSidebar";

export default function CartToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative text-white focus:outline-none"
        aria-label="Open cart"
      >
        <ShoppingCart size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>

      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
