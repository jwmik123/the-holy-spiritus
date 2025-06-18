import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Facebook, Instagram, Linkedin, Twitter, X } from "lucide-react";

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
              href="/shop"
              className="text-white hover:text-gray-300 text-sm"
            >
              Workshop
            </Link>
            <Link
              href="/evenementen"
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
            <a
              href="https://maps.google.com/?q=Hoofdstraat+4,+4564+AP+Sint+Jansteen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 text-sm pb-4"
            >
              Hoofdstraat 4 <br />
              4564 AP Sint Jansteen
            </a>
            <a
              href="mailto:info@theholyspiritus.com"
              className="text-white hover:text-gray-300 text-sm"
            >
              info@theholyspiritus.com
            </a>
            <a
              href="mailto:sales@theholyspiritus.com"
              className="text-white hover:text-gray-300 text-sm"
            >
              sales@theholyspiritus.com
            </a>
          </div>

          {/* Social Media Column */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm text-white mb-2 uppercase font-bold">
              Socials
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/theholyspiritussintjansteen"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:opacity-75 transition-opacity"
              >
                <Facebook size={20} color="white" />
              </a>
              <a
                href="https://www.instagram.com/theholyspiritus/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:opacity-75 transition-opacity"
              >
                <Instagram size={20} color="white" />
              </a>

              <a
                href="https://www.linkedin.com/company/the-holy-spiritus/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:opacity-75 transition-opacity"
              >
                <Linkedin size={20} color="white" />
              </a>
              <a
                href="https://x.com/HolyBv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:opacity-75 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                  className="hover:opacity-75 transition-opacity fill-white"
                >
                  <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                </svg>
              </a>
              <a
                href="https://nl.pinterest.com/TheHolySpiritus/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="hover:opacity-75 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                  className="hover:opacity-75 transition-opacity fill-white"
                >
                  <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609825 4 46 13.390175 46 25 C 46 36.609825 36.609825 46 25 46 C 22.876355 46 20.82771 45.682142 18.896484 45.097656 C 19.75673 43.659418 20.867347 41.60359 21.308594 39.90625 C 21.570728 38.899887 22.648438 34.794922 22.648438 34.794922 C 23.348841 36.132057 25.395277 37.263672 27.574219 37.263672 C 34.058123 37.263672 38.732422 31.300682 38.732422 23.890625 C 38.732422 16.78653 32.935409 11.472656 25.476562 11.472656 C 16.196831 11.472656 11.271484 17.700825 11.271484 24.482422 C 11.271484 27.636307 12.94892 31.562193 15.634766 32.8125 C 16.041611 33.001865 16.260073 32.919834 16.353516 32.525391 C 16.425459 32.226044 16.788267 30.766792 16.951172 30.087891 C 17.003269 29.871239 16.978043 29.68405 16.802734 29.470703 C 15.913793 28.392399 15.201172 26.4118 15.201172 24.564453 C 15.201172 19.822048 18.791452 15.232422 24.908203 15.232422 C 30.18976 15.232422 33.888672 18.832872 33.888672 23.980469 C 33.888672 29.796219 30.95207 33.826172 27.130859 33.826172 C 25.020554 33.826172 23.440361 32.080359 23.947266 29.939453 C 24.555054 27.38426 25.728516 24.626944 25.728516 22.78125 C 25.728516 21.130713 24.842754 19.753906 23.007812 19.753906 C 20.850369 19.753906 19.117188 21.984457 19.117188 24.974609 C 19.117187 26.877359 19.761719 28.166016 19.761719 28.166016 C 19.761719 28.166016 17.630543 37.176514 17.240234 38.853516 C 16.849091 40.52931 16.953851 42.786365 17.115234 44.466797 C 9.421139 41.352465 4 33.819328 4 25 C 4 13.390175 13.390175 4 25 4 z"></path>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@godericvandenb877"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:opacity-75 transition-opacity"
              >
                <svg
                  fill="#000000"
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                  id="icons"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hover:opacity-75 transition-opacity fill-white"
                >
                  <path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-4 mt-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} The Holy Spiritus
      </div>
    </footer>
  );
};

export default Footer;
