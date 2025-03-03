"use client";
import Image from "next/image";

export default function StoreOpen() {
  return (
    <div className="absolute -bottom-48 right-48 w-96 h-96 hidden md:block">
      <Image
        src="/images/storeopen.jpg"
        alt="Our store"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2  w-[80%] p-4 text-center bg-white text-black">
        <p className="mt-2 text-lg">
          winkel is gesloten op 3 maart van 10:00 tot 18:00
        </p>
      </div>
    </div>
  );
}
