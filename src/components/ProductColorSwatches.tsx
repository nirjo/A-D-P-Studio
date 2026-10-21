import React from "react";
import type { ProductColor } from "@/data/products";

interface ProductColorSwatchesProps {
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ProductColorSwatches({
  colors,
  selectedColor,
  onSelectColor,
  className = "",
  size = "md",
}: ProductColorSwatchesProps) {
  if (!colors || colors.length === 0) return null;

  const circleSize =
    size === "sm"
      ? "w-3.5 h-3.5"
      : size === "lg"
      ? "w-6 h-6"
      : "w-4 h-4";

  return (
    <div
      role="radiogroup"
      aria-label="Product colour choices"
      className={`flex items-center flex-wrap gap-1 ${className}`}
    >
      {colors.map((c) => {
        const isSelected = selectedColor.name === c.name;
        const isWhite = c.hex.toLowerCase() === "#ffffff" || c.name.toLowerCase() === "white";
        const isClear = c.name.toLowerCase().includes("clear") || c.name.toLowerCase().includes("transparent");

        return (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-pressed={isSelected}
            aria-label={`${c.name}${isSelected ? " (selected)" : ""}`}
            title={c.name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectColor(c);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onSelectColor(c);
              }
            }}
            className="group/swatch relative min-w-[32px] min-h-[32px] w-8 h-8 flex items-center justify-center rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-splash-pink"
          >
            {/* The colour circle */}
            <span
              className={`relative rounded-full transition-all duration-200 ${circleSize} ${
                isSelected
                  ? "ring-2 ring-splash-pink ring-offset-2 ring-offset-card scale-110 shadow-sm"
                  : "hover:scale-110 opacity-90 group-hover/swatch:opacity-100"
              } ${isWhite ? "border border-black/25 shadow-xs" : "border border-black/15"}`}
              style={{
                backgroundColor: isClear ? "#E2E8F0" : c.hex,
                backgroundImage: isClear
                  ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(226,232,240,0.6) 50%, rgba(186,230,253,0.7) 100%)"
                  : undefined,
              }}
            >
              {isClear && (
                <span className="absolute inset-0 flex items-center justify-center text-[7px] text-muted-foreground font-mono leading-none select-none">
                  ∅
                </span>
              )}
            </span>

            {/* Accessible Hover / Focus Tooltip */}
            <span
              role="tooltip"
              className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-0.5 text-[10px] font-medium text-popover-foreground shadow-md opacity-0 group-hover/swatch:opacity-100 group-focus-visible/swatch:opacity-100 transition-opacity duration-150 z-30 border border-border"
            >
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
