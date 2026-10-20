import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { getProductsByCategory } from "@/data/products";

export const Route = createFileRoute("/keychains")({
  head: () => ({
    meta: [
      { title: "Custom Die-Cut Acrylic & Metal Keychains — Aiel Studio" },
      { name: "description", content: "Custom laser-cut acrylic charms, laser-engraved metal fobs, retro motel tags and interactive shaker keychains. No minimum orders." },
      { property: "og:title", content: "Custom Keychains — Aiel Design & Printing Studio" },
      { property: "og:description", content: "Laser cut to your exact logo perimeter. Double-sided acrylic and metal keychains printed in Puducherry." },
    ],
  }),
  component: KeychainsPage,
});

function KeychainsPage() {
  const products = getProductsByCategory("keychains");
  return (
    <CategoryPageLayout
      categoryKey="keychains"
      categoryTitle="Acrylic & Metal Keychains"
      categorySubtitle="Custom die-cut acrylic charms, laser-engraved stainless steel plates, retro American motel tags, and interactive multi-layer shaker charms. High gloss epoxy finish with chrome rings."
      startingPrice={99}
      products={products}
    />
  );
}
