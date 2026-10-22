import { createFileRoute } from "@tanstack/react-router";
import { UVPageLayout } from "@/components/UVPageLayout";

export const Route = createFileRoute("/uv-acrylic-photo-frame")({
  head: () => ({
    meta: [
      { title: "UV Acrylic Photo Frames — Aiel Studio Puducherry" },
      { name: "description", content: "Custom UV-printed acrylic photo frames. Crystal-clear, vibrant and perfect for gifting." },
    ],
  }),
  component: UVAcrylicPhotoFramePage,
});

function UVAcrylicPhotoFramePage() {
  return (
    <UVPageLayout
      badge="UV Acrylic"
      title="UV Acrylic Photo Frame"
      subtitle="Crystal-clear acrylic frames with UV-printed photos — the perfect premium gift for any occasion."
      description="Our UV Acrylic Photo Frames combine the clarity of premium acrylic with the vibrancy of UV-cured printing. The result is a stunning, glass-like frame that showcases your photos with incredible depth and colour accuracy. Available in multiple sizes with optional LED base for a glowing display effect."
      features={[
        "Premium optical-grade acrylic",
        "UV-cured print for scratch resistance",
        "Crystal-clear transparency",
        "Optional illuminated LED base",
        "Multiple sizes: 4×6, 5×7, 8×10 and custom",
        "Personalised text/name engraving available",
      ]}
      useCases={[
        "Wedding Gifts", "Anniversary Gifts", "Baby Shower",
        "Graduations", "Birthday Gifts", "Corporate Awards",
        "Valentine's Day", "Home Décor",
      ]}
      startingPrice="₹349"
      whatsappMessage="Hello Aiel Studio! I'm interested in UV Acrylic Photo Frames. Please share sizes and pricing."
    />
  );
}
