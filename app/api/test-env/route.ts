// app/api/test-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    wpUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    hasConsumerKey: !!process.env.WC_CONSUMER_KEY,
    hasConsumerSecret: !!process.env.WC_CONSUMER_SECRET,
  });
}
