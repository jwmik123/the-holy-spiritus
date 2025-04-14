"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function StoreOpen() {
  const [updateText, setUpdateText] = useState<string>("Laden...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUpdateText = async () => {
      try {
        const response = await fetch("/api/store-update");
        const data = await response.json();

        // Set update text if available, otherwise use default
        if (data.updateText) {
          setUpdateText(data.updateText);
        } else {
          setUpdateText("Bekijk onze openingstijden op de website");
        }
      } catch (error) {
        console.error("Error fetching store update text:", error);
        setUpdateText("Bekijk onze openingstijden op de website");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpdateText();
  }, []);

  return (
    <div className="absolute -bottom-48 right-48 w-96 h-96 hidden md:block">
      <Image
        src="/images/storeopen.jpg"
        alt="Our store"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] p-4 text-center bg-white text-black">
        {isLoading ? (
          <p className="mt-2 text-lg"></p>
        ) : (
          <div
            className="mt-2 text-lg whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: updateText }}
          />
        )}
      </div>
    </div>
  );
}
