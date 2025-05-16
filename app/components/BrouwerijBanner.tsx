"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const BrouwerijBanner = () => {
  const bannerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the title
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Animate the subtitle
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });

      // Animate the text
      gsap.from(textRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "power3.out",
      });
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={bannerRef}
      className="relative overflow-hidden py-20 mb-16 mt-10"
    >
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl font-bold text-white mb-4 font-montserrat"
            >
              Brouwerij <span className="block md:inline">& Stokerij</span>
            </h1>

            <h2
              ref={subtitleRef}
              className="text-3xl md:text-4xl font-kaizer text-white opacity-90 mb-6"
            >
              Van natuurlijke grondstof tot godendrank
            </h2>

            <p ref={textRef} className="text-white text-lg opacity-90 max-w-xl">
              Ontdek onze ambachtelijke brouwerij en stokerij in de voormalige
              Sint Johannes de Doper Kerk. Waar we met passie en precisie de
              beste dranken creëren.
            </p>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-black/20 rounded-lg overflow-hidden">
              <img
                src="/images/brouwerij.webp"
                alt="The Holy Spiritus Brouwerij"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrouwerijBanner;
