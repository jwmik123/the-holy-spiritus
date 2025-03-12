// app/components/CustomLink.tsx
"use client";
import { Link } from "next-view-transitions";
import { ReactNode } from "react";

interface CustomLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function CustomLink({
  href,
  children,
  className = "",
  onClick,
}: CustomLinkProps) {
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
