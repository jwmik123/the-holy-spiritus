"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/cartContext";

interface OrderStatus {
  status: string;
  id: number;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    async function checkOrder() {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order status");
        }

        const data = await response.json();
        setOrderStatus(data);
        clearCart(); // Clear the cart on successful payment
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order status");
      } finally {
        setLoading(false);
      }
    }

    checkOrder();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
        <p>Please wait while we confirm your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {orderStatus?.status === "processing" ||
        orderStatus?.status === "completed"
          ? "Payment Successful!"
          : "Order Status"}
      </h1>

      {orderStatus && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="mb-4">
            Order #{orderStatus.id} is {orderStatus.status}
          </p>

          {(orderStatus.status === "processing" ||
            orderStatus.status === "completed") && (
            <>
              <p className="text-green-600 mb-4">
                Thank you for your purchase! We'll start processing your order
                right away.
              </p>
              <p>
                You will receive a confirmation email shortly with your order
                details.
              </p>
            </>
          )}

          {orderStatus.status === "pending" && (
            <p className="text-yellow-600">
              Your payment is still being processed. We'll update you once it's
              confirmed.
            </p>
          )}

          {(orderStatus.status === "failed" ||
            orderStatus.status === "cancelled") && (
            <p className="text-red-600">
              There was an issue with your payment. Please try again or contact
              support if the problem persists.
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Return to Shop
        </a>
      </div>
    </div>
  );
}
