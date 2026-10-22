import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/acrylic-gifts")({
  head: () => ({
    meta: [
      { title: "Acrylic Gifts — Aiel Studio Puducherry" },
      { name: "description", content: "Custom acrylic gifts — keychains, standees, name plates and more, personalised at Aiel Studio." },
    ],
  }),
  component: AcrylicGiftsPage,
});

function AcrylicGiftsPage() {
  return (
    <UVPageLayout
      badge="Acrylic Gifts"
      title="Acrylic Gifts"
      subtitle="Elegant, premium acrylic gifts that make a lasting impression — personalised with names, photos or logos."
      description="Acrylic gifts are loved for their premium, glass-like appearance at an affordable price. We UV-print on high-clarity acrylic blanks to create stunning keepsakes, awards, name plates, standees, and more. Each piece is precisely cut and polished to perfection."
      features={[
        "High-clarity optical acrylic",
        "UV-printed or laser engraved",
        "Custom shapes via CNC cutting",
        "Polished and bevelled edges",
        "Photo, logo or text personalisation",
        "Gift-ready packaging available",
      ]}
      useCases={[
        "Corporate Awards", "Employee Recognition",
        "Wedding Souvenirs", "Birthday Gifts",
        "Graduation Gifts", "Name Plates",
        "Photo Keepsakes", "Event Mementos",
      ]}
      startingPrice="₹199"
      whatsappMessage="Hello Aiel Studio! I'm interested in Acrylic Gifts. Please share your catalogue and pricing."
    />
  );
}
