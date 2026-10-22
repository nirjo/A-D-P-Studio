import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/uv-all")({
  head: () => ({
    meta: [
      { title: "UV Printing Collection — Aiel Studio Puducherry" },
      { name: "description", content: "Browse all UV printing products at Aiel Studio — acrylic frames, transfer stickers, magnets, MDF gifts and more." },
    ],
  }),
  component: UVAllPage,
});

function UVAllPage() {
  return (
    <UVPageLayout
      badge="UV Printing Collection"
      title="All UV Printings"
      subtitle="The complete range of our UV-printed products — vibrant, durable and ready for gifting or personal use."
      description="UV printing uses ultraviolet light to instantly cure ink onto surfaces, producing sharp, vivid, and scratch-resistant prints. Our collection spans acrylic frames, transfer stickers, fridge magnets, MDF boards and custom gift items — all printed on premium materials."
      features={[
        "UV-cured inks for lasting vibrancy",
        "Works on acrylic, MDF, metal, and more",
        "Scratch & water resistant finish",
        "Photo-quality resolution",
        "Personalised or bulk orders accepted",
        "Fast 48–72 hour turnaround",
      ]}
      useCases={[
        "Birthday Gifts", "Anniversary Gifts", "Corporate Gifting",
        "Weddings", "Festivals", "Home Décor", "Office Décor", "Promotions",
      ]}
      startingPrice="₹149"
      whatsappMessage="Hello Aiel Studio! I'm interested in UV printing products. Please share your catalogue."
    />
  );
}
