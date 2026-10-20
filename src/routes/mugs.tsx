import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { getProductsByCategory } from "@/data/products";

export const Route = createFileRoute("/mugs")({
  head: () => ({
    meta: [
      { title: "Custom Ceramic & Magic Mugs — Aiel Studio Puducherry" },
      { name: "description", content: "Order custom 11oz ceramic mugs, magic heat-reveal cups, frosted steins and insulated steel tumblers with edge-to-edge sublimation print." },
      { property: "og:title", content: "Custom Mugs — Aiel Design & Printing Studio" },
      { property: "og:description", content: "Dishwasher-safe glossy ceramic, thermochromic magic reveal mugs, and laser-etched tumblers crafted in Puducherry." },
    ],
  }),
  component: MugsPage,
});

function MugsPage() {
  const products = getProductsByCategory("mugs");
  return (
    <CategoryPageLayout
      categoryKey="mugs"
      categoryTitle="Ceramic & Magic Mugs"
      categorySubtitle="Vivid edge-to-edge sublimation wraps, thermochromic heat-reveal mugs, frosted beer steins, and insulated stainless steel travel tumblers. 100% microwave and dishwasher safe."
      startingPrice={199}
      products={products}
    />
  );
}
