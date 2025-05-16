"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionDivider from "../components/SectionDivider";
import EventBanner from "../components/EventBanner";
import ContactForm from "../components/ContactForm";

export default function EventsPage() {
  return (
    <main className="bg-white text-black pb-16">
      <EventBanner />
      <div className="container mx-auto px-4">
        <SectionDivider icon="bottle" />

        {/* Proeverij Intro Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Jouw Proeverij in onze voormalige kerk
          </h2>
          <h3 className="text-2xl font-semibold mb-8 text-primary">
            Van privéproeverij tot business proeverij
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="order-2 md:order-1">
              <p className="mb-6 text-lg">
                Als meesterbrein achter al die heerlijke bijzondere dranken
                heeft onze Master brewer Tom natuurlijk maar één wens. En dat is
                dat al zijn creaties met enthousiasme en veel plezier gedronken
                worden. Om dit te realiseren werken we natuurlijk nauw samen met
                lokale en regionale slijterijen, horeca en groothandels.
              </p>
              <Link
                href="#contact"
                className="bg-primary text-white px-6 py-3 mt-4 inline-block rounded-md hover:bg-opacity-90 transition shadow-md"
              >
                Boek een proeverij
              </Link>
            </div>
            <div className="relative h-[400px] md:h-full order-1 md:order-2">
              <Image
                src="/images/storeopen.jpg"
                alt="Evenementen en proeverijen"
                fill
                className="object-cover rounded-lg shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 bg-primary/80 text-white p-3 rounded-lg shadow-md">
                <p className="font-semibold">
                  Perfecte plek voor jouw Proeverij
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider icon="glass" />

        {/* Proeverij Experience Section */}
        <section className="mb-16">
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center">
              The Holy Spiritus Proeverij "Een Echte Beleving"
            </h2>
            <p className="mb-6 text-lg">
              Heb je graag eens een originele proeverij in een sfeervolle en
              mysterieuze omgeving? Dan ben je hier aan het juiste adres. Niet
              enkel kan je proeven van wat gecreëerd is in deze toverachtige
              brouwerij, je krijgt bij elke proeverij ook de gelegenheid van een
              begeleide rondleiding doorheen de brouwerij en de distilleerderij
              … Ervaar de geheimen van het brouwen en distilleren in een gebouw
              met karakter dat vraagt om jou te kunnen ontmoeten.
            </p>
          </div>
        </section>

        <SectionDivider icon="bottle" />

        {/* Proeverij Options Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Persoonlijk en op maat gerealiseerd
          </h2>
          <p className="text-lg text-center mb-12">
            Bij elke proeverij op maat zorgen wij voor jouw exclusieve beleving.
            Op maat gemaakte proeverijen met elk zijn eigen karakter in een
            sfeer die bijna nergens anders terug te vinden is …
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 border-b border-primary pb-2">
                Proeverij van 10 - 20 personen
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Smaak de Cider
                </li>
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Heerlijke Mede
                </li>
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Streekproducten proeven
                </li>
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Ervaar Distillaten
                </li>
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Lokale producten
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 border-b border-primary pb-2">
                Voor wie
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Zakelijk of particulier
                </li>
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Grensoverschrijdend
                </li>
                <li className="flex items-center">
                  <span className="bg-primary text-white p-1 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Samenwerken met evenementen bureaus
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-primary/10 p-8 rounded-lg mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Proeverij organiseren in een voormalige kerk
            </h3>
            <p className="mb-4 text-lg">
              Hou jij zo van genieten dat je zelfs je beroep gemaakt hebt van
              het organiseren van proeverijen? In dat geval adem je eigenlijk al
              The Holy Spiritus zonder dat je je er wellicht van bewust bent.
              Hoog tijd dus om snel af te spreken, om samen de business kansen
              die er voor ons beiden liggen te bespreken. Klik op onderstaande
              knop voor onze contactgegevens en het webformulier.
            </p>
            <Link
              href="#contact"
              className="bg-primary text-white px-6 py-3 inline-block rounded-md hover:bg-opacity-90 transition shadow-md"
            >
              Informeer naar de zakelijke kansen
            </Link>
          </div>
        </section>

        <SectionDivider icon="glass" />

        {/* Proeverij Packages Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-center">
            The Holy Spiritus Kerk open voor publiek
          </h2>
          <h3 className="text-2xl font-semibold mb-10 text-center text-primary">
            Jouw proeverij en beleving in onze voormalige kerk
          </h3>
          <p className="mb-6 text-lg text-center">
            Wil jij De Echte Beleving van onze Proeverijen? Hieronder heb je al
            enkele voorbeelden:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Proeverij Package 1 */}
            <Link href="/product/proeverij-bee-my-sweety" className="block">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-primary text-white p-4">
                  <h3 className="text-xl font-bold text-center">
                    Bee My Sweety
                  </h3>
                  <p className="text-center text-white/90">€15,00-/persoon</p>
                </div>
                <div className="p-6">
                  <p className="mb-4">
                    Een begeleide rondleiding doorheen de Brouwerij &
                    Distilleerderij met een Proeverij van onder andere Zeeuwse
                    Cider Brut en 6 variaties van onze heerlijke zoete Mede
                    (Honingwijnen/Mead), plus 2 koffielikeuren vergezeld van een
                    knabbel en een flesje water om ervoor te zorgen dat de drank
                    niet te sterk naar het hoofd stijgt. Dit alles in een
                    sfeervolle en geestrijke omgeving.
                  </p>
                  <p className="text-sm font-medium text-gray-600 mt-4">
                    (minimum 10 personen per proeverij)
                  </p>
                </div>
              </div>
            </Link>

            {/* Proeverij Package 2 */}
            <Link
              href="/product/proeverij-love-2-switch-e25-00-1-persoon"
              className="block"
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-primary text-white p-4">
                  <h3 className="text-xl font-bold text-center">
                    Love 2 Switch
                  </h3>
                  <p className="text-center text-white/90">€20,00-/persoon</p>
                </div>
                <div className="p-6">
                  <p className="mb-4">
                    Een begeleide rondleiding doorheen de Brouwerij &
                    Distilleerderij met een Proeverij van onder andere Zeeuwse
                    Cider Brut, 2 verschillende Vodka's en 3 verschillende Gin's
                    (elk met hun eigen Twist) vergezeld van een knabbel en een
                    flesje water om ervoor te zorgen dat de drank niet te sterk
                    naar het hoofd stijgt. Dit alles in een sfeervolle en
                    geestrijke omgeving.
                  </p>
                  <p className="text-sm font-medium text-gray-600 mt-4">
                    (minimum 10 personen per proeverij)
                  </p>
                </div>
              </div>
            </Link>

            {/* Proeverij Package 3 */}
            <Link
              href="/product/proeverij-youre-the-strongest"
              className="block"
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-primary text-white p-4">
                  <h3 className="text-xl font-bold text-center">
                    You're the Strongest
                  </h3>
                  <p className="text-center text-white/90">€25,00-/persoon</p>
                </div>
                <div className="p-6">
                  <p className="mb-4">
                    Een begeleide rondleiding doorheen de Brouwerij &
                    Distilleerderij met een Proeverij van onder andere Zeeuwse
                    Cider Brut en zeven variaties in Distillaten waaronder Honey
                    Love & Zeeuwse Calva die elks op hunzelf hebben mogen rijpen
                    op vat in deze prachtige omgeving waar wij onze drank delen
                    met de engelen (AngleShare). Daarbij een aangepaste knabbel
                    en een flesje water om ervoor te zorgen dat de drank niet te
                    sterk naar het hoofd stijgt. Dit alles in een sfeervolle en
                    geestrijke omgeving.
                  </p>
                  <p className="text-sm font-medium text-gray-600 mt-4">
                    (minimum 10 personen per proeverij)
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg mb-4">
              Heb jij zelf een andere suggestie voor een proeverij bij ons? Elk
              idee is bespreekbaar.
            </p>
            <p className="text-lg">
              Voor een bestelling van één van deze proeverijen kan je ons
              contacteren onderaan deze pagina. Wij heten je van harte welkom …
            </p>
          </div>
        </section>

        <SectionDivider icon="drop" />

        {/* Contact Form Section */}
        <section id="contact" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Neem contact op
          </h2>
          <p className="text-lg text-center mb-8">
            Interesse in een proeverij of wil je samenwerken? Vul het formulier
            in en we nemen spoedig contact met je op.
          </p>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
