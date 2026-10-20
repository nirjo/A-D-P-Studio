import { Star, Quote } from "lucide-react";

export function CustomerReviews() {
  const REVIEWS = [
    {
      quote: "The 240 GSM oversized tees for our music launch came out sharper than the Photoshop mockups. The puff print texture on the back was insane. Whole band was thrilled.",
      author: "Vikram R.",
      role: "Lead Vocalist, Bay Waves Band",
      item: "Heavyweight Oversized Tees",
      location: "Puducherry",
    },
    {
      quote: "Ordered 120 custom ceramic mugs and canvas totes for our annual tech summit on a 4-day rush. Zero broken mugs, packaging was museum-grade, and the colour matched our hex codes 1:1.",
      author: "Sneha M.",
      role: "VP Brand & People, FinScale Technologies",
      item: "Mug + Canvas Tote Combo",
      location: "Chennai / Pan-India",
    },
    {
      quote: "The acrylic charm keychains and embroidered corduroy caps are the hottest sellers at our café pop-up. Fast WhatsApp replies, instant mockups, and honest guidance on file formats.",
      author: "Jérôme D.",
      role: "Founder, Café des Arts Heritage",
      item: "Die-Cut Acrylic Keychains",
      location: "White Town, Puducherry",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-splash-orange mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Loved by Creators, Teams &amp; Studios
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Over 5,000+ custom print pieces crafted in our Puducherry workshop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.author}
              className="bg-card border border-border/70 hover:border-splash-pink/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-splash-orange">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={20} className="text-muted-foreground/30" />
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-foreground">
                      {rev.author}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-sans">
                      {rev.role}
                    </p>
                  </div>
                  <span className="text-[10px] bg-secondary text-splash-teal px-2 py-0.5 rounded font-display font-semibold">
                    {rev.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}