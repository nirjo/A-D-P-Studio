import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/fusion-gifts")({
  head: () => ({
    meta: [
      { title: "Fusion Gifts — Aiel Studio Puducherry" },
      { name: "description", content: "Unique fusion gifts combining multiple print techniques — Aiel Studio's most creative offerings." },
    ],
  }),
  component: FusionGiftsPage,
});

function FusionGiftsPage() {
  return (
    <UVPageLayout
      badge="Fusion Gifts"
      title="Fusion Gifts"
      subtitle="Where multiple print techniques meet — unique, multi-material gifts that stand out from the ordinary."
      description="Fusion Gifts combine different printing methods and materials to create truly one-of-a-kind products. Think photo on acrylic paired with an engraved wooden base, or a UV-printed cushion combined with a matching mug and keychain set. These combo gifts are our most creative category — ideal for making a big impression."
      features={[
        "Combines UV print, engraving & more",
        "Multi-material product sets",
        "Custom packaging & gift boxes",
        "Hamper curation available",
        "Fully personalised for recipient",
        "Ideal for premium gifting budgets",
      ]}
      useCases={[
        "Premium Corporate Gifts", "Wedding Gift Sets",
        "Anniversary Hampers", "Birthday Surprise Boxes",
        "Festive Gift Combos", "Executive Gift Sets",
        "Appreciation Kits", "Long-distance Gifts",
      ]}
      startingPrice="₹499"
      whatsappMessage="Hello Aiel Studio! I'm interested in Fusion Gift sets. Please share ideas and pricing."
    />
  );
}
