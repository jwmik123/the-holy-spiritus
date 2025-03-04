"use client";
import Link from "next/link";
import StoreOpen from "./components/StoreOpen";
import FadeInText from "./components/FadeInText";
import Categories from "./components/Categories";
import Image from "next/image";
import ProductCategories from "./components/ProductCategories";
export default function Home() {
  return (
    <main>
      <section
        className="flex flex-col gap-4 h-screen justify-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, black), url(/images/theholyspiritus2.jpg)",
          backgroundSize: "cover",
          // backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto flex flex-col gap-14">
          <h1 className="font-montserrat text-white font-bold flex flex-col text-[7vw] leading-[8vw] uppercase">
            <span>Verlichtend</span>
            <span>Duurzaam</span>
            <span>Gek</span>
          </h1>

          <div className="flex gap-4">
            <Link href="/products" className="button-secondary">
              Webshop
            </Link>
            <Link href="/contact" className="button-primary">
              Boek een proeverij of workshop
            </Link>
          </div>
        </div>
        <StoreOpen />
      </section>
      <section className="container mx-auto h-[50vh] flex items-center">
        <FadeInText />
      </section>
      <section className="container mx-auto flex items-center">
        <Categories />
      </section>
      <section className="h-screen bg-white mt-24 flex items-center justify-center">
        <div className="container mx-10 md:mx-auto justify-between flex flex-col md:flex-row">
          <Image
            src="/images/location.jpg"
            alt="The Holy Spiritus"
            width={500}
            height={500}
            className="w-1/2 md:w-1/3 mb-10 md:mb-0"
          />
          <div className="flex flex-col gap-4 w-full md:w-1/2 justify-center">
            <h2 className="text-4xl font-montserrat font-bold uppercase">
              <span className="font-kaizer font-normal text-9xl">G</span>
              ebrouwen in de kerk
            </h2>
            <h3 className="text-2xl font-montserrat font-light uppercase">
              Proeverij in Zeeland
            </h3>
            <p>
              Vanuit de voormalige Johannes de DoperKerk in Sint Jansteen
              Hulst Vlaanderen; op de grensstreek Nederland-België brouwen en
              stoken wij onze geliefde dranken. Maar voor wij hier het eerste
              vat plaatste is er heel wat gebeurd.
            </p>
            <p>
              Van de meest uiteenlopende regionale grondstoffen brouwen en
              stoken we onze unieke en verlichtende godendranken. Het
              mysterieuze The Holy spiritus ingrediënt houden we nog even
              geheim. Maar de unieke wijze waarop wij met de grootste zorg onze
              grondstoffen selecteren en keuren wil onze Master brewer Tom per
              se nu al met je delen. Is dat slim, wij denken van niet. Maar ja,
              je kent Tom.
            </p>

            <p>
              Ben jij benieuwd waarom wij er juist voor gekozen hebben de
              brouwerij in een kerk te vestigen? Lees dan het hele verhaal van
              The Holy Spiritus.
            </p>
            <div className="flex">
              <Link href="/contact" className="button-primary">
                Boek een proeverij
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto pt-24">
          <h2 className="text-4xl font-montserrat font-bold uppercase">
            <span className="font-kaizer font-normal text-9xl">P</span>
            roducten
          </h2>
          <p className="text-2xl font-montserrat font-light w-2/3 mt-4">
            Stromen bij jou de cider, honingwijn, distillaten en likeuren ook
            door je aderen? In dat geval adem je eigenlijk al The Holy Spiritus
            zonder dat je je er wellicht van bewust bent.
          </p>
        </div>
        <ProductCategories />
      </section>
    </main>
  );
}
