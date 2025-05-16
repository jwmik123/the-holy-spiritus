"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AgeRestrictionModal() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Check if user has already confirmed age
    const hasConfirmedAge = localStorage.getItem("ageConfirmed");
    if (hasConfirmedAge === "true") {
      setShowModal(false);
    }
  }, []);

  const handleConfirm = (confirmed: boolean) => {
    if (confirmed) {
      localStorage.setItem("ageConfirmed", "true");
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/ths-logo.png"
            alt="The Holy Spiritus Logo"
            width={200}
            height={100}
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Leeftijdsverificatie
        </h2>
        <p className="text-center mb-6">Bent u 18 jaar of ouder?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleConfirm(true)}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Ja
          </button>
          <button
            onClick={() => handleConfirm(false)}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Nee
          </button>
        </div>
      </div>
    </div>
  );
}
