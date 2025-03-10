"use client";
import { useState, useEffect, useRef } from "react";
import { Product, Collection } from "@/types/product";
import { useCart } from "@/context/cartContext";
import { ToastContainer } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const { items, addToCart } = useCart();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to clean HTML entities with proper typing
  const cleanHtmlEntities = (text: string | undefined): string => {
    if (!text) return "";
    return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  // Get page from URL or default to 1
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

  // Fetch products with pagination
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = `/api/products?page=${currentPage}&per_page=${productsPerPage}`;

        // Add category parameter if not "ALL"
        if (activeCategory !== "ALL") {
          const categoryId = collections.find(
            (c) => c.name === activeCategory
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

        console.log(data);
        // Clean HTML entities in product data
        const cleanedProducts = data.products.map((product: Product) => ({
          ...product,
          name: cleanHtmlEntities(product.name),
          categories: product.categories?.map((category) => ({
            ...category,
            name: cleanHtmlEntities(category.name),
          })),
        }));

        setProducts(cleanedProducts);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.total);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          "Er is een fout opgetreden bij het laden van de producten. Probeer het later opnieuw."
        );
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if we have collection data (for category filtering)
    if (collections.length > 0 || !activeCategory || activeCategory === "ALL") {
      fetchProducts();
    }
  }, [currentPage, activeCategory, collections]);

  // Fetch collections
  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/products/collections");
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }
        const data = await response.json();

        // Clean HTML entities in collection names
        const cleanedData = data.map((collection: Collection) => ({
          ...collection,
          name: cleanHtmlEntities(collection.name),
        }));

        setCollections(cleanedData);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError(
          "Er is een fout opgetreden bij het laden van de categorieën. Probeer het later opnieuw."
        );
      }
    }

    fetchCollections();
  }, []);

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

  // Create array of collection titles with "ALL" as first option
  const collectionTitles = [
    "ALL",
    ...collections.map((collection) => collection.name),
  ];

  // Render product skeleton
  const ProductSkeleton = () => (
    <div className="flex flex-col animate-pulse">
      <div className="h-4 w-16 bg-gray-200 mb-2 rounded"></div>
      <div className="h-8 w-4/5 bg-gray-200 mb-4 rounded"></div>
      <div className="bg-gray-200 p-4 mb-4 h-64 rounded"></div>
      <div className="h-4 w-32 bg-gray-200 mb-2 rounded"></div>
      <div className="h-8 w-24 bg-gray-200 mb-4 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  );

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // Ensure the grid always has 3 items in each row
  const normalizeProductsForGrid = (products: Product[]): Product[] => {
    const result = [...products];
    // Add empty placeholder objects if needed to maintain 3-column grid
    const remainder = products.length % 3;
    if (remainder > 0) {
      for (let i = 0; i < 3 - remainder; i++) {
        // Add a placeholder with a unique negative ID
        result.push({ id: -1 - i } as Product);
      }
    }
    return result;
  };

  const normalizedProducts = normalizeProductsForGrid(products);

  return (
    <div className="px-4 py-8 bg-white min-h-screen text-black">
      <div className="container mx-auto pt-24">
        {/* Header with title and pagination */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Categorieën</h3>

          {/* Pagination at top */}
          {totalPages > 1 && !loading && (
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

            {collections.map((collection) => (
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
        {!loading && (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Show skeletons when loading
            <>
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </>
          ) : (
            // Show actual products
            normalizedProducts.map((product, index) => (
              <div
                key={product.id || `empty-${index}`}
                className="flex flex-col"
              >
                {/* Show actual product or empty space for grid alignment */}
                {product.id > 0 ? (
                  <>
                    {/* Product Category */}
                    <div className="text-xs text-gray-500 mb-2">
                      {product.categories?.[0]?.name || "Alle Producten"}
                    </div>

                    {/* Product Name */}
                    <h2 className="text-2xl font-bold mb-4 leading-tight h-16 overflow-hidden">
                      {product.name}
                    </h2>

                    {/* Product Image with Background */}
                    <div className="bg-gray-100 p-4 mb-4 flex items-center justify-center h-64">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0].src}
                          alt={product.images[0].alt || product.name}
                          className="h-full object-contain"
                        />
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-3xl font-bold mb-4">
                      €{Number(product.price).toFixed(2)}
                    </div>

                    {/* Add to Basket Button */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex items-center justify-center bg-primary text-white px-4 py-2 font-medium"
                    >
                      Voeg toe aan winkelmand
                      {(() => {
                        const cartItem = items.find(
                          (item) => item?.productId === product.id
                        );
                        return cartItem && cartItem.quantity > 0
                          ? ` (${cartItem.quantity})`
                          : "";
                      })()}
                    </button>
                  </>
                ) : (
                  // Empty cell to maintain grid layout
                  <div className="hidden md:block"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Show "No products found" message when needed */}
        {products.length === 0 && !loading && (
          <div className="text-center py-10">
            <p className="text-lg">
              Geen producten gevonden in deze categorie.
            </p>
          </div>
        )}

        {/* Pagination Controls at bottom */}
        {totalPages > 1 && !loading && (
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
