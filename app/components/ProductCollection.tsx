"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Collection {
  id: number;
  name: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  slug: string;
  count: number;
}

export default function ProductCollection() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/products/collections");
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Failed to load collections. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  console.log(collections);

  if (loading) return <div className="p-4">Loading collections...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {collections.map((collection) => (
        <Link
          href={`/collections/${collection.slug}`}
          key={collection.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-lg font-semibold">{collection.name}</h2>
          {/* <Image
            src={collection.image.src}
            alt={collection.image.alt}
            width={100}
            height={100}
          /> */}
          <p className="text-sm text-gray-600">
            {collection.count} {collection.count === 1 ? "product" : "products"}
          </p>
        </Link>
      ))}
    </div>
  );
}
