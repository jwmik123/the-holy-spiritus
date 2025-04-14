import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simplified query that follows WPGraphQL for ACF patterns
    const query = `
      {
        # First attempt - check if available in an options page
        # This is the most common approach for site-wide settings
        acfOptionPage(id: "acf-options-store-options", idType: ID) {
          # The field group name would be converted to camelCase
          storeOptions {
            updateText
          }
        }
        
        # Second attempt - check with different option page ID
        acfOptionPage(id: "acf-options", idType: ID) {
          options {
            updateText
          }
        }
        
        # Third attempt - direct access to acfOptions if registered that way
        acfOptions {
          storeOptions {
            updateText
          }
        }
        
        # Last attempt - check homepage for the field
        nodeByUri(uri: "/") {
          ... on Page {
            # Try to get it from the page's acf fields
            acf {
              updateText
            }
          }
        }
      }
    `;

    const response = await fetch(
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        next: { revalidate: 60 }, // Revalidate cache every minute
      }
    );

    const data = await response.json();

    // For debugging - log the response structure to help identify the correct path
    console.log("GraphQL Response Data:", JSON.stringify(data?.data, null, 2));

    if (data.errors) {
      console.error("GraphQL Errors:", JSON.stringify(data.errors, null, 2));
    }

    // Check all possible paths where the field might be found
    const updateText =
      data?.data?.acfOptionPage?.storeOptions?.updateText ||
      data?.data?.acfOptionPage?.options?.updateText ||
      data?.data?.acfOptions?.storeOptions?.updateText ||
      data?.data?.nodeByUri?.acf?.updateText ||
      "";

    return NextResponse.json({ updateText });
  } catch (error) {
    console.error("Error fetching store update text:", error);
    return NextResponse.json(
      { message: "Error fetching store update text", updateText: "" },
      { status: 500 }
    );
  }
}
