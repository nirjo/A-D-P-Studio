import { createFileRoute } from "@tanstack/react-router";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { getProductsByCategory } from "@/data/products";

export const Route = createFileRoute("/phone-cases")({
  head: () => ({
    meta: [
      { title: "Custom Impact Phone Cases for iPhone, Samsung & OnePlus" },
      { name: "description", content: "Dual-layer impact armor, anti-yellowing clear hybrid cases, MagSafe slim covers and vegan leather monogrammed cases. Drop tested to 8ft." },
      { property: "og:title", content: "Custom Phone Cases — Aiel Design & Printing Studio" },
      { property: "og:description", content: "Precision-molded shockproof phone cases with 3D wrap sublimation and UV spot embossing. Crafted in Puducherry." },
    ],
  }),
  component: PhoneCasesPage,
});

function PhoneCasesPage() {
  const products = getProductsByCategory("phone-cases");
  return (
    <CategoryPageLayout
      categoryKey="phone-cases"
      categoryTitle="Impact & MagSafe Phone Cases"
      categorySubtitle="Dual-layer 8ft drop-proof armor cases, anti-yellowing optical clear hybrids, built-in N52 MagSafe magnetic covers, and gold-foil monogrammed vegan leather cases."
      startingPrice={349}
      products={products}
    />
  );
}
