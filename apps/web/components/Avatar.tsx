"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

export function Avatar({
  src,
  alt,
  size = "md",
  className,
  fallback,
}: AvatarProps) {
  const sizeClass = sizeClasses[size];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = fallback || getInitials(alt);

  if (!src) {
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold",
          sizeClass,
          className,
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden relative",
        sizeClass,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={
          size === "sm"
            ? "32px"
            : size === "md"
              ? "40px"
              : size === "lg"
                ? "64px"
                : "96px"
        }
      />
    </div>
  );
}
