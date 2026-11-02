import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { getProductsByCategory } from "@/data/products";

export const Route = createFileRoute("/tshirts")({
  head: () => ({
    meta: [
      { title: "Custom T-Shirts & Team Jerseys — Aiel Studio Puducherry" },
      { name: "description", content: "Order custom oversized tees, bio-wash crewnecks, sports jerseys and pique polos. High-density DTF and puff printing with 48h rush turnaround." },
      { property: "og:title", content: "Custom T-Shirts — Aiel Design & Printing Studio" },
      { property: "og:description", content: "240 GSM French terry oversized tees, bio-wash essentials, and sublimated jerseys printed in Puducherry." },
    ],
  }),
  component: TshirtsPage,
});

function TshirtsPage() {
  const products = getProductsByCategory("tshirts");
  return (
    <CategoryPageLayout
      categoryKey="tshirts"
      categoryTitle="T-Shirts & Apparel"
      categorySubtitle="From 240 GSM streetwear oversized drops to corporate pique polos and moisture-wicking team jerseys. Printed with Japanese DTF, plastisol screen print, and precision embroidery."
      startingPrice={449}
      products={products}
    />
  );
}
