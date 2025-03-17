// app/api/shipping/methods/route.ts
import { NextResponse } from "next/server";

// Simple shipping API that returns the fixed shipping costs
export async function GET(request: Request) {
  // Get country from query parameters if needed for future expansion
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "NL";

  // Since both Netherlands and Belgium have the same shipping cost of €8,95
  const shippingMethods = [
    {
      id: "flat_rate",
      title: "Standaard verzending",
      cost: 8.95,
      description: "Zo snel mogelijk geleverd",
    },
  ];

  // You could add different shipping methods in the future if needed

  return NextResponse.json(shippingMethods);
}
