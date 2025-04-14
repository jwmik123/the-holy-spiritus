"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/cartContext";

interface OrderStatus {
  status: string;
  id: number;
}

// Component to handle data fetching with searchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    async function checkOrder() {
      if (!orderId) {
        setError("Geen bestelnummer opgegeven");
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
        setError("Kan de status van de bestelling niet laden");
      } finally {
        setLoading(false);
      }
    }

    checkOrder();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Betaling verwerken</h1>
        <p>Even geduld terwijl we je betaling bevestigen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Fout</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {orderStatus?.status === "processing" ||
        orderStatus?.status === "completed"
          ? "Betaling succesvol!"
          : "Bestelstatus"}
      </h1>

      {orderStatus && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="mb-4">
            Bestelling #{orderStatus.id} is{" "}
            {orderStatus.status === "processing"
              ? "in behandeling"
              : orderStatus.status === "completed"
              ? "voltooid"
              : orderStatus.status === "pending"
              ? "in afwachting"
              : "geannuleerd"}
          </p>

          {(orderStatus.status === "processing" ||
            orderStatus.status === "completed") && (
            <>
              <p className="text-green-600 mb-4">
                Bedankt voor je aankoop! We gaan meteen aan de slag met het
                verwerken van je bestelling.
              </p>
              <p className="mb-2">
                We hebben een bevestigingsmail gestuurd naar het e-mailadres dat
                je bij de bestelling hebt opgegeven.
              </p>
              <p>
                In deze e-mail vind je alle details van je bestelling, inclusief
                het bestelnummer, de bestelde producten en de verzendgegevens.
              </p>
            </>
          )}

          {orderStatus.status === "pending" && (
            <p className="text-yellow-600">
              Je betaling wordt nog verwerkt. We houden je op de hoogte zodra
              deze is bevestigd.
            </p>
          )}

          {(orderStatus.status === "failed" ||
            orderStatus.status === "cancelled") && (
            <p className="text-red-600">
              Er is een probleem opgetreden met je betaling. Probeer het opnieuw
              of neem contact op met onze klantenservice als het probleem
              aanhoudt.
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
        >
          Terug naar de shop
        </a>
      </div>
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bestelstatus laden</h1>
      <div className="animate-pulse bg-gray-200 h-6 w-3/4 mb-4 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-1/2 mb-2 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded"></div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
