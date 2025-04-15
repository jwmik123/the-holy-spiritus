"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CustomLink from "./CustomLink";
import CartToggle from "./CartToggle";
import { Menu, X } from "lucide-react";
import Image from "next/image";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (error) return <nav className="p-4 text-red-500">{error}</nav>;

  return (
    <nav
      className={`${
        isHomePage ? "p-4 md:p-8" : "p-4"
      } fixed w-full z-50 text-white font-montserrat ${
        isHomePage && !mobileMenuOpen ? "bg-transparent" : "bg-primary"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg md:text-2xl font-bold uppercase">
          <CustomLink href="/">The Holy Spiritus</CustomLink>
        </div>

        {/* Logo */}
        <div className="hidden md:block">
          <Image
            src="/images/ths-logo.png"
            alt="The Holy Spiritus Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group text-lg">
              <CustomLink href={item.url} className="lowercase">
                {item.title}
              </CustomLink>
              {item.children && item.children.length > 0 && (
                <div className="absolute top-full left-0 hidden group-hover:block bg-primary shadow-lg py-2 min-w-[200px] z-10">
                  {item.children.map((child) => (
                    <CustomLink
                      key={child.id}
                      href={child.url}
                      className="block px-4 py-2 text-white hover:bg-white hover:text-primary"
                    >
                      {child.title}
                    </CustomLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          <CustomLink href={"/blog"} className="text-lg">
            blog
          </CustomLink>

          {/* Cart Toggle */}
          <CartToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <CartToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary absolute top-full h-screen left-0 w-full shadow-lg py-4">
          <div className="container mx-auto px-4 flex flex-col">
            {menuItems.map((item) => (
              <div key={item.id} className="py-2">
                <CustomLink href={item.url} className="lowercase text-lg">
                  {item.title}
                </CustomLink>

                {item.children && item.children.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <CustomLink
                        key={child.id}
                        href={child.url}
                        className="block py-1 text-gray-200 hover:text-white"
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
      )}
    </nav>
  );
}
