import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/uv-transfer-sticker")({
  head: () => ({
    meta: [
      { title: "UV Transfer Stickers — Aiel Studio Puducherry" },
      { name: "description", content: "Custom UV transfer stickers — vibrant, waterproof and transfer onto any surface." },
    ],
  }),
  component: UVTransferStickerPage,
});

function UVTransferStickerPage() {
  return (
    <UVPageLayout
      badge="UV Transfer"
      title="UV Transfer Sticker"
      subtitle="Vivid, waterproof UV transfer stickers that adhere to almost any surface — laptops, bottles, helmets and more."
      description="UV Transfer Stickers are printed using UV-cured inks on specialised transfer media. They offer bold colours, crisp edges, and superior durability compared to regular vinyl stickers. Once applied, they become part of the surface — waterproof, UV-resistant, and long-lasting."
      features={[
        "UV-cured inks for vibrant colour",
        "Waterproof and UV-resistant",
        "Adheres to glass, metal, plastic, wood",
        "No bubble or wrinkle application",
        "Custom shapes and die-cut options",
        "Minimum order: 10 pcs",
      ]}
      useCases={[
        "Laptops & Gadgets", "Water Bottles", "Helmets",
        "Brand Promotion", "Event Giveaways", "Product Packaging",
        "Personalised Gifts", "Kids' Items",
      ]}
      startingPrice="₹49"
      whatsappMessage="Hello Aiel Studio! I'm interested in UV Transfer Stickers. Please share your pricing and size options."
    />
  );
}
