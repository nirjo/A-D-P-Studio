import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { getProductsByCategory } from "@/data/products";

export const Route = createFileRoute("/tote-bags")({
  head: () => ({
    meta: [
      { title: "Custom 100% Cotton Canvas Tote Bags — Aiel Studio" },
      { name: "description", content: "Heavyweight 12oz & 16oz organic cotton canvas tote bags, zippered daily carry totes, drawstring gym bags and pouches with vibrant eco prints." },
      { property: "og:title", content: "Custom Tote Bags — Aiel Design & Printing Studio" },
      { property: "og:description", content: "Heavyweight canvas totes, laptop pouches and drawstrings printed in Puducherry with 48h rush turnaround." },
    ],
  }),
  component: ToteBagsPage,
});

function ToteBagsPage() {
  const products = getProductsByCategory("tote-bags");
  return (
    <CategoryPageLayout
      categoryKey="tote-bags"
      categoryTitle="Canvas Tote Bags & Pouches"
      categorySubtitle="Heavyweight 12oz and 16oz unbleached organic cotton canvas totes, zippered multi-compartment shoppers, heavy cord drawstring sacks, and zippered tech pouches."
      startingPrice={249}
      products={products}
    />
  );
}
