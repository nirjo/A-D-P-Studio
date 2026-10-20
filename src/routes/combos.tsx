import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { getProductsByCategory } from "@/data/products";

export const Route = createFileRoute("/combos")({
  head: () => ({
    meta: [
      { title: "Value Combo Print Packs & Creator Kits — Aiel Studio" },
      { name: "description", content: "Save up to 33% on bundled print sets: Tee + Mug combos, 10-piece squad packs, starter creator merch kits, and executive onboarding boxes." },
      { property: "og:title", content: "Custom Print Combo Packs — Aiel Design & Printing Studio" },
      { property: "og:description", content: "Coordinated custom print sets with massive bundle savings. Hand-assembled in Puducherry." },
    ],
  }),
  component: CombosPage,
});

function CombosPage() {
  const products = getProductsByCategory("combos");
  return (
    <CategoryPageLayout
      categoryKey="combos"
      categoryTitle="Value Combo Packs"
      categorySubtitle="Curated matching collections for brands, creator drops, and team sprints. Includes Tee + Mug sets, 10-Tee squad packs, creator trio bundles, and corporate welcome kits."
      startingPrice={499}
      products={products}
    />
  );
}
