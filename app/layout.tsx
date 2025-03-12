// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { CartProvider } from "@/context/cartContext";
import "./globals.css";
import Navigation from "./components/Navigations";
import localFont from "next/font/local";
import Footer from "./components/Footer";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import TransitionScreen from "./components/PageTransition";
import { ViewTransitions } from "next-view-transitions";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const kaizer = localFont({
  src: "../public/fonts/kaizer.ttf",
  display: "swap",
  variable: "--font-kaizer",
});

export const metadata: Metadata = {
  title: "The Holy Spiritus",
  description: "Brouwerij & Distilleerderij",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={`${montserrat.variable} ${kaizer.variable} font-montserrat antialiased`}
        >
          <ReactQueryProvider>
            <CartProvider>
              <TransitionScreen />
              <Navigation />
              <div className="min-h-screen flex justify-center items-center">
                <div className="w-full">{children}</div>
              </div>
              <Footer />
            </CartProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
