"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Product, Collection } from "@/types/product";
import { useCart } from "@/context/cartContext";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CustomLink from "../components/CustomLink";

type SubCategory = {
  name: string;
  id: string;
};

type MainCategory = {
  name: string;
  id: string;
  subCategories?: SubCategory[];
};

const MAIN_CATEGORIES: MainCategory[] = [
  {
    name: "The Holy Spiritus",
    id: "holy-spiritus",
    subCategories: [
      { name: "Cider & Perry", id: "cider-perry" },
      { name: "Likeuren", id: "likeuren" },
      { name: "Jenever", id: "jenever" },
      { name: "Gin", id: "gin" },
      { name: "Vodka", id: "vodka" },
      { name: "Distillaat", id: "distillaat" },
      { name: "Merchandise", id: "merchandise" },
      { name: "Private label", id: "private-label" },
    ],
  },
  { name: "Ewan Ewyn", id: "ewan-ewyn" },
  { name: "Sliertemie", id: "sliertemie" },
  { name: "Proeverij", id: "proeverij" },
  { name: "Geschenkideeën", id: "geschenkideeen" },
];

// Loading fallback component
function ProductsLoading() {
  return (
    <div className="px-4 py-8 bg-white min-h-screen text-black">
      <div className="container mx-auto pt-24">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Categorieën</h3>
        </div>

        <div className="relative mb-8">
          <div className="flex overflow-x-auto py-2 px-10 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col animate-pulse">
              <div className="h-4 w-16 bg-gray-200 mb-2 rounded"></div>
              <div className="h-8 w-4/5 bg-gray-200 mb-4 rounded"></div>
              <div className="bg-gray-200 p-4 mb-4 h-96 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 mb-2 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 mb-4 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main products content component
function ProductsContent() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { items, addToCart } = useCart();
  const productsPerPage = 12;

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to clean HTML entities
  const cleanHtmlEntities = (text: string | undefined): string => {
    if (!text) return "";
    return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  // Get page and category from URL params on initial load
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const categoryParam = searchParams.get("category");

    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }

    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch collections with React Query
  const {
    data: collections = [],
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await fetch("/api/products/collections");
      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }
      const data = await response.json();

      // Clean HTML entities in collection names
      return data.map((collection: Collection) => ({
        ...collection,
        name: cleanHtmlEntities(collection.name),
      }));
    },
    staleTime: 1000 * 60 * 5, // Consider collections data fresh for 5 minutes
  });

  // Fetch products with React Query
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products", currentPage, activeCategory],
    queryFn: async () => {
      let url = `/api/products?page=${currentPage}&per_page=${productsPerPage}`;

      // Add category parameter if not "ALL"
      if (activeCategory !== "ALL") {
        const categoryId = collections.find(
          (c: Collection) => c.name === activeCategory
        )?.id;
        if (categoryId) {
          url += `&category=${categoryId}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Clean HTML entities in product data
      const cleanedProducts = data.products.map((product: Product) => ({
        ...product,
        name: cleanHtmlEntities(product.name),
        categories: product.categories?.map((category) => ({
          ...category,
          name: cleanHtmlEntities(category.name),
        })),
      }));

      return {
        products: cleanedProducts,
        totalPages: data.pagination.totalPages,
        totalProducts: data.pagination.total,
      };
    },
    enabled: !collectionsLoading, // Only run this query when collections are loaded
    staleTime: 1000 * 60 * 2, // Consider products fresh for 2 minutes
  });

  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;
  const totalProducts = productsData?.totalProducts || 0;
  const isLoading = collectionsLoading || productsLoading;
  const error = collectionsError || productsError;

  // Handle page change
  const goToPage = (pageNumber: number) => {
    // Update URL with new page number
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());

    if (activeCategory !== "ALL") {
      params.set("category", activeCategory);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    // Reset to page 1 when changing category
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (category !== "ALL") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`);
    setCurrentPage(1);
  };

  // Scroll categories horizontally
  const scrollCategories = (direction: "left" | "right") => {
    const container = categoriesContainerRef.current;
    if (!container) return;

    const scrollAmount = 200; // Adjust as needed

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddToCart = (productId: number) => {
    addToCart(productId);
  };

  // Toggle expanded category
  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  // Render product skeleton
  const ProductSkeleton = () => (
    <div className="flex flex-col animate-pulse">
      <div className="h-4 w-16 bg-gray-200 mb-2 rounded"></div>
      <div className="h-8 w-4/5 bg-gray-200 mb-4 rounded"></div>
      <div className="bg-gray-200 p-4 mb-4 h-96 rounded"></div>
      <div className="h-4 w-32 bg-gray-200 mb-2 rounded"></div>
      <div className="h-8 w-24 bg-gray-200 mb-4 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  );

  if (error)
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error
          ? error.message
          : "Er is een fout opgetreden bij het laden van de producten."}
      </div>
    );

  return (
    <div className="px-4 py-8 bg-white min-h-screen text-black">
      <div className="container mx-auto pt-24">
        {/* Header with title and pagination */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Webshop</h3>

          {/* Pagination at top */}
          {totalPages > 1 && !isLoading && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border rounded-full disabled:opacity-50"
                aria-label="Vorige pagina"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-sm">
                Pagina {currentPage} van {totalPages}
              </span>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-full disabled:opacity-50"
                aria-label="Volgende pagina"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Category Filter - Visible only on small screens */}
        <div className="md:hidden mb-8">
          <div className="relative">
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              aria-label="Scroll categorieën naar links"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={categoriesContainerRef}
              className="flex overflow-x-auto scrollbar-hide py-2 px-10 gap-3 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={() => handleCategoryChange("ALL")}
                className={`px-6 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === "ALL"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Alle Producten
              </button>

              {MAIN_CATEGORIES.map((category) => (
                <div key={category.id} className="relative flex-shrink-0">
                  {category.subCategories ? (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`px-6 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                        expandedCategory === category.id ||
                        (category.subCategories &&
                          category.subCategories.some(
                            (sub) => sub.name === activeCategory
                          ))
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                      {expandedCategory === category.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCategoryChange(category.name)}
                      className={`px-6 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === category.name
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
              aria-label="Scroll categorieën naar rechts"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Mobile Subcategories panel */}
          {expandedCategory && (
            <div className="bg-gray-50 p-4 rounded-md mt-2 mb-4 grid grid-cols-2 gap-2 animate-fadeIn">
              {MAIN_CATEGORIES.find(
                (cat) => cat.id === expandedCategory
              )?.subCategories?.map((subCategory) => (
                <button
                  key={subCategory.id}
                  onClick={() => {
                    handleCategoryChange(subCategory.name);
                    setExpandedCategory(null);
                  }}
                  className={`px-4 py-2 text-sm text-left rounded ${
                    activeCategory === subCategory.name
                      ? "bg-primary text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {subCategory.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main content area with sidebar on desktop */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-gray-50 p-4 rounded-lg sticky top-28">
              <h4 className="font-medium mb-3 text-lg">Categorieën</h4>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange("ALL")}
                  className={`w-full px-4 py-2 text-left rounded-md text-sm font-medium ${
                    activeCategory === "ALL"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Alle Producten
                </button>

                {MAIN_CATEGORIES.map((category) => (
                  <div key={category.id} className="space-y-1">
                    {category.subCategories ? (
                      <>
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className={`w-full px-4 py-2 text-left rounded-md text-sm font-medium flex items-center justify-between ${
                            expandedCategory === category.id ||
                            (category.subCategories &&
                              category.subCategories.some(
                                (sub) => sub.name === activeCategory
                              ))
                              ? "bg-primary text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{category.name}</span>
                          {expandedCategory === category.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>

                        {expandedCategory === category.id && (
                          <div className="pl-4 space-y-1 animate-fadeIn">
                            {category.subCategories.map((subCategory) => (
                              <button
                                key={subCategory.id}
                                onClick={() => {
                                  handleCategoryChange(subCategory.name);
                                }}
                                className={`w-full px-4 py-2 text-left rounded-md text-sm ${
                                  activeCategory === subCategory.name
                                    ? "bg-gray-200 font-medium"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                {subCategory.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleCategoryChange(category.name)}
                        className={`w-full px-4 py-2 text-left rounded-md text-sm font-medium ${
                          activeCategory === category.name
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products content */}
          <div className="flex-1">
            {/* Products count */}
            {!isLoading && (
              <p className="text-sm text-gray-500 mb-6">
                {products.length > 0
                  ? `Tonen ${
                      (currentPage - 1) * productsPerPage + 1
                    }-${Math.min(
                      currentPage * productsPerPage,
                      totalProducts
                    )} van ${totalProducts} producten`
                  : "Geen producten gevonden"}
              </p>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Show skeletons when loading
                <>
                  {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </>
              ) : (
                // Show actual products (filtering out any that might be out of stock)
                products
                  .filter(
                    (product: Product) => product.stock_status === "instock"
                  )
                  .map((product: Product, index: number) => (
                    <div
                      key={product.id || `empty-${index}`}
                      className="flex flex-col"
                    >
                      <>
                        {/* Brand/Store name */}
                        <div className="text-sm text-gray-700 mb-1">
                          {product.categories?.[0]?.name || "Vince"}
                        </div>

                        {/* Make the product name and image clickable */}
                        <CustomLink
                          href={`/product/${product.slug}`}
                          className="group"
                        >
                          {/* Product Image with Background - Taller height */}
                          <div className="mb-4 flex items-center justify-center h-96 transition-colors">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0].src}
                                alt={product.images[0].alt || product.name}
                                className="h-full w-full object-cover rounded-md"
                              />
                            )}
                          </div>
                          {/* Product Name */}
                          <h2 className="text-lg font-bold overflow-hidden">
                            {product.name}
                          </h2>
                        </CustomLink>

                        {/* Price - lighter weight and smaller size */}
                        <div className="text-gray-700 mb-6">
                          €{Number(product.price).toFixed(2)}
                        </div>
                      </>
                    </div>
                  ))
              )}
            </div>

            {/* Show "No products found" message when needed */}
            {products.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <p className="text-lg">
                  Geen producten gevonden in deze categorie.
                </p>
              </div>
            )}

            {/* Pagination Controls at bottom */}
            {totalPages > 1 && !isLoading && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Vorige
                </button>

                {/* Generate page buttons */}
                {(() => {
                  const pages = [];
                  // Always show first page
                  if (currentPage > 3) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => goToPage(1)}
                        className="px-4 py-2 border rounded"
                      >
                        1
                      </button>
                    );
                    // Add ellipsis if needed
                    if (currentPage > 4) {
                      pages.push(
                        <span key="ellipsis1" className="px-2">
                          ...
                        </span>
                      );
                    }
                  }

                  // Show pages around current page
                  for (
                    let i = Math.max(1, currentPage - 1);
                    i <= Math.min(totalPages, currentPage + 1);
                    i++
                  ) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`px-4 py-2 border rounded ${
                          currentPage === i
                            ? "bg-primary text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Always show last page
                  if (currentPage < totalPages - 2) {
                    // Add ellipsis if needed
                    if (currentPage < totalPages - 3) {
                      pages.push(
                        <span key="ellipsis2" className="px-2">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => goToPage(totalPages)}
                        className="px-4 py-2 border rounded"
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Volgende
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Products Page component with Suspense
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
