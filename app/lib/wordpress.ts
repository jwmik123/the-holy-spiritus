import { gql, GraphQLClient } from "graphql-request";
import { JSDOM } from "jsdom";

// Use environment variable for WordPress GraphQL endpoint
const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://theholyspiritus.com/graphql";

const graphQLClient = new GraphQLClient(WORDPRESS_API_URL);

export interface WordpressPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
      media_details?: {
        sizes?: {
          medium?: {
            source_url: string;
          };
          full?: {
            source_url: string;
          };
        };
      };
    }>;
  };
}

export interface PaginationData {
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

// Define GraphQL response types
interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface MediaSize {
  name: string;
  sourceUrl: string;
}

interface PostNode {
  id: string;
  slug: string;
  date: string;
  modified: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      altText?: string;
      mediaDetails?: {
        sizes?: MediaSize[];
      };
    };
  };
}

interface PostEdge {
  node: PostNode;
}

interface PostsResponse {
  posts: {
    pageInfo: PageInfo;
    edges: PostEdge[];
    nodes: { id: string }[];
  };
}

interface PostResponse {
  post: PostNode | null;
}

interface PostSlugsResponse {
  posts: {
    nodes: { slug: string }[];
  };
}

// Helper function to process WordPress content
function processWordPressContent(content: string): string {
  if (!content) return "";

  // First, create a DOM to handle the content
  const dom = new JSDOM(`<!DOCTYPE html><div id="content">${content}</div>`);
  const document = dom.window.document;
  const contentElement = document.getElementById("content");

  // Process shortcodes - remove all shortcodes like [et_pb_section] etc.
  // This regex matches WordPress shortcodes
  let processedContent = content.replace(/\[\/?et_pb_[^\]]+\]/g, "");

  // Clean up any double line breaks that might remain after removing shortcodes
  processedContent = processedContent.replace(/\n\s*\n/g, "\n");

  // Remove any other known shortcode patterns if needed
  processedContent = processedContent.replace(
    /\[\/?[a-zA-Z0-9_-]+(?:\s+[^\]]+)?\]/g,
    ""
  );

  // Replace escaped quotes and other entities
  processedContent = processedContent
    .replace(/&#8221;/g, '"')
    .replace(/&#8220;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  return processedContent.trim();
}

// GraphQL query to get posts with pagination
const GET_POSTS_QUERY = gql`
  query GetPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          slug
          date
          modified
          title
          content
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                sizes {
                  name
                  sourceUrl
                }
              }
            }
          }
        }
      }
      nodes {
        id
      }
    }
  }
`;

// Query to get a single post by slug
const GET_POST_BY_SLUG_QUERY = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      date
      modified
      title
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            sizes {
              name
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

// Query to get all post slugs
const GET_ALL_POST_SLUGS_QUERY = gql`
  query GetAllPostSlugs($first: Int!) {
    posts(first: $first) {
      nodes {
        slug
      }
    }
  }
`;

// Helper function to get image URL by size name
function getImageUrlBySize(
  sizes: MediaSize[] | undefined,
  sizeName: string
): string | undefined {
  if (!sizes) return undefined;
  const size = sizes.find((size) => size.name === sizeName);
  return size?.sourceUrl;
}

// Transform GraphQL post to match WordPress REST API format
function transformPost(post: PostNode): WordpressPost {
  const featuredImageSizes = post.featuredImage?.node?.mediaDetails?.sizes;
  const mediumSizeUrl = getImageUrlBySize(featuredImageSizes, "medium");
  const largeSizeUrl =
    getImageUrlBySize(featuredImageSizes, "large") ||
    getImageUrlBySize(featuredImageSizes, "full");

  // Process content to remove shortcodes and format properly
  const processedContent = processWordPressContent(post.content);
  const processedExcerpt = processWordPressContent(post.excerpt);

  return {
    id: parseInt(post.id, 10),
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    title: {
      rendered: post.title,
    },
    content: {
      rendered: processedContent,
    },
    excerpt: {
      rendered: processedExcerpt,
    },
    featured_media: post.featuredImage?.node ? 1 : 0,
    _embedded: post.featuredImage?.node
      ? {
          "wp:featuredmedia": [
            {
              source_url: post.featuredImage.node.sourceUrl,
              alt_text: post.featuredImage.node.altText,
              media_details: {
                sizes: {
                  medium: {
                    source_url:
                      mediumSizeUrl || post.featuredImage.node.sourceUrl,
                  },
                  full: {
                    source_url:
                      largeSizeUrl || post.featuredImage.node.sourceUrl,
                  },
                },
              },
            },
          ],
        }
      : undefined,
  };
}

export async function getWordpressPosts(
  page = 1,
  perPage = 9
): Promise<{ posts: WordpressPost[]; pagination: PaginationData }> {
  try {
    // For pagination with GraphQL, we need to calculate "after" based on page
    let after = null;
    if (page > 1) {
      // Fetch the cursor for the previous page to get the "after" value
      const previousPageData = await graphQLClient.request<PostsResponse>(
        GET_POSTS_QUERY,
        {
          first: perPage * (page - 1),
          after: null,
        }
      );
      after = previousPageData.posts.pageInfo.endCursor;
    }

    // Now fetch the actual page we want
    const data = await graphQLClient.request<PostsResponse>(GET_POSTS_QUERY, {
      first: perPage,
      after,
    });

    // Count total posts by making a separate query for efficiency
    const countQuery = gql`
      query GetPostCount {
        posts {
          nodes {
            id
          }
        }
      }
    `;
    const countData = await graphQLClient.request<PostsResponse>(countQuery);
    const totalPosts = countData.posts.nodes.length;
    const totalPages = Math.ceil(totalPosts / perPage);

    // Transform each post to match the expected format
    const posts = data.posts.edges.map((edge) => transformPost(edge.node));

    return {
      posts,
      pagination: {
        totalPages,
        currentPage: page,
        totalPosts,
      },
    };
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return {
      posts: [],
      pagination: { totalPages: 0, currentPage: 1, totalPosts: 0 },
    };
  }
}

export async function getWordpressPostBySlug(
  slug: string
): Promise<WordpressPost | null> {
  try {
    const data = await graphQLClient.request<PostResponse>(
      GET_POST_BY_SLUG_QUERY,
      {
        slug,
      }
    );

    if (!data.post) {
      return null;
    }

    return transformPost(data.post);
  } catch (error) {
    console.error("Error fetching WordPress post by slug:", error);
    return null;
  }
}

export async function getAllWordpressPostSlugs(): Promise<string[]> {
  try {
    const data = await graphQLClient.request<PostSlugsResponse>(
      GET_ALL_POST_SLUGS_QUERY,
      {
        first: 100, // Adjust as needed
      }
    );

    return data.posts.nodes.map((node) => node.slug);
  } catch (error) {
    console.error("Error fetching WordPress post slugs:", error);
    return [];
  }
}
