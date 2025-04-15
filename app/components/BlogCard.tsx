import Image from "next/image";
import Link from "next/link";
import { WordpressPost } from "../lib/wordpress";

export function BlogCard({ post }: { post: WordpressPost }) {
  // Extract featured image URL
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl =
    featuredImage?.media_details?.sizes?.medium?.source_url ||
    featuredImage?.source_url ||
    "/images/blog-placeholder.jpg"; // Fallback image

  const altText = featuredImage?.alt_text || post.title.rendered;

  // Format date
  const publishDate = new Date(post.date);
  const formattedDate = publishDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create excerpt from content if needed
  const excerpt = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <time className="text-sm text-gray-500 mb-2">{formattedDate}</time>
        <h3
          className="text-xl font-semibold mb-2 group-hover:text-amber-700 transition-colors"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {excerpt && (
          <div
            className="text-gray-600 mt-auto"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}

        <div className="mt-4 text-amber-700 font-medium group-hover:underline">
          Lees meer
        </div>
      </div>
    </Link>
  );
}
