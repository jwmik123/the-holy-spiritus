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

// GraphQL query to get posts with pagination and date filtering
const GET_POSTS_QUERY = gql`
  query GetPosts($first: Int!, $after: String, $dateQuery: DateQueryInput) {
    posts(first: $first, after: $after, where: { dateQuery: $dateQuery }) {
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

// GraphQL query to get post dates for archive widget
const GET_POST_DATES_QUERY = gql`
  query GetPostDates($first: Int!) {
    posts(first: $first) {
      nodes {
        date
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
  perPage = 9,
  year?: string,
  month?: string
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
          dateQuery: createDateQuery(year, month),
        }
      );
      after = previousPageData.posts.pageInfo.endCursor;
    }

    // Create date query if year or month is provided
    const dateQuery = createDateQuery(year, month);

    // Now fetch the actual page we want
    const data = await graphQLClient.request<PostsResponse>(GET_POSTS_QUERY, {
      first: perPage,
      after,
      dateQuery,
    });

    // Count total posts with the same filters for pagination
    const countQuery = gql`
      query GetPostCount($dateQuery: DateQueryInput) {
        posts(first: 500, where: { dateQuery: $dateQuery }) {
          nodes {
            id
          }
        }
      }
    `;

    const countData = await graphQLClient.request<PostsResponse>(countQuery, {
      dateQuery,
    });

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

// Helper function to create dateQuery object for GraphQL
function createDateQuery(year?: string, month?: string): any {
  if (!year && !month) return undefined;

  const dateQuery: any = {};

  if (year) {
    dateQuery.year = parseInt(year, 10);
  }

  if (month) {
    // Convert Dutch month name to month number (1-12)
    const monthNames = [
      "januari",
      "februari",
      "maart",
      "april",
      "mei",
      "juni",
      "juli",
      "augustus",
      "september",
      "oktober",
      "november",
      "december",
    ];
    const monthIndex = monthNames.findIndex(
      (m) => m.toLowerCase() === month.toLowerCase()
    );
    if (monthIndex !== -1) {
      dateQuery.month = monthIndex + 1;
    }
  }

  return Object.keys(dateQuery).length ? dateQuery : undefined;
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
        first: 500, // Increased to get all posts
      }
    );

    return data.posts.nodes.map((node) => node.slug);
  } catch (error) {
    console.error("Error fetching WordPress post slugs:", error);
    return [];
  }
}

// Function to get archive data (years and months with posts)
export async function getWordpressArchive(): Promise<{
  [year: string]: string[];
}> {
  try {
    // Fetch all post dates (up to 500, to ensure we get everything)
    const data = await graphQLClient.request<{
      posts: { nodes: { date: string }[] };
    }>(GET_POST_DATES_QUERY, {
      first: 500,
    });

    // Create a map of years to months
    const archiveMap: { [year: string]: Set<string> } = {};

    // Add future years if desired (2025)
    archiveMap["2025"] = new Set();

    data.posts.nodes.forEach((node) => {
      // Date format from WordPress is ISO: YYYY-MM-DDTHH:MM:SS
      const date = new Date(node.date);
      const year = date.getFullYear().toString();
      // Month names in Dutch (Januari, Februari, etc.)
      const month = date.toLocaleString("nl-NL", { month: "long" });

      if (!archiveMap[year]) {
        archiveMap[year] = new Set();
      }

      archiveMap[year].add(month);
    });

    // Convert sets to arrays
    const result: { [year: string]: string[] } = {};
    Object.keys(archiveMap).forEach((year) => {
      result[year] = Array.from(archiveMap[year]).sort((a, b) => {
        // Sort months chronologically
        const monthOrder = [
          "januari",
          "februari",
          "maart",
          "april",
          "mei",
          "juni",
          "juli",
          "augustus",
          "september",
          "oktober",
          "november",
          "december",
        ];
        return (
          monthOrder.indexOf(a.toLowerCase()) -
          monthOrder.indexOf(b.toLowerCase())
        );
      });
    });

    // Sort years in descending order (newest first)
    return Object.fromEntries(
      Object.entries(result).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    );
  } catch (error) {
    console.error("Error fetching WordPress archive data:", error);
    return {};
  }
}
