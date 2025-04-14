import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the WordPress domain from environment
    const wpDomain = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";

    // Fetch the 'store-notice' page content
    const response = await fetch(
      `${wpDomain}/wp-json/wp/v2/pages?slug=store-notice`,
      {
        next: { revalidate: 60 }, // Revalidate cache every minute
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    console.log("WordPress Page Response:", JSON.stringify(data, null, 2));

    // Extract content from the first page (if exists)
    let updateText = "";
    if (data && data.length > 0) {
      // Use the rendered content (HTML)
      updateText = data[0].content.rendered || "";

      // Optional: strip some WordPress-specific formatting if needed
      updateText = updateText.replace(/<p>/g, "").replace(/<\/p>/g, "").trim();
    }

    return NextResponse.json({ updateText });
  } catch (error) {
    console.error("Error fetching store update text:", error);
    return NextResponse.json({ updateText: "" }, { status: 500 });
  }
}
