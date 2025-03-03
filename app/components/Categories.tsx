"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CategoryProps {
  image: string;
  title: string;
}

function CategoryItem({ image, title }: CategoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const bgElement = bgRef.current;
    const containerElement = containerRef.current;

    if (bgElement && containerElement) {
      // Make the background image slightly larger to allow for movement
      gsap.set(bgElement, {
        height: "120%",
        y: "-10%", // Start position slightly up
      });

      // Create the parallax effect - background moves at a different rate than the container
      gsap.to(bgElement, {
        y: "0%", // End position
        ease: "none",
        scrollTrigger: {
          trigger: containerElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Smooth scrolling effect
        },
      });
    }

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative aspect-square overflow-hidden">
      <div
        ref={bgRef}
        className="absolute top-0 left-0 w-full bg-center bg-cover"
        style={{ backgroundImage: `url(/images/${image}.jpg)` }}
      ></div>
      <h3 className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
        {title}
      </h3>
    </div>
  );
}

export default function Categories() {
  const categories = [
    { image: "webshop", title: "Webshop" },
    { image: "brouwerij", title: "Brouwerij" },
    { image: "evenementen", title: "Evenementen" },
  ];

  return (
    <>
      <div className="w-full mx-10 md:mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        {categories.map((category, index) => (
          <CategoryItem
            key={index}
            image={category.image}
            title={category.title}
          />
        ))}
      </div>
    </>
  );
}
