import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/trendy-gifts")({
  head: () => ({
    meta: [
      { title: "Trendy Gifts — Aiel Studio Puducherry" },
      { name: "description", content: "The latest in trending personalised gifts — viral-worthy items printed at Aiel Studio." },
    ],
  }),
  component: TrendyGiftsPage,
});

function TrendyGiftsPage() {
  return (
    <UVPageLayout
      badge="Trendy Gifts"
      title="Trendy Gifts"
      subtitle="The freshest, most viral-worthy personalised gift items — curated from what's trending right now."
      description="Our Trendy Gifts range is updated regularly to keep pace with what's hot in the gifting world. From LED acrylic lamps and crystal photo cubes to moon lamps, rotating displays, and snap-photo lockets — if it's trending, we print it. Perfect for Gen Z gift-givers who want something fresh and shareable."
      features={[
        "Updated regularly with latest trends",
        "Instagram & social-media worthy designs",
        "LED and illuminated options available",
        "Photo and text personalisation",
        "Gift-ready packaging included",
        "Same-day dispatch for select items",
      ]}
      useCases={[
        "Gen Z Gifting", "Social Media Gifting",
        "Valentine's Day", "Friendship Day",
        "Birthday Surprises", "Breakup Recovery Kits 😄",
        "Influencer PR Boxes", "Viral Gift Ideas",
      ]}
      startingPrice="₹299"
      whatsappMessage="Hello Aiel Studio! I want to check out your Trendy Gifts collection. What's popular right now?"
    />
  );
}
