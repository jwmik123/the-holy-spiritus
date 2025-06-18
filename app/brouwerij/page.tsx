"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionDivider from "../components/SectionDivider";
import BrouwerijBanner from "../components/BrouwerijBanner";

export default function BrouwerijPage() {
  return (
    <main className="bg-white text-black pb-16">
      <BrouwerijBanner />
      <div className="container mx-auto px-4">
        <SectionDivider icon="bottle" />

        {/* Main Content Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Brouwerij en Stokerij</h2>
          <h3 className="text-2xl font-semibold mb-8 text-primary">
            Van natuurlijke grondstof tot godendrank
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="order-2 md:order-1">
              <p className="mb-6 text-lg">
                Naast 's werelds beste en puurste ciders bedenken we natuurlijk
                nog meer bijzondere dranken in de voormalige Johannes de
                DoperKerk. Want naast een vakkundige brouwerij herbergt The Holy
                Spiritus ook een professionele stokerij onder haar mysterieuze
                dak.
              </p>
              <Link
                href="/evenementen"
                className="bg-primary text-white px-6 py-3 mt-4 inline-block rounded-md hover:bg-opacity-90 transition shadow-md"
              >
                Boek een proeverij
              </Link>
            </div>
            <div className="relative h-[400px] md:h-full order-1 md:order-2">
              <Image
                src="/images/appels.webp"
                alt="Master brewer Tom"
                fill
                className="object-cover rounded-lg shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <SectionDivider icon="glass" />

        {/* Products Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Onze Producten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Charismatische Ciders</h3>
              <p className="text-gray-700">
                Onze ambachtelijke ciders, gebrouwen met de beste Zeeuwse
                appels.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Deftige Distillaten</h3>
              <p className="text-gray-700">
                Unieke distillaten met karakter, gemaakt in onze eigen stokerij.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Hoogstnodige Honingwijn
              </h3>
              <p className="text-gray-700">
                Traditionele honingwijnen met een moderne twist.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Linke Likeuren</h3>
              <p className="text-gray-700">
                Verfijnde likeuren met unieke smaken en aroma's.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">
                Persoonlijke Private Labels
              </h3>
              <p className="text-gray-700">
                Op maat gemaakte dranken voor uw specifieke wensen.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider icon="drop" />

        {/* Horeca Section */}
        <section className="mb-16">
          <div className="bg-primary/10 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">
              SAMENWERKEN MET HORECA, SLIJTERIJEN & GROOTHANDEL
            </h2>
            <h3 className="text-2xl font-semibold mb-4">
              Kansen voor horecaondernemers
            </h3>
            <p className="mb-6 text-lg">
              Stromen bij jou de cider, honingwijn, distillaten en likeuren ook
              door je aderen? In dat geval adem je eigenlijk al The Holy
              Spiritus zonder dat je je er wellicht van bewust bent.
            </p>
            <p className="mb-6 text-lg">
              Hoog tijd dus om snel af te spreken, om samen de business kansen
              die er voor ons beide liggen te bespreken. Klik op onderstaande
              knop voor onze contactgegevens en het webformulier.
            </p>
            <Link
              href="/contact"
              className="bg-primary text-white px-6 py-3 inline-block rounded-md hover:bg-opacity-90 transition shadow-md"
            >
              Neem contact op
            </Link>
          </div>
        </section>

        <SectionDivider icon="bottle" />

        {/* Visit Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            BROUWERIJ & STOKERIJ OPEN VOOR PUBLIEK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative h-[400px]">
              <Image
                src="/images/even-brouwerij.webp"
                alt="Brouwerij Sint Jansteen"
                fill
                className="object-cover rounded-lg shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="mb-4 text-lg">
                Word jij enthousiast van brouwerijen en stokerijen en
                ambachtelijke alcoholische dranken? Of ben je meer iemand die
                wild wordt van streekgebonden natuurproducten, duurzame
                circulaire creaties en outside the box bestemmingsplannen voor
                verlaten kerken?
              </p>
              <p className="mb-4 text-lg">
                Of ben jij juist die persoon die zich geregeld afvraagt welke 43
                producten je van 1 appel kunt maken en hoe de mensheid
                uitgestorven tarwe en roggen rassen terug het landschap in
                krijgt?
              </p>
              <Link
                href="/evenementen"
                className="bg-primary text-white px-6 py-3 mt-4 inline-block rounded-md hover:bg-opacity-90 transition shadow-md"
              >
                Boek een proeverij
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
