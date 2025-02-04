"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface MenuItem {
  id: number;
  title: string;
  url: string;
}

export default function Navigation() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  //   if (loading) return <nav className="p-4">Loading menu...</nav>;
  if (error) return <nav className="p-4 text-red-500">{error}</nav>;

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="text-xl font-bold">
        <Link href="/" className="text-gray-800 hover:text-gray-600">
          The Holy Spiritus
        </Link>
      </div>
      <div className="flex space-x-6">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
