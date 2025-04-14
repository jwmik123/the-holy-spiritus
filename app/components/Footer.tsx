import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="w-full relative overflow-hidden bg-dark text-white pt-24 pb-8">
      <Image
        src="/images/holylogobigtransparent.png"
        alt="The Holy Splithoa Logo"
        width={100}
        height={100}
        className="w-1/2 md:w-1/3 absolute left-1/2 -translate-x-1/2 top-5 pointer-events-none opacity-50"
      />
      <div className="container mx-auto px-4 pb-10 flex flex-col md:flex-row justify-between items-start">
        <div className="mb-6 md:mb-0 w-full md:w-1/3">
          <h3 className="text-2xl font-bold uppercase">The Holy Spiritus</h3>
          <p className="text-white/50 text-white mt-4">
            Onze dranken zijn stuk voor stuk unieke creaties. Bedacht in de
            diepste en verlaten krochten van The Holy Spiritus brouwerij. En als
            je geboren wordt in een oude kerk kan het eigenlijk niet anders dan
            dat je puur en bijzonder bent.
          </p>
        </div>

        {/* Menu Section */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
          {/* Menu Column */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm text-white mb-2 uppercase font-bold">
              Meer over ons
            </h3>
            <Link
              href="/workshop"
              className="text-white hover:text-gray-300 text-sm"
            >
              Workshop
            </Link>
            <Link
              href="/proverij"
              className="text-white hover:text-gray-300 text-sm"
            >
              Proeverij
            </Link>
            <Link
              href="/brouwerij"
              className="text-white hover:text-gray-300 text-sm"
            >
              Brouwerij
            </Link>
            <Link
              href="/over-ons"
              className="text-white hover:text-gray-300 text-sm"
            >
              Over ons
            </Link>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm text-white mb-2 uppercase font-bold">
              Contact
            </h3>
            <p className="text-white text-sm pb-4">
              Hoofdstraat 4 <br />
              4564 AP Sint Jansteen
            </p>
            <a
              href="mailto:info@theholysplithoa.com"
              className="text-white hover:text-gray-300 text-sm"
            >
              info@theholyspiritus.nl
            </a>
            <a
              href="mailto:sales@theholysplithoa.com"
              className="text-white hover:text-gray-300 text-sm"
            >
              sales@theholyspiritus.nl
            </a>
          </div>

          {/* Social Media Column */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm text-white mb-2 uppercase font-bold">
              Socials
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/theholysplithoa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:opacity-75 transition-opacity"
              >
                <Facebook size={20} color="white" />
              </a>
              <a
                href="https://instagram.com/theholysplithoa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:opacity-75 transition-opacity"
              >
                <Instagram size={20} color="white" />
              </a>

              <a
                href="https://linkedin.com/company/theholysplithoa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:opacity-75 transition-opacity"
              >
                <Linkedin size={20} color="white" />
              </a>
              <a
                href="https://x.com/theholysplithoa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:opacity-75 transition-opacity"
              >
                <Twitter size={20} color="white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-4 mt-8 text-center text-xs text-gray-500">
        © 2025 The Holy Spiritus
      </div>
    </footer>
  );
};

export default Footer;
