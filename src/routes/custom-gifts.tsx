import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/custom-gifts")({
  head: () => ({
    meta: [
      { title: "Custom Gifts — Aiel Studio Puducherry" },
      { name: "description", content: "Fully personalised custom gifts at Aiel Studio — any occasion, any design, any quantity." },
    ],
  }),
  component: CustomGiftsPage,
});

function CustomGiftsPage() {
  return (
    <UVPageLayout
      badge="Custom Gifts"
      title="Custom Gifts"
      subtitle="Bring your ideas to life — fully personalised gifts designed and printed to your exact specifications."
      description="Can't find exactly what you're looking for? Our custom gifting service lets you go completely bespoke. Share your idea, design, or reference images with us, and our team will help you create the perfect personalised gift — whether it's a one-off keepsake or a bulk corporate order."
      features={[
        "Fully bespoke design service",
        "Works with your own artwork or we design it",
        "Any quantity — single piece to bulk orders",
        "Multiple material options",
        "Photography and mockup provided before print",
        "Express delivery available",
      ]}
      useCases={[
        "Corporate Gifting", "Wedding Favours",
        "Birthday Surprises", "Festival Hampers",
        "Promotional Merchandise", "School/College Events",
        "NGO & Charity Gifts", "Employee Rewards",
      ]}
      startingPrice="₹199"
      whatsappMessage="Hello Aiel Studio! I have a custom gift idea. Can you help me create it?"
    />
  );
}
