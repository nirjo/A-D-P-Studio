import { useState } from "react";
import { X, Ruler, Sparkles, Check } from "lucide-react";

export interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryLabel?: string;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

interface MeasurementRow {
  size: string;
  chestInches: string;
  chestCm: number;
  lengthInches: string;
  lengthCm: number;
  shoulderInches: string;
  shoulderCm: number;
  sleeveInches: string;
  sleeveCm: number;
}

const SIZE_CHARTS: Record<string, MeasurementRow[]> = {
  "Round Neck T-Shirts": [
    { size: "S", chestInches: "38\"", chestCm: 96, lengthInches: "26\"", lengthCm: 66, shoulderInches: "17\"", shoulderCm: 43, sleeveInches: "8\"", sleeveCm: 20 },
    { size: "M", chestInches: "40\"", chestCm: 101, lengthInches: "27\"", lengthCm: 69, shoulderInches: "18\"", shoulderCm: 45, sleeveInches: "8.5\"", sleeveCm: 21 },
    { size: "L", chestInches: "42\"", chestCm: 106, lengthInches: "28.5\"", lengthCm: 72, shoulderInches: "19\"", shoulderCm: 47, sleeveInches: "9\"", sleeveCm: 22 },
    { size: "XL", chestInches: "44\"", chestCm: 111, lengthInches: "29\"", lengthCm: 74, shoulderInches: "20\"", shoulderCm: 49, sleeveInches: "9.5\"", sleeveCm: 23 },
    { size: "XXL", chestInches: "46\"", chestCm: 116, lengthInches: "30\"", lengthCm: 76, shoulderInches: "21\"", shoulderCm: 51, sleeveInches: "10\"", sleeveCm: 24 },
    { size: "XXXL", chestInches: "48\"", chestCm: 121, lengthInches: "31\"", lengthCm: 78, shoulderInches: "22\"", shoulderCm: 53, sleeveInches: "10.5\"", sleeveCm: 25 },
  ],
  "Polo T-Shirts": [
    { size: "S", chestInches: "38\"", chestCm: 96, lengthInches: "27\"", lengthCm: 68, shoulderInches: "17.5\"", shoulderCm: 44, sleeveInches: "8.5\"", sleeveCm: 22 },
    { size: "M", chestInches: "40\"", chestCm: 101, lengthInches: "28\"", lengthCm: 70, shoulderInches: "18.5\"", shoulderCm: 46, sleeveInches: "9\"", sleeveCm: 23 },
    { size: "L", chestInches: "42\"", chestCm: 106, lengthInches: "29\"", lengthCm: 72, shoulderInches: "19.5\"", shoulderCm: 48, sleeveInches: "9.5\"", sleeveCm: 24 },
    { size: "XL", chestInches: "44\"", chestCm: 111, lengthInches: "29.5\"", lengthCm: 74, shoulderInches: "20.5\"", shoulderCm: 50, sleeveInches: "10\"", sleeveCm: 25 },
    { size: "XXL", chestInches: "46\"", chestCm: 116, lengthInches: "30.5\"", lengthCm: 76, shoulderInches: "21.5\"", shoulderCm: 52, sleeveInches: "10.5\"", sleeveCm: 26 },
    { size: "XXXL", chestInches: "48\"", chestCm: 121, lengthInches: "31.5\"", lengthCm: 78, shoulderInches: "22.5\"", shoulderCm: 54, sleeveInches: "11\"", sleeveCm: 27 },
  ],
  "Oversized T-Shirts": [
    { size: "S", chestInches: "42\"", chestCm: 106, lengthInches: "28.5\"", lengthCm: 72, shoulderInches: "20.5\"", shoulderCm: 52, sleeveInches: "9.5\"", sleeveCm: 24 },
    { size: "M", chestInches: "44\"", chestCm: 111, lengthInches: "29\"", lengthCm: 74, shoulderInches: "21.5\"", shoulderCm: 54, sleeveInches: "10\"", sleeveCm: 25 },
    { size: "L", chestInches: "46\"", chestCm: 116, lengthInches: "30\"", lengthCm: 76, shoulderInches: "22.5\"", shoulderCm: 56, sleeveInches: "10.5\"", sleeveCm: 26 },
    { size: "XL", chestInches: "48\"", chestCm: 121, lengthInches: "31\"", lengthCm: 78, shoulderInches: "23.5\"", shoulderCm: 58, sleeveInches: "11\"", sleeveCm: 27 },
    { size: "XXL", chestInches: "50\"", chestCm: 126, lengthInches: "31.5\"", lengthCm: 80, shoulderInches: "24.5\"", shoulderCm: 60, sleeveInches: "11.5\"", sleeveCm: 28 },
    { size: "XXXL", chestInches: "52\"", chestCm: 131, lengthInches: "32.5\"", lengthCm: 82, shoulderInches: "25.5\"", shoulderCm: 62, sleeveInches: "12\"", sleeveCm: 29 },
  ],
  "Hoodies": [
    { size: "S", chestInches: "41\"", chestCm: 104, lengthInches: "26\"", lengthCm: 66, shoulderInches: "18\"", shoulderCm: 46, sleeveInches: "24\"", sleeveCm: 60 },
    { size: "M", chestInches: "43\"", chestCm: 109, lengthInches: "27\"", lengthCm: 69, shoulderInches: "19\"", shoulderCm: 48, sleeveInches: "24.5\"", sleeveCm: 62 },
    { size: "L", chestInches: "45\"", chestCm: 114, lengthInches: "28.5\"", lengthCm: 72, shoulderInches: "20\"", shoulderCm: 50, sleeveInches: "25.5\"", sleeveCm: 64 },
    { size: "XL", chestInches: "47\"", chestCm: 119, lengthInches: "29\"", lengthCm: 74, shoulderInches: "21\"", shoulderCm: 52, sleeveInches: "26\"", sleeveCm: 66 },
    { size: "XXL", chestInches: "49\"", chestCm: 124, lengthInches: "30\"", lengthCm: 76, shoulderInches: "22\"", shoulderCm: 54, sleeveInches: "27\"", sleeveCm: 68 },
    { size: "XXXL", chestInches: "51\"", chestCm: 129, lengthInches: "31\"", lengthCm: 78, shoulderInches: "23\"", shoulderCm: 56, sleeveInches: "27.5\"", sleeveCm: 70 },
  ],
  "Sweatshirts": [
    { size: "S", chestInches: "40\"", chestCm: 102, lengthInches: "25.5\"", lengthCm: 64, shoulderInches: "17.5\"", shoulderCm: 45, sleeveInches: "23\"", sleeveCm: 58 },
    { size: "M", chestInches: "42\"", chestCm: 107, lengthInches: "26.5\"", lengthCm: 67, shoulderInches: "18.5\"", shoulderCm: 47, sleeveInches: "24\"", sleeveCm: 60 },
    { size: "L", chestInches: "44\"", chestCm: 112, lengthInches: "27.5\"", lengthCm: 70, shoulderInches: "19.5\"", shoulderCm: 49, sleeveInches: "24.5\"", sleeveCm: 62 },
    { size: "XL", chestInches: "46\"", chestCm: 117, lengthInches: "28.5\"", lengthCm: 72, shoulderInches: "20.5\"", shoulderCm: 51, sleeveInches: "25.5\"", sleeveCm: 64 },
    { size: "XXL", chestInches: "48\"", chestCm: 122, lengthInches: "29\"", lengthCm: 74, shoulderInches: "21.5\"", shoulderCm: 53, sleeveInches: "26\"", sleeveCm: 66 },
    { size: "XXXL", chestInches: "50\"", chestCm: 127, lengthInches: "30\"", lengthCm: 76, shoulderInches: "22.5\"", shoulderCm: 55, sleeveInches: "27\"", sleeveCm: 68 },
  ],
  "Sports Jerseys": [
    { size: "S", chestInches: "37\"", chestCm: 94, lengthInches: "27\"", lengthCm: 68, shoulderInches: "17\"", shoulderCm: 43, sleeveInches: "8\"", sleeveCm: 20 },
    { size: "M", chestInches: "39\"", chestCm: 99, lengthInches: "28\"", lengthCm: 70, shoulderInches: "18\"", shoulderCm: 45, sleeveInches: "8.5\"", sleeveCm: 21 },
    { size: "L", chestInches: "41\"", chestCm: 104, lengthInches: "29\"", lengthCm: 72, shoulderInches: "19\"", shoulderCm: 47, sleeveInches: "9\"", sleeveCm: 22 },
    { size: "XL", chestInches: "43\"", chestCm: 109, lengthInches: "29.5\"", lengthCm: 74, shoulderInches: "20\"", shoulderCm: 49, sleeveInches: "9.5\"", sleeveCm: 23 },
    { size: "XXL", chestInches: "45\"", chestCm: 114, lengthInches: "30.5\"", lengthCm: 76, shoulderInches: "21\"", shoulderCm: 51, sleeveInches: "10\"", sleeveCm: 24 },
    { size: "XXXL", chestInches: "47\"", chestCm: 119, lengthInches: "31.5\"", lengthCm: 78, shoulderInches: "22\"", shoulderCm: 53, sleeveInches: "10.5\"", sleeveCm: 25 },
  ],
};

