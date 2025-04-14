"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import CustomTimeline from "../components/HorizontalTimeline";
import AboutBanner from "../components/AboutBanner";
import SectionDivider from "../components/SectionDivider";

// Partner logo slider component defined properly
const PartnerLogoSlider = () => {
  // List of partners with their information
  const partners = [
    {
      id: 1,
      name: "Landwinkel",
      logo: "/images/partner1.png",
      description:
        "Voor onze appels, peren en zoete kersen kloppen we aan bij de lokale Zeeuwse boomgaard van Landwinkel.",
      url: "https://landwinkeloudestoof.nl/",
    },
    {
      id: 2,
      name: "De Reyngaard",
      logo: "/images/partner2.png",
      description:
        "Unieke biologische teler die zijn planten op succesvolle wijze lessen in zelfredzaamheid bijbrengt.",
      url: "",
    },
    {
      id: 3,
      name: "Zeker Zeeuws",
      logo: "/images/partner3.png",
      description:
        "Zeker Zeeuws Streekproduct is een onafhankelijk erkend streekkeurmerk dat garandeert dat een product echt Zeeuws is.",
      url: "https://www.keurmerkzekerzeeuws.nl/bedrijven/the-holy-spiritus-bv/",
    },
    {
      id: 4,
      name: "Smaak van Waas",
      logo: "/images/partner4.png",
      description:
        "De Smaak van het Waasland op je bord. Boergondisch genieten met producten, gemaakt, gekweekt of geteeld door sympathieke Waaslanders van achter je hoek.",
      url: "https://www.smaakvanwaas.be/",
    },
    {
      id: 5,
      name: "Café Het Verdronken Land",
      logo: "/images/partner5.png",
      description:
        "Authentieke plek met meer dan 100 jaar geschiedenis waar je kunt genieten van de drankjes van The Holy Spiritus.",
      url: "https://verdronkenland.nl/",
    },
    {
      id: 6,
      name: "Zeeuwse Zaken",
      logo: "/images/partner6.png",
      description:
        "Dé groothandel in Zeeuwse Vlaggen, Zeeuwse souvenirs en cadeau's, Zeeuwse streekproducten, en relatiegeschenken.",
      url: "https://www.zld.nl/?s=The+Holy+Spiritus&post_type=product&type_aws=true",
    },
    {
      id: 7,
      name: "Boeren en Buren",
      logo: "/images/partner7.png",
      description:
        "Korte Keten samenwerking waar we elke woensdag onze deuren openstaan bij de Buurderij Sint Jansteen.",
      url: "https://boerenenburen.nl/nl-NL/producers/39870",
    },
    {
      id: 8,
      name: "Lekkerder bij de boer",
      logo: "/images/partner8.png",
      description:
        "The Holy Spiritus werkt graag samen met de plaatselijke landbouwers en ondersteunen de korte keten.",
      url: "https://lekkerder.nl/sap-en-drank",
    },
    {
      id: 9,
      name: "Wood Architects",
      logo: "/images/partner9.png",
      description:
        "Constructie- en afbouwarchitecten met een voorliefde voor hout, gefocust op een minimale ecologische voetafdruk.",
      url: "https://ache-ligno.be/",
    },
    {
      id: 10,
      name: "Dockwise",
      logo: "/images/partner10.png",
      description:
        "Helpt ondernemers met een programma op maat, innovatieve challenges en spraakmakende events.",
      url: "https://www.dockwize.nl/over/over-dockwize",
    },
    {
      id: 11,
      name: "ILVO",
      logo: "/images/partner11.png",
      description:
        "Instituut voor Landbouw- Visserij- en Voedingsonderzoek voor multidisciplinair, onafhankelijk onderzoek.",
      url: "https://www.ilvo.vlaanderen.be/",
    },
    {
      id: 12,
      name: "OC West",
      logo: "/images/partner12.png",
      description:
        "OC West stimuleert ondernemerschap en biedt ruimte en ondersteuning aan de Vlaamse ondernemers.",
      url: "https://www.ocwest.be/nl",
    },
    {
      id: 13,
      name: "Hoogenschool Zeeland",
      logo: "/images/partner13.png",
      description:
        "Praktijkgericht kennisinstituut voor onderzoek, onderwijs en innovatie, dat warme banden onderhoud met onze zilte regio.",
      url: "https://hz.nl/",
    },
    {
      id: 14,
      name: "E-Commitment",
      logo: "/images/partner14.png",
      description:
        "Samen met ecommit creëren we bewustzijn en actie voor een duurzamere toekomst. The Holy Spiritus is trots dat we CO2 Neutraal zijn.",
      url: "https://ecommit.nl/klanten/the-holy-spiritus-bv",
    },
    {
      id: 15,
      name: "Impuls Zeeland",
      logo: "/images/partner15.png",
      description:
        "Helpt ondernemers met innoveren, investeren en internationaliseren als onafhankelijke partij met een breed netwerk.",
      url: "https://www.impulszeeland.nl/",
    },
    {
      id: 16,
      name: "Gemeente Hulst",
      logo: "/images/partner16.png",
      description:
        "Sinds 1961 beheerder van onze mooie regio met oog op mens, dier en milieu, in alle rangen en standen, voor nu en in de toekomst.",
      url: "https://www.gemeentehulst.nl/",
    },
    {
      id: 17,
      name: "Provincie Zeeland",
      logo: "/images/partner17.png",
      description:
        "Met een mondiale visie is de provincie gericht op economische ontwikkeling, groei en innovatie van Zeeland.",
      url: "https://www.zeeland.nl/over-ons",
    },
    {
      id: 18,
      name: "Grenspark Groot Saeftinghe",
      logo: "/images/partner18.png",
      description:
        "Op de grens van België en Nederland, waar verschillende culturen, landschappen en smaken samenkomen.",
      url: "https://www.grensparkgrootsaeftinghe.eu/over-het-grenspark/ons-verhaal/",
    },
    {
      id: 19,
      name: "Monumenten.nl",
      logo: "/images/partner19.png",
      description:
        "Gids in het Nederlandse monumentenlandschap en beschermheer van onze authentieke nationale cultuurhistorische waarde.",
      url: "https://www.monumenten.nl/soorten-monumenten/rijksmonument",
    },
    {
      id: 20,
      name: "Music & Media Webdesign en Reclame",
      logo: "/images/partner20.png",
      description:
        "Ontwikkelt websites & webshops, verzorgt zoekmachine optimalisatie, ontwerpt logo's, huisstijlen en print reclame.",
      url: "https://musicenmedia.nl/",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-white/10 backdrop-blur-sm py-10 px-4 rounded-xl">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={1000}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="partners-slider"
      >
        {partners.map((partner) => (
          <SwiperSlide key={partner.id}>
            <div className="block h-48 bg-white rounded-lg flex flex-col p-6 shadow-lg">
              {/* If you have partner logos, use this Image component */}
              {/* <Image 
                src={partner.logo} 
                alt={partner.name} 
                width={120} 
                height={80} 
                className="object-contain mb-4"
              /> */}

              {/* Partner content */}
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-black font-bold text-lg mb-2">
                    {partner.name}
                  </h4>
                  <p className="text-black text-sm leading-snug">
                    {partner.description}
                  </p>
                </div>

                {partner.url && (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium text-sm mt-3 inline-flex items-center hover:underline"
                  >
                    Ga naar partner
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Main page component
export default function OverOnsPage() {
  return (
    <main className="bg-white text-black pb-16">
      <AboutBanner />
      <div className="container mx-auto px-4">
        <SectionDivider icon="bottle" />

        {/* Church Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Een gebouw met een liedje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative h-[400px] md:h-full order-2 md:order-1">
              <Image
                src="/images/location.jpg"
                alt="Sint Johannes de Doper Kerk"
                fill
                className="object-cover rounded-lg shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-4">
                <span className="font-kaizer font-normal text-5xl">S</span>int
                Johannes de Doper Kerk in Sint Jansteen
              </h3>
              <p className="mb-4 text-lg">
                Als je zo gepassioneerd bezig bent als wij met het bedenken van
                de meest uiteenlopende dranken voelt elke creatie als een
                geboorte. Toen we dus nadachten over een locatie die waardig
                genoeg is om al onze dranken te herbergen, zijn ze allemaal de
                revue gepasseerd. Wolkenkrabbers, productieloodsen, industriële
                panden, statige herenhuizen, kerken, tempels en alle andere
                soorten gebedshuizen, oude winkelpanden en verlaten fabrieken
                uit de vorige eeuw.
              </p>
              <p className="mb-4 text-lg">
                Geen van alle konden ze onze goedkeuring dragen. Maar toen we
                hoorde van een gebouw met een eigen lijflied werd onze
                nieuwsgierigheid opnieuw getriggerd. Het lied paste bij onze
                plannen en had zelfs de tand des tijds overleefd. Dus toen we
                het lied hoorden, terwijl we voor het eerst oog in oog stonden
                met dit bijzondere pand wisten we het meteen. THIS IS THE ONE!
              </p>
              <Link
                href="/contact"
                className="bg-primary text-white px-6 py-3 mt-4 inline-block rounded-md hover:bg-opacity-90 transition shadow-md"
              >
                Boek een rondleiding en een proeverij
              </Link>
              <blockquote className="italic border-l-4 border-primary pl-4 py-4 my-6 text-gray-700 bg-gray-50 rounded-r-md">
                "Uit het zachte licht der kaarsen,
                <br />
                Uit het tere dode lijf,
                <br />
                Spreekt de liefde van de Meester,
                <br />
                Waar de Doper naar verwijst.
                <br />
                <br />
                In het kleine koorgestoelte,
                <br />
                In het altaar langs de kant,
                <br />
                Ademt dieper het mysterie
                <br />
                En neemt het spirituele ons bij de hand"
              </blockquote>
            </div>
          </div>
        </section>

        <SectionDivider icon="leaf" />

        {/* Church History Timeline */}
        <section className="mb-16 bg-gray-50 py-16 -mx-4 px-4">
          <div className=" mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              De geschiedenis van onze kerk in een notendop
            </h2>
            <p className="text-xl mb-8 text-center max-w-3xl mx-auto">
              De avonturen van de Sint Johannes de DoperKerk
            </p>
            <p className="mb-8 text-lg text-center max-w-3xl mx-auto">
              Vandaag de dag huisvest de Sint Johannes de Doper Kerk in Sint
              Jansteen The Holy Spiritus BV. Maar voor het zover was heeft onze
              geliefde brouwerij een hoop voor de kiezen gehad.
            </p>

            {/* Include the custom timeline component that matches the design */}
            <CustomTimeline />
          </div>
        </section>

        <SectionDivider icon="glass" />

        {/* Founders Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Maak kennis met onze oprichters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Tom */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md transform hover:scale-[1.02] transition-transform duration-300">
              <div className="relative h-[400px] mb-6">
                <Image
                  src="/images/tom.webp"
                  alt="Tom Genbrugge"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Tom Genbrugge</h3>
              <h4 className="text-lg font-medium text-primary mb-4">
                Goede vriend van Johannes de Doper
              </h4>
              <p className="mb-4 text-lg">
                Ik ben Tom Genbrugge. Op deze foto doe ik erg mijn best serieus
                over te komen. En ik moet eerlijk zeggen, dat is behoorlijk goed
                gelukt. Waarom ik dit op dat moment zo wilde, weet ik nu
                eigenlijk ook niet meer. Misschien de spanning van de fotoshoot.
              </p>
              <p className="mb-4 text-lg">
                Maar gelukkig is dit slecht één kant van mijn veelzijdige
                karakter. Want volgens Goderic zijn mijn opgewekte humeur, focus
                en vindingrijkheid mijn meest kenmerkende karaktereigenschappen.
                Dankjewel Goderic.
              </p>
              <p className="text-lg">
                Ook een master brewer heeft trouwens hobby's. Zo hou ik van
                Keltische festivals, filosofie en ambachtelijke
                renovatietechnieken.
              </p>
            </div>

            {/* Goderic */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md transform hover:scale-[1.02] transition-transform duration-300">
              <div className="relative h-[400px] mb-6">
                <Image
                  src="/images/goderic.webp"
                  alt="Goderic van den Brande"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Goderic van den Brande
              </h3>
              <h4 className="text-lg font-medium text-primary mb-4">
                Ook 'n goede vriend van Johannes de Doper
              </h4>
              <p className="mb-4 text-lg">
                Ik ben Goderic Van den Brande. Volgens Tom ben ik onderhoudend,
                creatief en nieuwsgierig. En eerlijk gezegd had ik het niet
                beter kunnen verwoorden. Dus dankjewel Tom.
              </p>
              <p className="mb-4 text-lg">
                In onze samenwerking ben ik dan ook de creatieve doorzetter,
                gastheer en de stille drijvende kracht. Net als Tom stop ik veel
                tijd en energie in onze brouwerij, maar ook in de duurzame
                inzetbaarheid van appelpulp samen met o.a. de Hogeschool van
                Gent.
              </p>
              <p className="text-lg">
                In mijn vrije tijd gooi ik het graag over een hele andere boeg.
                Ik ben namelijk een echte liefhebber van flora en fauna, textiel
                en mode en draag graag mijn steentje bij aan het succes van de
                Keltische festivals in de Benelux. Hier dan niet als
                organisator, maar als enthousiaste participant.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider icon="drop" />

        {/* Partner Logos Slider */}
        <section className="mt-24 mb-16">
          <div className="bg-primary py-16 px-4 -mx-4 rounded-t-3xl">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center text-white">
                Onze Partners
              </h2>
              <p className="text-lg text-center text-white/90 mb-12 max-w-3xl mx-auto">
                Wij werken samen met diverse partners die onze passie voor
                authenticiteit en kwaliteit delen
              </p>
              <PartnerLogoSlider />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
