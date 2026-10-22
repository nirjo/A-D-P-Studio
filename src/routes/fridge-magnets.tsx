import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/fridge-magnets")({
  head: () => ({
    meta: [
      { title: "Custom Fridge Magnets — Aiel Studio Puducherry" },
      { name: "description", content: "Personalised fridge magnets with UV printing. Great for gifts, events and promotions." },
    ],
  }),
  component: FridgeMagnetsPage,
});

function FridgeMagnetsPage() {
  return (
    <UVPageLayout
      badge="Fridge Magnets"
      title="Fridge Magnets"
      subtitle="Adorable, vibrant custom fridge magnets — perfect for gifting, home décor, and promotional giveaways."
      description="Our custom fridge magnets are UV-printed on premium materials with a strong magnetic backing. Available in standard shapes like rectangles, circles, hearts, and custom die-cut shapes. Great for weddings, baby showers, corporate events, travel souvenirs, and everyday personalised gifts."
      features={[
        "UV-printed for vibrant, lasting colour",
        "Strong magnetic backing",
        "Standard & custom die-cut shapes",
        "Glossy or matte finish options",
        "Minimum order: 20 pcs",
        "Bulk pricing available",
      ]}
      useCases={[
        "Wedding Favours", "Baby Shower Gifts",
        "Birthday Giveaways", "Corporate Promotions",
        "Travel Souvenirs", "Home Décor",
        "Festival Gifts", "School Events",
      ]}
      startingPrice="₹59"
      whatsappMessage="Hello Aiel Studio! I'm interested in custom Fridge Magnets. Please share sizes and pricing."
    />
  );
}
