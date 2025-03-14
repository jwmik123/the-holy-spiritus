"use client";
import React, { useRef, useEffect } from "react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const CustomTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle horizontal scrolling with mouse wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const timelineItems: TimelineItem[] = [
    {
      year: "1256",
      title: "Begin van de kerk",
      description: "Gebouwd als parochiekerk voor inwoners van Sint Jansteen.",
    },
    {
      year: "1568-1648",
      title: "De Tachtigjarige Oorlog",
      description:
        "De kerk en vooral de toren komen zwaar beschadigd uit de strijd.",
    },
    {
      year: "1645",
      title: "Nieuwe machthebbers",
      description:
        "Het Land van Hulst en dus ook onze kerk wordt toegeëigend door opstandelingen tegen het Spaanse gezag.",
    },
    {
      year: "1648",
      title: "Van kerk naar fort",
      description:
        "Er werd een verdedigingswal om de kerk heen gelegd en de kerk werd omgebouwd tot een heus fort.",
    },
    {
      year: "1681",
      title: "Nieuwe religieuze stroming",
      description:
        "De vrede keerde terug en de kerk werd weer een kerk, alleen nu een protestantse.",
    },
    {
      year: "1791",
      title: "Katholieken in de schuur",
      description:
        "De katholieken mochten in 1791 alleen een schuurkerk inrichten en pas in 1804 kregen ze de oude kerk terug.",
    },
    {
      year: "1860",
      title: "Nieuwe neogotische kerk",
      description:
        "De kerk was zo vervallen, dat in 1860 een nieuwe neogotische kerk gebouwd werd. Een driebeukige bakstenen kruiskerk, compleet van een geveltoren, ontworpen door P. Soffers.",
    },
    {
      year: "2018",
      title: "The Holy Spiritus",
      description:
        "Twee gepassioneerde fruitwijn-fanaten veranderen de kerk in een ambachtelijke brouwerij en stokerij met neogotische interieurstukken en kleurrijke glas-in-loodramen.",
    },
  ];

  return (
    <div className="w-full overflow-hidden mb-16">
      {/* Timeline container with horizontal scrolling */}
      <div
        ref={containerRef}
        className="timeline-container relative w-full overflow-x-auto hide-scrollbar pb-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="relative min-w-max px-6 md:px-12">
          {/* The continuous horizontal line */}
          <div
            className="absolute h-[2px] bg-primary left-0 right-0"
            style={{ top: "58px" }}
          ></div>

          {/* Timeline items - each with circle and content aligned vertically */}
          <div className="flex">
            {timelineItems.map((item, index) => (
              <div key={index} className="w-60 flex-shrink-0">
                {/* Circle with year */}
                <div className="relative flex justify-center mb-14">
                  <div className="absolute top-[18px] flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white">
                    <span
                      className={`font-bold ${
                        item.year.length > 4 ? "text-sm" : "text-lg"
                      }`}
                    >
                      {item.year}
                    </span>
                  </div>
                </div>

                {/* Content card below circle */}
                <div className="border border-gray-100 p-4 mt-32">
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint for mobile */}
      <div className="text-center text-sm text-gray-500 mt-2 md:hidden">
        Scroll horizontaal om meer te zien →
      </div>

      {/* Custom CSS to hide scrollbar but keep functionality */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .timeline-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CustomTimeline;
