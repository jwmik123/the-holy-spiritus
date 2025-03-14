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
  // We'll create a list of partner logos (using placeholder images for now)
  // In a real implementation, you would replace these with actual partner logos
  const partners = [
    { id: 1, name: "Partner 1", logo: "/images/partner1.png" },
    { id: 2, name: "Partner 2", logo: "/images/partner2.png" },
    { id: 3, name: "Partner 3", logo: "/images/partner3.png" },
    { id: 4, name: "Partner 4", logo: "/images/partner4.png" },
    { id: 5, name: "Partner 5", logo: "/images/partner5.png" },
    { id: 6, name: "Partner 6", logo: "/images/partner6.png" },
    { id: 7, name: "Partner 7", logo: "/images/partner7.png" },
    { id: 8, name: "Partner 8", logo: "/images/partner8.png" },
  ];

  return (
    <div className="w-full overflow-hidden bg-white/10 backdrop-blur-sm py-10 px-4 rounded-xl">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={2}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        speed={1000}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="partners-slider"
      >
        {partners.map((partner) => (
          <SwiperSlide key={partner.id}>
            <div className="h-32 bg-white rounded-lg flex items-center justify-center p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
              {/* If you have partner logos, use this Image component */}
              {/* <Image 
                src={partner.logo} 
                alt={partner.name} 
                width={120} 
                height={80} 
                className="object-contain"
              /> */}

              {/* Placeholder for partner logos */}
              <div className="bg-gray-100 w-full h-full rounded flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {partner.name}
                </span>
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
