"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface ProductData {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: ProductImage[];
  categories: ProductCategory[];
  sku: string;
  slug: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string;
  }>;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, items } = useCart();
  const router = useRouter();

  // Simplified helper function to clean HTML entities
  const cleanHtmlEntities = (text: string | undefined): string => {
    if (!text) return "";
    return text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  // Helper to strip HTML tags and Divi builder shortcodes
  const stripHtml = (html: string | undefined): string => {
    if (!html) return "";

    // Make sure we're working with a string
    const content = String(html);

    // First remove Divi builder shortcodes
    let cleaned = content.replace(/\[\/?et_pb_[^\]]*\]/g, "");

    // Remove HTML tags but preserve line breaks
    cleaned = cleaned.replace(/<br\s*\/?>/gi, "\n");
    cleaned = cleaned.replace(/<\/p>/gi, "\n\n");
    cleaned = cleaned.replace(/<[^>]*>/g, "");

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    cleaned = cleaned.trim();

    return cleaned;
  };

  // Get product specifications in a simple way
  const getProductInfo = (product: ProductData) => {
    const info = {
      alcohol: "N/A",
      volume: "N/A",
      storage: "Koel & donker bewaren",
      servingAdvice: "",
      country: "Nederland",
      type: product.categories?.[0]?.name || "Distillaat",
      specifications: [],
    };

    // Extract important meta data and cleanup any WordPress shortcodes
    product.meta_data.forEach((meta) => {
      // Clean any potential shortcodes from meta values
      const value = meta.value ? stripHtml(meta.value) : "";
      const key = meta.key.toLowerCase();

      if (key.includes("alcohol")) {
        info.alcohol = value;
      } else if (key.includes("volume") || key.includes("inhoud")) {
        info.volume = value;
      } else if (key.includes("bewaren") || key.includes("storage")) {
        info.storage = value;
      } else if (key.includes("serveer") || key.includes("serving")) {
        info.servingAdvice = value;
      } else if (key.includes("land") || key.includes("country")) {
        info.country = value;
      } else if (key.includes("soort") || key.includes("type")) {
        info.type = value;
      }
    });

    return info;
  };

  // Fetch product data with React Query
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      const cleanedProduct = {
        ...data,
        name: cleanHtmlEntities(data.name),
        categories: data.categories?.map((category: ProductCategory) => ({
          ...category,
          name: cleanHtmlEntities(category.name),
        })),
      };

      return cleanedProduct as ProductData;
    },
    staleTime: 1000 * 60 * 5, // Consider product data fresh for 5 minutes
  });

  // Fetch related products based on the same category
  const { data: relatedProducts = [], isLoading: relatedLoading } = useQuery({
    queryKey: ["relatedProducts", product?.categories?.[0]?.id],
    queryFn: async () => {
      // Only proceed if we have a category
      if (!product?.categories?.[0]?.id) {
        return [];
      }

      const categoryId = product.categories[0].id;

      // Fetch products from the same category, excluding the current product
      const response = await fetch(
        `/api/products?category=${categoryId}&per_page=4`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch related products");
      }

      const data = await response.json();

      // Filter out the current product and take up to 3 related products
      const filtered = data.products
        .filter(
          (relatedProduct: ProductData) => relatedProduct.id !== product.id
        )
        .slice(0, 3)
        .map((relatedProduct: ProductData) => ({
          ...relatedProduct,
          name: cleanHtmlEntities(relatedProduct.name),
        }));

      return filtered;
    },
    enabled: !!product?.categories?.[0]?.id, // Only run when we have the product category
    staleTime: 1000 * 60 * 5, // Consider related products fresh for 5 minutes
  });

  // Set the selected image once product data is loaded
  useEffect(() => {
    if (product?.images?.[0]?.src) {
      setSelectedImage(product.images[0].src);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex space-x-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-100 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-100 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Product main section skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product image skeleton */}
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-lg h-[500px] animate-pulse"></div>
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 w-24 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Product info skeleton */}
            <div className="flex flex-col space-y-6">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Product details skeleton */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-full bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="text-red-500 text-center">
          {error instanceof Error
            ? error.message
            : "Er is een fout opgetreden bij het laden van het product."}
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="text-center">Product niet gevonden</div>
      </div>
    );
  }

  // Get simplified product info
  const productInfo = getProductInfo(product);

  return (
    <div className="bg-white min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex">
            <li className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-primary">
                Home
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link
                href="/products"
                className="text-gray-500 hover:text-primary"
              >
                Producten
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-800 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product main section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product images */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[500px]">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>

            {/* Thumbnail gallery - simple version */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden h-24 w-24 flex-shrink-0 ${
                      selectedImage === image.src
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={image.src}
                        alt={image.alt || product.name}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

            {/* Category */}
            {product.categories && product.categories[0] && (
              <div className="text-sm text-gray-500">
                Categorie: {product.categories[0].name}
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <div className="text-sm text-gray-500">
                Artikelnummer: {product.sku}
              </div>
            )}

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              €{parseFloat(product.price).toFixed(2)}
              {product.on_sale && product.regular_price && (
                <span className="text-gray-400 line-through text-xl ml-2">
                  €{parseFloat(product.regular_price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Short description - cleaned of Divi builder markup */}
            {product.short_description && (
              <div className="prose prose-sm max-w-none">
                {stripHtml(product.short_description)
                  .split("\n")
                  .map((paragraph, idx) =>
                    paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
                  )}
              </div>
            )}

            {/* Add to cart section */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-primary text-white font-medium py-2 px-6 rounded hover:bg-opacity-90 transition duration-200"
              >
                Toevoegen aan winkelwagen
                {(() => {
                  const cartItem = items.find(
                    (item) => item?.productId === product.id
                  );
                  return cartItem && cartItem.quantity > 0
                    ? ` (${cartItem.quantity})`
                    : "";
                })()}
              </button>
            </div>
          </div>
        </div>

        {/* Product details - simplified without tabs */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product description section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Productinformatie</h2>
            {/* Clean product description by stripping Divi Builder shortcodes and formatting */}
            <div className="prose max-w-none">
              {stripHtml(product.description)
                .split("\n")
                .map((paragraph, idx) =>
                  paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
                )}
            </div>
          </div>

          {/* Product specifications section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Specificaties</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Country */}
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold">Distillaat land:</span>
                  <span>{productInfo.country}</span>
                </div>

                {/* Alcohol percentage */}
                {productInfo.alcohol !== "N/A" && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Alcoholpercentage:</span>
                    <span>{productInfo.alcohol}</span>
                  </div>
                )}

                {/* Volume/Content */}
                {productInfo.volume !== "N/A" && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Inhoud:</span>
                    <span>{productInfo.volume}</span>
                  </div>
                )}

                {/* Storage information */}
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Bewaren:</h3>
                  <p className="text-gray-700">{productInfo.storage}</p>
                </div>

                {/* Display serving advice if available */}
                {productInfo.servingAdvice && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">Serveeradvies:</h3>
                    <p className="text-gray-700">{productInfo.servingAdvice}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-8">Gerelateerde Producten</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedLoading ? (
              // Skeleton loading for related products
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="h-4 w-16 bg-gray-200 mb-2 rounded animate-pulse"></div>
                    <div className="h-8 w-4/5 bg-gray-200 mb-4 rounded animate-pulse"></div>
                    <div className="bg-gray-200 p-4 mb-4 h-56 rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-gray-200 mb-4 rounded animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
            ) : relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct: ProductData) => (
                <div key={relatedProduct.id} className="flex flex-col">
                  {/* Product Category */}
                  <div className="text-xs text-gray-500 mb-2">
                    {relatedProduct.categories?.[0]?.name || ""}
                  </div>

                  {/* Make the product name and image clickable */}
                  <Link
                    href={`/product/${relatedProduct.slug}`}
                    className="group"
                  >
                    {/* Product Name */}
                    <h3 className="text-xl font-bold mb-4 leading-tight h-16 overflow-hidden group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>

                    {/* Product Image with Background */}
                    <div className="bg-gray-100 p-4 mb-4 flex items-center justify-center h-56 group-hover:bg-gray-200 transition-colors">
                      {relatedProduct.images?.[0] && (
                        <img
                          src={relatedProduct.images[0].src}
                          alt={
                            relatedProduct.images[0].alt || relatedProduct.name
                          }
                          className="h-full object-contain"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Price */}
                  <div className="text-2xl font-bold mb-4">
                    €{Number(relatedProduct.price).toFixed(2)}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex gap-2">
                    <Link
                      href={`/product/${relatedProduct.slug}`}
                      className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 font-medium transition-colors"
                    >
                      Bekijk product
                    </Link>
                    <button
                      onClick={() => addToCart(relatedProduct.id, 1)}
                      className="flex-1 flex items-center justify-center bg-primary text-white px-4 py-2 font-medium"
                    >
                      Toevoegen
                      {(() => {
                        const cartItem = items.find(
                          (item) => item?.productId === relatedProduct.id
                        );
                        return cartItem && cartItem.quantity > 0
                          ? ` (${cartItem.quantity})`
                          : "";
                      })()}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // No related products found
              <div className="col-span-3 text-center py-8 text-gray-500">
                Geen gerelateerde producten gevonden
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
