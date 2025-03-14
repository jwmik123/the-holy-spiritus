"use client";
import React from "react";
import { Chrono } from "react-chrono";

const ChronoTimeline: React.FC = () => {
  const items = [
    {
      title: "1256",
      cardTitle: "Begin van de kerk",
      cardSubtitle: "Gebouwd als parochiekerk voor inwoners van Sint Jansteen.",
      cardDetailedText:
        "De oorspronkelijke parochiekerk werd opgericht voor de lokale bewoners van Sint Jansteen.",
    },
    {
      title: "1568-1648",
      cardTitle: "De Tachtigjarige Oorlog",
      cardSubtitle:
        "De kerk en vooral de toren komen zwaar beschadigd uit de strijd.",
      cardDetailedText:
        "Tijdens de Tachtigjarige Oorlog raakte de kerk zwaar beschadigd, met name de toren werd getroffen.",
    },
    {
      title: "1645",
      cardTitle: "Nieuwe machthebbers",
      cardSubtitle:
        "Het Land van Hulst en onze kerk wordt toegeëigend door opstandelingen.",
      cardDetailedText:
        "In 1645 werd het Land van Hulst en dus ook onze kerk toegeëigend door opstandelingen tegen het Spaanse gezag.",
    },
    {
      title: "1648",
      cardTitle: "Van kerk naar fort",
      cardSubtitle: "De kerk wordt omgebouwd tot een versterking.",
      cardDetailedText:
        "In 1648 werd er een verdedigingswal om de kerk heen gelegd en werd de kerk omgebouwd tot een heus fort.",
    },
    {
      title: "1681",
      cardTitle: "Nieuwe religieuze stroming",
      cardSubtitle: "De kerk wordt protestants.",
      cardDetailedText:
        "In 1681 keerde de vrede terug en werd de kerk weer een kerk, alleen nu een protestantse.",
    },
    {
      title: "1791",
      cardTitle: "Katholieken in de schuur",
      cardSubtitle: "Katholieken mochten alleen een schuurkerk inrichten.",
      cardDetailedText:
        "De katholieken mochten in 1791 alleen een schuurkerk inrichten en pas in 1804 kregen ze de oude kerk terug.",
    },
    {
      title: "1860",
      cardTitle: "Nieuwe neogotische kerk",
      cardSubtitle: "Een geheel nieuwe kerk wordt gebouwd.",
      cardDetailedText:
        "De kerk was zo vervallen, dat in 1860 een nieuwe neogotische kerk gebouwd werd. Een driebeukige bakstenen kruiskerk, compleet van een geveltoren, ontworpen door P. Soffers.",
    },
    {
      title: "2018",
      cardTitle: "The Holy Spiritus",
      cardSubtitle: "De kerk wordt een brouwerij en stokerij.",
      cardDetailedText:
        "Twee gepassioneerde fruitwijn-fanaten veranderen de kerk in een ambachtelijke brouwerij en stokerij met neogotische interieurstukken en kleurrijke glas-in-loodramen.",
    },
  ];

  return (
    <div className="chrono-timeline-container">
      <Chrono
        items={items}
        mode="HORIZONTAL"
        disableClickOnCircle
        cardHeight={200}
        scrollable={{ scrollbar: true }}
        theme={{
          primary: "#e8960d",
          secondary: "#f8f8f8",
          cardBgColor: "#ffffff",
          cardForeColor: "#333333",
          titleColor: "#000000",
        }}
        classNames={{
          card: "chrono-card",
          cardTitle: "chrono-card-title",
          cardSubTitle: "chrono-card-subtitle",
          cardText: "chrono-card-text",
          controls: "chrono-controls",
        }}
        fontSizes={{
          title: "1rem",
          cardTitle: "1.25rem",
          cardSubtitle: "1rem",
          cardText: "0.9rem",
        }}
        mediaSettings={{
          align: "center",
          fit: "contain",
        }}
      />
    </div>
  );
};

export default ChronoTimeline;
