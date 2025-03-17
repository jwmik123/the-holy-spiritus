// app/checkout/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, Trash2 } from "lucide-react";
import { Product } from "@/types/product";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

interface ShippingMethod {
  id: string;
  title: string;
  cost: number;
  description?: string;
}

export default function CheckoutPage() {
  const { items, removeFromCart, addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Map<number, Product>>(new Map());
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [step, setStep] = useState<"cart" | "address" | "payment">("cart");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postcode: "",
    country: "NL", // Default to Netherlands
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(true);

  // Fetch products in cart
  useEffect(() => {
    async function fetchCartProducts() {
      if (items.length === 0) {
        setLoadingProducts(false);
        return;
      }

      try {
        const productIds = items.map((item) => item.productId);
        const queryString = productIds.map((id) => `ids[]=${id}`).join("&");
        const response = await fetch(`/api/products/batch?${queryString}`);

        if (!response.ok) {
          throw new Error("Failed to fetch cart products");
        }

        const data = await response.json();
        const productMap = new Map();
        data.forEach((product: Product) => {
          productMap.set(product.id, product);
        });
        setProducts(productMap);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchCartProducts();
  }, [items]);

  // Fetch shipping methods - simplified for fixed cost
  useEffect(() => {
    // Since shipping cost is fixed at €8,95 for both Netherlands and Belgium
    const defaultMethod = {
      id: "flat_rate",
      title: "Standaard verzending",
      cost: 8.95,
      description: "Binnen 3-5 werkdagen geleverd",
    };

    setShippingMethods([defaultMethod]);
    setSelectedShippingMethod(defaultMethod);
    setLoadingShipping(false);
  }, []);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePayment = async (method: "ideal" | "bancontact") => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          paymentMethod: method,
          shippingCost: 8.95, // Fixed shipping cost
          discount: couponApplied ? discountAmount : 0,
          couponCode: couponApplied ? appliedCouponCode : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment creation failed");
      }

      const { checkoutUrl } = await response.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Betaling mislukt. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    items.forEach((item) => {
      const product = products.get(item.productId);
      if (product) {
        subtotal += parseFloat(product.price) * item.quantity;
      }
    });
    return subtotal;
  };

  // Calculate total including shipping (fixed at €8.95)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = 8.95; // Fixed shipping cost for both Netherlands and Belgium
    const total = subtotal + shipping - discountAmount;
    return total > 0 ? total : 0;
  };

  // Handle quantity change
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      // Remove and re-add with new quantity
      removeFromCart(productId);
      addToCart(productId, newQuantity);
    }
  };

  // Handle coupon code application via WooCommerce API
  const applyCoupon = async () => {
    if (couponCode.trim() === "") {
      setCouponError(true);
      setCouponMessage("Voer een couponcode in");
      return;
    }

    setApplyingCoupon(true);
    setCouponError(false);
    setCouponMessage("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          items: items,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setCouponApplied(true);
        setDiscountAmount(data.discountAmount);
        setCouponMessage(data.message);
        setAppliedCouponCode(data.code);
        setCouponCode("");
      } else {
        setCouponError(true);
        setCouponMessage(data.message || "Ongeldige coupon");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError(true);
      setCouponMessage(
        "Er is een fout opgetreden bij het toepassen van de coupon"
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setCouponApplied(false);
    setDiscountAmount(0);
    setCouponMessage("");
    setAppliedCouponCode("");
  };

  if (items.length === 0 && !loadingProducts) {
    return (
      <div className="bg-white min-h-screen pt-24 text-black">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-6">Uw winkelwagen is leeg</h1>
            <p className="mb-8 text-gray-600">
              Het lijkt erop dat u nog geen producten heeft toegevoegd aan uw
              winkelwagen.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition"
            >
              Bekijk onze producten
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 text-black">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Afrekenen</h1>
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-primary">
              Shop
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-primary">Afrekenen</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex justify-between">
            <div
              className={`relative flex flex-col items-center w-1/3 ${
                step === "cart" ? "text-primary" : "text-gray-500"
              }`}
            >
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center z-10 ${
                  step === "cart"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className="text-xs font-medium mt-2">Winkelwagen</div>
            </div>
            <div
              className={`relative flex flex-col items-center w-1/3 ${
                step === "address" ? "text-primary" : "text-gray-500"
              }`}
            >
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center z-10 ${
                  step === "address" || step === "payment"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div className="text-xs font-medium mt-2">Adresgegevens</div>
            </div>
            <div
              className={`relative flex flex-col items-center w-1/3 ${
                step === "payment" ? "text-primary" : "text-gray-500"
              }`}
            >
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center z-10 ${
                  step === "payment"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <div className="text-xs font-medium mt-2">Betaling</div>
            </div>
          </div>
          <div className="relative flex items-center justify-between mt-2">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width:
                    step === "cart"
                      ? "0%"
                      : step === "address"
                      ? "50%"
                      : "100%",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cart & Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            {step === "cart" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4">Winkelwagen</h2>
                {loadingProducts ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => {
                      const product = products.get(item.productId);
                      if (!product) return null;

                      return (
                        <div
                          key={item.productId}
                          className="flex items-center py-4 border-b"
                        >
                          <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                            {product.images && product.images[0] && (
                              <img
                                src={product.images[0].src}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>

                          <div className="ml-4 flex-grow">
                            <Link
                              href={`/product/${product.slug}`}
                              className="font-medium text-gray-800 hover:text-primary"
                            >
                              {product.name}
                            </Link>
                            <div className="text-gray-500 text-sm mt-1">
                              €{parseFloat(product.price).toFixed(2)} per stuk
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="text-gray-500 hover:text-primary"
                              aria-label="Verlaag aantal"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="text-gray-500 hover:text-primary"
                              aria-label="Verhoog aantal"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="font-medium w-24 text-right">
                            €
                            {(
                              parseFloat(product.price) * item.quantity
                            ).toFixed(2)}
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="ml-4 text-gray-400 hover:text-red-500"
                            aria-label="Verwijderen"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Coupon Section */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Couponcode</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Voer een couponcode in"
                      className={`border ${
                        couponError ? "border-red-300" : "border-gray-300"
                      } rounded-md px-3 py-2 flex-grow`}
                      disabled={couponApplied || applyingCoupon}
                    />
                    <button
                      onClick={applyCoupon}
                      className={`${
                        applyingCoupon ? "bg-gray-400" : "bg-primary"
                      } text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition whitespace-nowrap`}
                      disabled={couponApplied || applyingCoupon}
                    >
                      {applyingCoupon ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Bezig...
                        </span>
                      ) : (
                        "Toepassen"
                      )}
                    </button>
                  </div>

                  {couponMessage && (
                    <p
                      className={`mt-2 text-sm ${
                        couponError ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {couponMessage}
                    </p>
                  )}

                  {couponApplied && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-3 flex justify-between items-center">
                      <div>
                        <span className="text-green-600 font-medium">
                          Coupon toegepast: {appliedCouponCode}
                        </span>
                        <p className="text-green-600 text-sm">
                          €{discountAmount.toFixed(2)} korting
                        </p>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={removeCoupon}
                        aria-label="Verwijder coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between">
                  <Link
                    href="/shop"
                    className="flex items-center text-gray-600 hover:text-primary"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    <span>Verder winkelen</span>
                  </Link>
                  <button
                    onClick={() => setStep("address")}
                    className="bg-primary text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition"
                  >
                    Doorgaan naar adresgegevens
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Address Form */}
            {step === "address" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4">Adresgegevens</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Voornaam <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Achternaam <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          email: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Uw e-mailadres wordt gebruikt voor het versturen van
                      orderbevestigingen en facturen
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="Straatnaam en huisnummer"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Plaats <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Postcode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
                        value={shippingAddress.postcode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            postcode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Land <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          country: e.target.value,
                        })
                      }
                    >
                      <option value="NL">Nederland</option>
                      <option value="BE">België</option>
                    </select>
                  </div>

                  {/* Shipping Methods Display - Simplified since there's only one fixed option */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Verzendkosten</h3>

                    <div className="p-3 border rounded-md bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            Standaard verzending
                          </div>
                          <div className="text-sm text-gray-500">
                            Zo snel mogelijk geleverd
                          </div>
                        </div>
                        <div className="font-medium">€8,95</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Wij verzenden naar Nederland en België voor een vast
                      tarief.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep("cart")}
                      className="text-gray-600 hover:text-primary flex items-center"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Terug naar winkelwagen
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition"
                    >
                      Doorgaan naar betaling
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Method */}
            {step === "payment" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4">Betaalmethode</h2>
                <p className="mb-4 text-gray-600">
                  Selecteer uw gewenste betaalmethode om de bestelling af te
                  ronden
                </p>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 hover:border-primary transition cursor-pointer">
                    <button
                      onClick={() => handlePayment("ideal")}
                      disabled={loading}
                      className="w-full flex items-center"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                        <Image
                          src="/images/ideal-logo.png"
                          alt="iDEAL"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-grow text-left">
                        <h3 className="font-medium">iDEAL</h3>
                        <p className="text-sm text-gray-500">
                          Betaal veilig met uw eigen bank
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="border rounded-md p-4 hover:border-primary transition cursor-pointer">
                    <button
                      onClick={() => handlePayment("bancontact")}
                      disabled={loading}
                      className="w-full flex items-center"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                        <Image
                          src="/images/bancontact-logo.png"
                          alt="Bancontact"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-grow text-left">
                        <h3 className="font-medium">Bancontact</h3>
                        <p className="text-sm text-gray-500">
                          Belgische betaalmethode
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setStep("address")}
                    className="text-gray-600 hover:text-primary flex items-center"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Terug naar adresgegevens
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Bestellingsoverzicht</h2>
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order Products Summary */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {items.map((item) => {
                      const product = products.get(item.productId);
                      if (!product) return null;

                      return (
                        <div
                          key={item.productId}
                          className="flex justify-between"
                        >
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-1">
                              {item.quantity}x
                            </span>
                            <span className="line-clamp-1">{product.name}</span>
                          </div>
                          <span className="font-medium">
                            €
                            {(
                              parseFloat(product.price) * item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotaal</span>
                      <span>€{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verzendkosten</span>
                      <span>€8,95</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Korting ({appliedCouponCode})</span>
                        <span>-€{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Totaal</span>
                      <span>€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="pt-4">
                    <label className="block text-sm font-medium mb-2">
                      Opmerkingen bij bestelling (optioneel)
                    </label>
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-md h-20 resize-none focus:ring-primary focus:border-primary"
                      placeholder="Speciale instructies voor levering of andere informatie..."
                    ></textarea>
                  </div>

                  {/* Secure Checkout Note */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Beveiligde betaling met Mollie
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
