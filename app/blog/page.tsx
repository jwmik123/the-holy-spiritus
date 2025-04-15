import { Metadata } from "next";
import { getWordpressPosts, getWordpressArchive } from "../lib/wordpress";
import { BlogCard } from "../components/BlogCard";
import { Pagination } from "../components/Pagination";
import { ArchiveWidget } from "../components/ArchiveWidget";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | The Holy Spiritus",
  description: "Lees de nieuwste blogberichten van The Holy Spiritus",
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

  // Get year and month from query parameters
  const yearParam = searchParams.year;
  const monthParam = searchParams.month;
  const year = typeof yearParam === "string" ? yearParam : undefined;
  const month = typeof monthParam === "string" ? monthParam : undefined;

  // Fetch blog posts with pagination and filtering by year/month if provided
  const { posts, pagination } = await getWordpressPosts(
    currentPage,
    9,
    year,
    month
  );

  // Fetch archive data
  const archiveData = await getWordpressArchive();

  return (
    <>
      <header className="mb-12 text-center bg-primary pt-32 pb-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="font-kaizer text-6xl md:text-7xl font-normal">
            B
          </span>
          log
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          The Holy Spiritus achter gesloten deuren.
        </p>
      </header>
      <div className="container mx-auto px-4 pb-12 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content area */}
          <main className="flex-1">
            {year || month ? (
              <div className="mb-6 bg-amber-50 p-4 rounded-md flex justify-between items-center">
                <h2 className="text-lg text-gray-800">
                  Berichten van {month ? `${month} ` : ""}
                  {year || ""}
                </h2>
                <Link
                  href="/blog"
                  className="text-primary hover:text-amber-700 font-medium text-sm"
                >
                  Filter wissen
                </Link>
              </div>
            ) : null}

            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                <Pagination
                  pagination={pagination}
                  basePath="/blog"
                  searchParams={searchParams}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Geen berichten gevonden
                </h2>
                <p className="mt-2 text-gray-600">
                  Kom binnenkort terug voor nieuwe content.
                </p>
              </div>
            )}
          </main>

          {/* Sidebar with archive widget */}
          <aside className="w-full md:w-64 lg:w-80">
            <ArchiveWidget archiveData={archiveData} />
          </aside>
        </div>
      </div>
    </>
  );
}
