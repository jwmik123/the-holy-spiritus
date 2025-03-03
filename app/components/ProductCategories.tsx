"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/mousewheel";

interface Collection {
  id: string;
  name: string;
  handle: string;
  image: string;
}

export default function ProductCategories() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/products/collections");
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }
        const data = await response.json();

        // Filter out unwanted collections and fix ampersand encoding
        const filteredData = data
          .filter(
            (collection: Collection) =>
              ![
                "Crowdfunding",
                "Merchandise",
                "Geen categorie",
                "Ewan Ewyn",
              ].includes(collection.name)
          )
          .map((collection: Collection) => ({
            ...collection,
            name: collection.name.replace(/&amp;/g, "&"),
          }));

        setCollections(filteredData);
        console.log(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading collections...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Mousewheel]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        className="product-categories-swiper"
      >
        {collections.map((collection) => (
          <SwiperSlide key={collection.id}>
            <Link href={`/collections/${collection.handle}`}>
              <div className="relative w-full aspect-[9/16] group overflow-hidden">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-2xl font-montserrat font-bold">
                    {collection.name}
                  </h3>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
