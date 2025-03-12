// app/components/TransitionScreen.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTransitionRouter } from "next-view-transitions";

export default function TransitionScreen() {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionState, setTransitionState] = useState<
    "idle" | "entering" | "exiting"
  >("idle");
  const [nextPath, setNextPath] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Override all link clicks to handle them with our custom transition
  useEffect(() => {
    if (hasInitialized.current) return;

    hasInitialized.current = true;

    // Intercept link clicks
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;

      // Only intercept internal links
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      e.preventDefault();

      // Start transition and store the next path
      performTransition(href);
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  // Function to handle the transition
  const performTransition = (path: string) => {
    if (isTransitioning || path === pathname) return;

    setNextPath(path);
    setIsTransitioning(true);
    setTransitionState("entering");

    // Phase 1: Slide in from left
    setTimeout(() => {
      // Phase 2: Navigate to the new page while transition is covering the screen
      router.push(path);

      // Phase 3: After a delay, start sliding out to the right
      setTimeout(() => {
        setTransitionState("exiting");

        // Phase 4: Complete the transition
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionState("idle");
          setNextPath(null);
        }, 500); // Duration of exit animation
      }, 1000); // Short delay after navigation to ensure new page has started loading
    }, 500); // Duration of enter animation
  };

  let transitionClasses =
    "fixed inset-0 z-50 flex items-center justify-center bg-primary transform transition-transform duration-500";

  if (transitionState === "entering") {
    transitionClasses += " translate-x-0"; // Fully visible
  } else if (transitionState === "exiting") {
    transitionClasses += " translate-x-full"; // Move out to the right
  } else {
    transitionClasses += " -translate-x-full opacity-0"; // Hidden to the left when idle
  }

  return (
    <div className={transitionClasses}>
      <div className="relative w-40 h-40 page-transition-logo">
        <Image
          src="/images/ths-logo.png"
          alt="The Holy Spiritus logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
