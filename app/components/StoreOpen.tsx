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

        console.log(data);

        if (data.updateText) {
          setUpdateText(data.updateText);
        } else {
          // Fallback text if no update is available
          setUpdateText("winkel is gesloten op 3 maart van 10:00 tot 18:00");
        }
      } catch (error) {
        console.error("Error fetching store update text:", error);
        // Fallback text in case of error
        setUpdateText("winkel is gesloten op 3 maart van 10:00 tot 18:00");
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
          <p className="mt-2 text-lg">Laden...</p>
        ) : (
          <p
            className="mt-2 text-lg"
            dangerouslySetInnerHTML={{ __html: updateText }}
          />
        )}
      </div>
    </div>
  );
}
