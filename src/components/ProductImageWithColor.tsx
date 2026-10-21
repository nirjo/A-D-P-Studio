import React from "react";
import type { ProductColor } from "@/data/products";

interface ProductImageWithColorProps {
  image: string;
  alt: string;
  selectedColor?: ProductColor;
  category?: string;
  className?: string;
  priority?: boolean;
}

export function ProductImageWithColor({
  image,
  alt,
  selectedColor,
  category = "",
  className = "",
  priority = false,
}: ProductImageWithColorProps) {
  const isPhoneCase =
    category === "phone-cases" ||
    image.includes("case-") ||
    image.endsWith(".svg");

  const hex = selectedColor?.hex || "#18181B";
  const colorName = (selectedColor?.name || "").toLowerCase();
  const isWhite = hex.toLowerCase() === "#ffffff" || colorName === "white";
  const isClear = colorName.includes("clear") || colorName.includes("transparent");

  // Determine blending parameters
  let overlayOpacity = 0.85;
  let blendMode: "multiply" | "color" | "overlay" | "soft-light" = "multiply";

  if (isWhite) {
    overlayOpacity = 0;
  } else if (isClear) {
    overlayOpacity = 0.35;
    blendMode = "soft-light";
  } else if (hex === "#121316" || hex === "#18181B" || hex === "#111111" || hex === "#0b0c10") {
    overlayOpacity = 0.9;
    blendMode = "multiply";
  } else if (colorName === "rose" || colorName === "lavender" || colorName === "sage" || colorName === "sand" || colorName === "natural") {
    overlayOpacity = 0.78;
    blendMode = "multiply";
  }

  return (
    <div className="relative w-full h-full aspect-square overflow-hidden flex items-center justify-center">
      {/* Base image */}
      <img
        src={image}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`w-full h-full ${
          isPhoneCase ? "object-contain p-2" : "object-cover"
        } transition-transform duration-500 will-change-transform ${className}`}
      />

      {/* Recolor layer with smooth 200ms transition */}
      {selectedColor && !isWhite && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-all duration-200"
          style={{
            backgroundColor: isClear ? "rgba(226, 232, 240, 0.45)" : hex,
            mixBlendMode: blendMode,
            opacity: overlayOpacity,
            WebkitMaskImage: isPhoneCase ? `url("${image}")` : undefined,
            maskImage: isPhoneCase ? `url("${image}")` : undefined,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      )}
    </div>
  );
}
