"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface MenuItem {
  id: number;
  title: string;
  url: string;
  children?: MenuItem[];
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
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

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
          <div key={item.id} className="relative group">
            <Link
              href={item.url}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {item.title}
            </Link>
            {item.children && item.children.length > 0 && (
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg py-2 min-w-[200px] z-10">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.url}
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
