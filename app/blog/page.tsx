import { Metadata } from "next";
import { getWordpressPosts } from "../lib/wordpress";
import { BlogCard } from "../components/BlogCard";
import { Pagination } from "../components/Pagination";

export const metadata: Metadata = {
  title: "Blog | The Holy Spiritus",
  description: "Read the latest blog posts from The Holy Spiritus",
};

export const revalidate = 3600; // Revalidate this page every hour

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get the current page from query parameters, defaulting to 1
  const pageParam = searchParams.page;
  const currentPage =
    typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;

  // Fetch blog posts with pagination
  const { posts, pagination } = await getWordpressPosts(currentPage, 9);

  return (
    <>
      <header className="mb-12 text-center bg-primary pt-32 pb-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="font-kaizer text-6xl md:text-7xl font-normal">
            B
          </span>
          log
        </h1>
        <p className="text-xl  max-w-3xl mx-auto">
          The Holy Spiritus achter gesloten deuren.
        </p>
      </header>
      <main className="container mx-auto px-4  pb-12 max-w-7xl">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination pagination={pagination} basePath="/blog" />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">
              No posts found
            </h2>
            <p className="mt-2 text-gray-600">
              Check back soon for new content.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
