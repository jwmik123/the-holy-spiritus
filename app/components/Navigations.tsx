"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CustomLink from "./CustomLink";

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
  const pathname = usePathname();

  // Check if current page is homepage
  const isHomePage = pathname === "/";

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
    <nav
      className={`p-4 fixed w-full z-10 text-white font-montserrat ${
        isHomePage ? "bg-transparent" : "bg-primary"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold uppercase">
          <CustomLink href="/">The Holy Spiritus</CustomLink>
        </div>
        <div className="flex space-x-6">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <CustomLink href={item.url} className=" lowercase">
                {item.title}
              </CustomLink>
              {item.children && item.children.length > 0 && (
                <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg py-2 min-w-[200px] z-10">
                  {item.children.map((child) => (
                    <CustomLink
                      key={child.id}
                      href={child.url}
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      {child.title}
                    </CustomLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
