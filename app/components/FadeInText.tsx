"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FadeInText() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const firstLetterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const textElement = textRef.current;
    if (textElement) {
      // Split text into words, but exclude the firstLetter span
      const splitText = (element: HTMLElement) => {
        // Get all child nodes except the first span (which is our special "O")
        const childNodes = Array.from(element.childNodes).slice(1);

        // Get the text content from remaining nodes
        const text = childNodes.map((node) => node.textContent || "").join("");

        // Remove all nodes except the first span
        while (element.childNodes.length > 1) {
          element.removeChild(element.lastChild!);
        }

        const words: HTMLSpanElement[] = [];

        // Create spans for each word with spaces preserved
        const textWords = text.split(/(\s+)/).filter(Boolean);
        for (let i = 0; i < textWords.length; i++) {
          const word = document.createElement("span");
          word.textContent = textWords[i];

          // Only set opacity 0 for non-whitespace words
          if (!textWords[i].match(/^\s+$/)) {
            word.style.opacity = "0";
            words.push(word);
          }

          element.appendChild(word);
        }

        return words;
      };

      // Split the text and get word elements
      const words = splitText(textElement);

      // Create staggering effect with ScrollTrigger
      gsap.to(words, {
        opacity: 1,
        duration: 0.1,
        ease: "power1.inOut",
        stagger: 0.05,
        scrollTrigger: {
          trigger: textElement,
          start: "top 50%",
          end: "bottom 30%",
          scrub: 1,
          // markers: true, // Uncomment for debugging
        },
      });
    }
  }, []);

  return (
    <div className="relative md:w-1/2 mx-10">
      <p
        className="text-white text-3xl md:text-4xl font-montserrat relative z-10"
        ref={textRef}
      >
        <span
          className="font-kaizer font-normal text-9xl leading-3"
          ref={firstLetterRef}
        >
          O
        </span>
        nze dranken zijn stuk voor stuk unieke creaties. Bedacht in de diepste
        en verlaten krochten van The Holy Spiritus brouwerij. En als je geboren
        wordt in een oude kerk kan het eigenlijk niet anders dan dat je puur en
        bijzonder bent.
      </p>
      <p className="text-white w-full text-3xl md:text-4xl font-montserrat absolute top-0 left-0 opacity-40 z-0">
        <span className="font-kaizer font-normal text-9xl leading-3">O</span>nze
        dranken zijn stuk voor stuk unieke creaties. Bedacht in de diepste en
        verlaten krochten van The Holy Spiritus brouwerij. En als je geboren
        wordt in een oude kerk kan het eigenlijk niet anders dan dat je puur en
        bijzonder bent.
      </p>
    </div>
  );
}
