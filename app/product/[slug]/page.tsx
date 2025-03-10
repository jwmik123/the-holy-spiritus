"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/cartContext";
import { useParams } from "next/navigation";
import Link from "next/link";

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

interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
}

interface RelatedProduct {
  id: number;
  name: string;
  price: string;
  images: ProductImage[];
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
  attributes: ProductAttribute[];
  related_ids: number[];
  slug: string;
  sku: string;
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

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

  // Helper function to strip HTML tags
  const stripHtml = (html: string | undefined): string => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        // In a real application, you'd fetch from your API
        const response = await fetch(`/api/products/${slug}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        // Clean HTML entities in the product data
        const cleanedProduct = {
          ...data,
          name: cleanHtmlEntities(data.name),
          description: data.description,
          short_description: data.short_description,
          categories: data.categories?.map((category: ProductCategory) => ({
            ...category,
            name: cleanHtmlEntities(category.name),
          })),
        };

        setProduct(cleanedProduct);
        setSelectedImage(cleanedProduct.images[0]?.src || "");

        // Fetch related products
        if (
          cleanedProduct.related_ids &&
          cleanedProduct.related_ids.length > 0
        ) {
          fetchRelatedProducts(cleanedProduct.related_ids);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(
          "Er is een fout opgetreden bij het laden van het product. Probeer het later opnieuw."
        );
      } finally {
        setLoading(false);
      }
    }

    async function fetchRelatedProducts(relatedIds: number[]) {
      try {
        // Create query string for related product IDs
        const idsQuery = relatedIds.map((id) => `ids[]=${id}`).join("&");
        const response = await fetch(`/api/products/batch?${idsQuery}`);

        if (!response.ok) {
          throw new Error("Failed to fetch related products");
        }

        const data = await response.json();

        // Clean HTML entities in related products
        const cleanedRelatedProducts = data.map((product: RelatedProduct) => ({
          ...product,
          name: cleanHtmlEntities(product.name),
        }));

        setRelatedProducts(cleanedRelatedProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

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

  const getSpecificationsFromDescription = (description: string) => {
    // Extract product specifications from the description HTML
    // You may need to adjust this based on your product data structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, "text/html");

    const specs: Record<string, string[]> = {
      Productspecificaties: [],
      "Overige kenmerken": [],
      "Etiket informatie": [],
      Bewaren: [],
    };

    // Example: try to extract data from specific sections
    doc.querySelectorAll("h3").forEach((heading) => {
      const section = heading.textContent?.trim();
      if (section && specs.hasOwnProperty(section)) {
        const items: string[] = [];
        let nextEl = heading.nextElementSibling;

        while (nextEl && nextEl.tagName !== "H3") {
          if (nextEl.tagName === "P" || nextEl.tagName === "UL") {
            items.push(nextEl.textContent?.trim() || "");
          }
          nextEl = nextEl.nextElementSibling;
        }

        if (items.length > 0) {
          specs[section] = items;
        }
      }
    });

    return specs;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-200 h-96 w-full animate-pulse rounded"></div>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 h-20 w-20 animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-200 h-8 w-3/4 animate-pulse rounded"></div>
            <div className="bg-gray-200 h-6 w-1/4 animate-pulse rounded"></div>
            <div className="bg-gray-200 h-32 w-full animate-pulse rounded"></div>
            <div className="bg-gray-200 h-10 w-1/2 animate-pulse rounded"></div>
            <div className="bg-gray-200 h-12 w-full animate-pulse rounded"></div>
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
          <h2 className="text-2xl font-bold mb-4">Fout bij het laden</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // If no product data is available
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product niet gevonden</h2>
          <p>
            Het product waarnaar u zoekt bestaat niet of is niet meer
            beschikbaar.
          </p>
        </div>
      </div>
    );
  }

  // Extract specifications from the description
  const productSpecifications = getSpecificationsFromDescription(
    product.description
  );

  // Main render with product data
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
            {product.categories && product.categories[0] && (
              <li className="flex items-center">
                <Link
                  href={`/collections/${product.categories[0].slug}`}
                  className="text-gray-500 hover:text-primary"
                >
                  {product.categories[0].name}
                </Link>
                <span className="mx-2">/</span>
              </li>
            )}
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

            {/* Thumbnail gallery */}
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

            {/* Product code/sku */}
            <div className="text-sm text-gray-500">
              Artikelnummer: {product.sku}
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              €{parseFloat(product.price).toFixed(2)}
            </div>

            {/* Short description */}
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: product.short_description,
              }}
            />

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
              </button>
            </div>

            {/* Alcoholpercentage & Volume */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Alcoholpercentage:</span>
                <span>43%</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="font-medium">Volume:</span>
                <span>0,50 liter</span>
              </div>
            </div>

            {/* Additional info */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold mb-2">Serveeradvies:</h3>
              <p className="text-gray-700">
                Serveren op kamertemperatuur voor optimale smaak. Een ijsblokje
                laat de drank extra ademen.
              </p>
            </div>
          </div>
        </div>

        {/* Product details tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <a
                href="#informatie"
                className="border-primary text-primary font-medium text-sm py-4 px-1 border-b-2"
              >
                Productinformatie
              </a>
              <a
                href="#specificaties"
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm py-4 px-1 border-b-2"
              >
                Specificaties
              </a>
            </nav>
          </div>

          {/* Tab content - Productinformatie */}
          <div id="informatie" className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Productspecificaties</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Soort distillaat:</span>{" "}
                    appeldistillaat
                  </li>
                  <li>
                    <span className="font-medium">Distillaat land:</span>{" "}
                    Nederland
                  </li>
                  <li>
                    <span className="font-medium">Kleur distillaat:</span>{" "}
                    amberkleurig
                  </li>
                  <li>
                    <span className="font-medium">Serveertemperatuur:</span>{" "}
                    kamertemperatuur
                  </li>
                  <li>
                    <span className="font-medium">Soort flessluiting:</span>{" "}
                    kurken stop
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Overige kenmerken</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Verkrijgbaar in:</span>{" "}
                    Nederland en België
                  </li>
                  <li>
                    <span className="font-medium">Drank opties:</span>{" "}
                    Veganistisch
                  </li>
                  <li>
                    <span className="font-medium">Smaakprofiel:</span> vol,
                    verrassend en vanille (van het eiken vat), rokerig
                  </li>
                  <li>
                    <span className="font-medium">Lekker bij:</span>{" "}
                    kaasschotels, dessert, aperitief, cocktails en als digestief
                  </li>
                  <li>
                    <span className="font-medium">Verpakkingsvorm:</span> Doos
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Etiket informatie</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Ingrediënten:</span> appels
                  </li>
                  <li>
                    <span className="font-medium">Allergenen informatie:</span>
                  </li>
                  <li className="ml-4">Geschikt voor veganisten</li>
                  <li className="ml-4">Op basis van appel</li>
                  <li className="ml-4">
                    Kan sporen bevatten van appel, peren, noten, honing
                  </li>
                  <li>
                    <span className="font-medium">Alcoholpercentage:</span> 43%
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Bewaren</h3>
                <p className="text-gray-700">
                  Koel & donker bewaren, wij raden het aan om hem op
                  kamertemperatuur te nuttigen en naar eigen smaak een ijsblokje
                  in te laten verdampen.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Productbeschrijving</h3>
              <div className="prose max-w-none">
                <p>Informatie:</p>
                <p>
                  Met ambacht en liefde is dit mooie distillaat tot stand
                  gekomen
                </p>
                <p>
                  Blozende appels zijn met zorg uitgekozen en met passie
                  gedistilleerd tot een hartverwarmende drank
                </p>
                <p>
                  Deze Grande Cuvée Calva is gecreëerd in de voormalige kerk te
                  Sint Jansteen, thans The Holy Spiritus, als herinnering aan de
                  rijke traditie van distilleren.
                </p>
                <p>
                  De volle smaak en kleur zijn bekomen na 18 maanden rijping in
                  een Frans eiken vat
                </p>
                <p>Heavy Toasted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Gerelateerde producten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <div className="relative h-64 bg-gray-100">
                      {relatedProduct.images && relatedProduct.images[0] && (
                        <Image
                          src={relatedProduct.images[0].src}
                          alt={
                            relatedProduct.images[0].alt || relatedProduct.name
                          }
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2 h-14">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-2 font-bold">
                        €{parseFloat(relatedProduct.price).toFixed(2)}
                      </div>
                      <button className="mt-2 w-full bg-primary text-white py-2 px-4 rounded text-sm">
                        Bekijk product
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
