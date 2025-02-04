import { NextResponse } from "next/server";

async function fetchWordPressMenu() {
  const query = `
    {
      menus {
        nodes {
          menuItems {
            edges {
              node {
                path
                label
                connectedNode {
                  node {
                    ... on Page {
                      isPostsPage
                      slug
                    }
                  }
                }
              }
            }
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
    }
  );

  const data = await response.json();

  // Transform the WordPress response to match the MenuItem interface
  const menuItems =
    data?.data?.menus?.nodes[0]?.menuItems?.edges.map(
      ({ node }: any, index: number) => ({
        id: index,
        title: node.label || "Untitled",
        url: node.path || "/",
      })
    ) || [];

  return menuItems;
}

export async function GET() {
  try {
    const menuItems = await fetchWordPressMenu();
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}
