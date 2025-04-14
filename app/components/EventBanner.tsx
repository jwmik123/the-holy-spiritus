// app/components/EventBanner.tsx
"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const EventBanner = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Animation effect when component mounts
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(bannerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 })
      .fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        imageWrapperRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

    // Cleanup
    return () => {
      tl.kill();
    };
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
              Evenementen <span className="block md:inline">& Proeverijen</span>
            </h1>

            <h2
              ref={subtitleRef}
              className="text-3xl md:text-4xl font-kaizer text-white opacity-90 mb-6"
            >
              Beleef de smaak van The Holy Spiritus
            </h2>

            <p ref={textRef} className="text-white text-lg opacity-90 max-w-xl">
              Ontdek onze unieke proeverijen en evenementen in de voormalige
              Sint Johannes de Doper Kerk. Een bijzondere locatie voor een
              onvergetelijke ervaring met onze ambachtelijke dranken.
            </p>
          </div>

          {/* Image */}
          <div ref={imageWrapperRef} className="w-full md:w-1/2 relative">
            <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-xl transform md:rotate-1 border-4 border-white">
              <Image
                src="/images/evenementen-tom-genbrugge-goderic-van-den-brande-the-holy-spiritus.jpg"
                alt="Proeverijen in de kerk"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent"></div>
            </div>

            {/* Decorative bottle icon */}
            <div className="absolute -bottom-10 -left-10 md:left-auto md:-right-10 w-24 h-24 bg-white rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/ths-logo.png"
                  alt="The Holy Spiritus logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventBanner;