export function SizeChartModal({
  isOpen,
  onClose,
  categoryLabel = "Round Neck T-Shirts",
  selectedSize,
  onSelectSize,
}: SizeChartModalProps) {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  if (!isOpen) return null;

  // Resolve matching category key
  const chartKey = Object.keys(SIZE_CHARTS).find(
    (k) =>
      categoryLabel.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(categoryLabel.toLowerCase())
  ) || "Round Neck T-Shirts";

  const rows = SIZE_CHARTS[chartKey] || SIZE_CHARTS["Round Neck T-Shirts"]!;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-splash-pink/15 rounded-full blur-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-secondary border border-border flex items-center justify-center text-splash-pink">
              <Ruler size={18} />
            </div>
            <div>
              <h2
                id="size-chart-title"
                className="font-display font-extrabold text-lg sm:text-xl text-foreground flex items-center gap-2"
              >
                Size Guide • <span className="text-gradient">{chartKey}</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                All measurements are standard garment dimensions in India.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-secondary border border-border hover:border-splash-pink flex items-center justify-center text-foreground hover:text-splash-pink transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Unit toggle & How to measure tip */}
        <div className="flex items-center justify-between py-4 relative z-10 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-splash-teal" />
            <span>Tip: Measure a favorite fitting garment laid flat across chest.</span>
          </div>

          <div className="flex items-center bg-secondary border border-border rounded-full p-1 text-xs font-display">
            <button
              type="button"
              onClick={() => setUnit("inches")}
              className={`px-3 py-1 rounded-full transition-colors ${
                unit === "inches"
                  ? "bg-splash-pink text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 rounded-full transition-colors ${
                unit === "cm"
                  ? "bg-splash-pink text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 border border-border/80 rounded-2xl relative z-10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/70 border-b border-border font-display uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4 font-bold">Size</th>
                <th className="py-3 px-4 font-bold">Chest (Around)</th>
                <th className="py-3 px-4 font-bold">Garment Length</th>
                <th className="py-3 px-4 font-bold">Shoulder</th>
                <th className="py-3 px-4 font-bold">Sleeve Length</th>
                {onSelectSize && <th className="py-3 px-4 font-bold text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((r) => {
                const isSelected = selectedSize === r.size;
                return (
                  <tr
                    key={r.size}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-splash-pink/15 text-foreground font-semibold"
                        : "hover:bg-secondary/40 text-foreground"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-display font-extrabold text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        {r.size}
                        {isSelected && <Check size={12} className="text-splash-pink" />}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {unit === "inches" ? r.chestInches : `${r.chestCm} cm`}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {unit === "inches" ? r.lengthInches : `${r.lengthCm} cm`}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {unit === "inches" ? r.shoulderInches : `${r.shoulderCm} cm`}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {unit === "inches" ? r.sleeveInches : `${r.sleeveCm} cm`}
                    </td>
                    {onSelectSize && (
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSize(r.size);
                            onClose();
                          }}
                          className={`px-3 py-1 rounded-full text-[11px] font-display uppercase tracking-wider transition-colors border ${
                            isSelected
                              ? "bg-splash-pink text-primary-foreground border-splash-pink"
                              : "bg-secondary hover:border-splash-pink text-foreground"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-2 border-t border-border/80 flex items-center justify-between text-[11px] text-muted-foreground relative z-10 flex-wrap gap-2">
          <span>Tolerance: ± 0.5 inches (industry standard). Pre-shrunk cotton.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-secondary border border-border text-foreground hover:border-splash-pink font-display uppercase text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
