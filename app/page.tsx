"use client";
import Link from "next/link";
import StoreOpen from "./components/StoreOpen";
import FadeInText from "./components/FadeInText";
import Categories from "./components/Categories";
import Image from "next/image";
import ProductCategories from "./components/ProductCategories";
import CustomLink from "./components/CustomLink";

export default function Home() {
  return (
    <main className="bg-primary">
      <section
        className="flex flex-col gap-4 h-[90vh] md:h-screen  justify-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, #12161A), url(/images/theholyspiritus2.jpg)",
          backgroundSize: "cover",
          // backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-10 md:mx-auto flex flex-col gap-14">
          <h1 className="font-montserrat uppercase text-white  text-[12vw] md:text-[7vw] leading-[10vw] md:leading-[8vw] font-bold ">
            {/* <span className="font-kaizer font-normal text-[14vw] md:text-[12vw] uppercase">
              V
            </span> */}
            verlichtend <br />
            {/* <span className="font-kaizer font-normal text-[14vw] md:text-[12vw] uppercase">
              D
            </span> */}
            Duurzaam <br />
            {/* <span className="font-kaizer font-normal text-[14vw] md:text-[12vw] uppercase">
              G
            </span> */}
            Gek
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <CustomLink
              href="/shop"
              className="button-secondary w-2/3 text-center md:text-left md:w-auto hover:bg-white hover:text-black transition-all duration-300"
            >
              Webshop
            </CustomLink>
            <CustomLink
              href="/contact"
              className="button-primary w-2/3 text-center md:text-left md:w-auto hover:bg-primary/50  transition-all duration-300"
            >
              Boek een proeverij of workshop
            </CustomLink>
          </div>
        </div>
        <StoreOpen />
      </section>
      <section className="container mx-auto min-h-[80vh] flex items-center">
        <FadeInText />
      </section>
      <section className="container mx-auto flex items-center">
        <Categories />
      </section>
      <section className="min-h-screen bg-white mt-24 py-12 flex items-center justify-center">
        <div className="container mx-10 md:mx-auto justify-between flex flex-col md:flex-row">
          <Image
            src="/images/location.jpg"
            alt="The Holy Spiritus"
            width={500}
            height={500}
            className="w-full md:w-1/3 mb-10 md:mb-0"
          />
          <div className="flex flex-col gap-4 w-full md:w-1/2 justify-center text-black">
            <h2 className="text-4xl font-montserrat font-bold uppercase">
              <span className="font-kaizer font-normal text-9xl">G</span>
              ebrouwen in de kerk
            </h2>
            <h3 className="text-2xl font-montserrat font-light uppercase">
              Proeverij in Zeeland
            </h3>
            <p>
              Vanuit de voormalige Johannes de DoperKerk in Sint Jansteen Hulst
              Vlaanderen; op de grensstreek Nederland-België brouwen en stoken
              wij onze geliefde dranken. Maar voor wij hier het eerste vat
              plaatste is er heel wat gebeurd.
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
              Word jij enthousiast van brouwerijen en stokerijen en
              ambachtelijke alcoholische dranken? Of ben je meer iemand die wild
              wordt van streekgebonden natuurproducten, duurzame circulaire
              creaties en outside the box bestemmingsplannen voor verlaten
              kerken? Of ben jij juist die persoon die zich geregeld afvraagt
              welke 43 producten je van 1 appel kunt maken en hoe de mensheid
              uitgestorven tarwe en roggen rassen terug het landschap in krijgt?
            </p>
            <div className="flex">
              <Link href="/contact" className="button-primary">
                Boek een proeverij
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-10 md:mx-auto">
          <h2 className="text-4xl text-white font-montserrat font-bold uppercase">
            <span className="font-kaizer font-normal text-9xl">P</span>
            roducten
          </h2>
          <p className="text-2xl text-white font-montserrat font-light w-2/3 mt-4">
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
