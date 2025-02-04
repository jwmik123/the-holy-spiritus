// app/checkout/page.tsx
"use client";
import { useState } from "react";
import { useCart } from "@/context/cartContext";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

export default function CheckoutPage() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"address" | "payment">("address");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "Joel",
    lastName: "Mik",
    email: "test@ecomagency.nl",
    address: "Kerkstraat 1",
    city: "Hoorn",
    postcode: "2511XC",
    country: "NL", // Default to Netherlands
  });

  const handleAddressSubmit = async (e: React.FormEvent) => {
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
      alert("Payment creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="p-4">Your cart is empty</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {step === "address" ? (
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                className="w-full border p-2 rounded"
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
                Last Name
              </label>
              <input
                type="text"
                required
                className="w-full border p-2 rounded"
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border p-2 rounded"
              value={shippingAddress.email}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                required
                className="w-full border p-2 rounded"
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
              <label className="block text-sm font-medium mb-1">Postcode</label>
              <input
                type="text"
                required
                className="w-full border p-2 rounded"
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Continue to Payment
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
          <div className="space-y-2">
            <button
              onClick={() => handlePayment("ideal")}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Pay with iDEAL"}
            </button>
            <button
              onClick={() => handlePayment("bancontact")}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Pay with Bancontact"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
