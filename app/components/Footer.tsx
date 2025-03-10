import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="w-full relative overflow-hidden bg-dark text-white pt-24 pb-8">
      <Image
        src="/images/holylogobigtransparent.png"
        alt="The Holy Splithoa Logo"
        width={100}
        height={100}
        className="w-1/3 absolute left-1/2 -translate-x-1/2 top-5 pointer-events-none opacity-50"
      />
      <div className="container mx-auto px-4 pb-10 flex flex-col md:flex-row justify-between items-start">
        <div className="mb-6 md:mb-0 w-1/3">
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
              info@theholysplithoa.com
            </a>
            <a
              href="mailto:sales@theholysplithoa.com"
              className="text-white hover:text-gray-300 text-sm"
            >
              sales@theholysplithoa.com
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
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://instagram.com/theholysplithoa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-4 mt-8 text-center text-xs text-gray-500">
        © 2025 The Holy Splithoa
      </div>
    </footer>
  );
};

export default Footer;
