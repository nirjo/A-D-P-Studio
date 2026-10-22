import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/mdf-gifts")({
  head: () => ({
    meta: [
      { title: "MDF Gifts — Aiel Studio Puducherry" },
      { name: "description", content: "Custom MDF gifts with UV printing — photo frames, coasters, plaques and more." },
    ],
  }),
  component: MDFGiftsPage,
});

function MDFGiftsPage() {
  return (
    <UVPageLayout
      badge="MDF Gifts"
      title="MDF Gifts"
      subtitle="Warm, rustic charm meets precision UV printing — custom MDF gifts that feel personal and premium."
      description="MDF (Medium Density Fibreboard) gifts offer a natural, warm aesthetic that complements UV-printed imagery beautifully. We create photo frames, coasters, key holders, wall plaques, and more from premium-grade MDF. Each piece can be personalised with your photo, name, or message and comes finished with a protective coating."
      features={[
        "Premium MDF with smooth UV-print surface",
        "Photo, name or logo personalisation",
        "Available in natural wood or painted finishes",
        "Protective lacquer coating",
        "Laser cut custom shapes available",
        "Eco-friendly material",
      ]}
      useCases={[
        "Photo Frames", "Coasters",
        "Key Holders", "Wall Plaques",
        "Corporate Gifts", "Festival Gifts",
        "Home Décor", "Wedding Souvenirs",
      ]}
      startingPrice="₹149"
      whatsappMessage="Hello Aiel Studio! I'm interested in MDF Gifts. Please share your catalogue and pricing."
    />
  );
}
