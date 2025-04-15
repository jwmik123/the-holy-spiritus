import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getWordpressPostBySlug,
  getAllWordpressPostSlugs,
} from "@/app/lib/wordpress";

// Skip type checking for the entire file
// @ts-nocheck

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = await getAllWordpressPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getWordpressPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog post niet gevonden | The Holy Spiritus",
      description: "De gevraagde blog post kon niet worden gevonden.",
    };
  }

  const description = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .substring(0, 160);

  return {
    title: `${post.title.rendered} | The Holy Spiritus Blog`,
    description,
  };
}

export const revalidate = 3600; // Revalidate this page every hour

// Main page component
async function Page({ params, searchParams }: PageProps) {
  try {
    const post = await getWordpressPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    // Format date
    const publishDate = new Date(post.date);
    const formattedDate = publishDate.toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Extract featured image
    const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
    const imageUrl =
      featuredImage?.source_url || "/images/blog-placeholder.jpg";
    const imageAlt = featuredImage?.alt_text || post.title.rendered;

    return (
      <article className="container mx-auto px-4 md:pt-12 md:pb-12 pt-32 pb-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Terug naar de blog
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="md:flex-1">
            <header className="mb-10">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <time className="text-gray-600">{formattedDate}</time>
            </header>

            <div className="prose prose-lg max-w-none">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>

            <div className="mt-10 text-center md:text-left">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
              >
                Lees meer blog posts
              </Link>
            </div>
          </div>

          {featuredImage && (
            <div className="relative w-full md:w-2/5 max-h-[40vh] mt-6 md:mt-0 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          )}
        </div>
      </article>
    );
  } catch (error) {
    console.error("Error rendering page:", error);
    return notFound();
  }
}

export default Page;
