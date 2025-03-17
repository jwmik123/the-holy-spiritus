"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Product, Collection } from "@/types/product";
import { useCart } from "@/context/cartContext";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CustomLink from "../components/CustomLink";

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
          <h3 className="text-2xl font-bold">Categorieën</h3>

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

        {/* Collection/Category Filter */}
        <div className="relative mb-8">
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
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === "ALL"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Alle Producten
            </button>

            {collections.map((collection: Collection) => (
              <button
                key={collection.id}
                onClick={() => handleCategoryChange(collection.name)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === collection.name
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {collection.name}
              </button>
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

        {/* Products count */}
        {!isLoading && (
          <p className="text-sm text-gray-500 mb-6">
            {products.length > 0
              ? `Tonen ${(currentPage - 1) * productsPerPage + 1}-${Math.min(
                  currentPage * productsPerPage,
                  totalProducts
                )} van ${totalProducts} producten`
              : "Geen producten gevonden"}
          </p>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Show skeletons when loading
            <>
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </>
          ) : (
            // Show actual products
            products.map((product: Product, index: number) => (
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
                    <div className=" mb-4  flex items-center justify-center h-96  transition-colors">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      )}
                    </div>
                    {/* Product Name */}
                    <h2 className="text-lg font-bold overflow-hidden ">
                      {product.name}
                    </h2>
                  </CustomLink>

                  {/* Price - lighter weight and smaller size */}
                  <div className="text-gray-700 mb-6">
                    €{Number(product.price).toFixed(2)}
                  </div>

                  {/* Add to Basket Button - removing the split button design */}
                  {/* <button
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-primary px-4 py-2 w-full text-center text-sm font-normal text-white"
                  >
                    Voeg toe
                    {(() => {
                      const cartItem = items.find(
                        (item) => item?.productId === product.id
                      );
                      return cartItem && cartItem.quantity > 0
                        ? ` (${cartItem.quantity})`
                        : "";
                    })()}
                  </button> */}
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
