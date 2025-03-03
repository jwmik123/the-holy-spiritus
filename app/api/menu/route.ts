// app/api/menu/route.ts
import { NextResponse } from "next/server";

interface WordPressMenuItem {
  node: {
    id: string;
    label: string;
    path: string;
    parentId: string | null;
    connectedNode: {
      node: {
        slug: string;
        isPostsPage: boolean;
      };
    };
  };
}

async function fetchWordPressMenu() {
  const query = `
    {
      menus {
        nodes {
          menuItems {
            edges {
              node {
                id
                label
                path
                parentId
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
  const edges: WordPressMenuItem[] =
    data?.data?.menus?.nodes[0]?.menuItems?.edges || [];

  // Create a map for quick lookup and build hierarchy
  const menuMap = new Map();
  const menuItems: any[] = [];

  // First pass: create all items and add to map
  edges.forEach(({ node }, index) => {
    const menuItem = {
      id: node.id,
      title: node.label || "Untitled",
      url: node.connectedNode?.node?.slug
        ? `/${node.connectedNode.node.slug}`
        : node.path || "/",
      parentId: node.parentId,
      children: [],
    };

    menuMap.set(node.id, menuItem);

    if (!node.parentId) {
      menuItems.push(menuItem);
    }
  });

  edges.forEach(({ node }) => {
    if (node.parentId) {
      const parent = menuMap.get(node.parentId);
      if (parent) {
        parent.children.push(menuMap.get(node.id));
      }
    }
  });

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
