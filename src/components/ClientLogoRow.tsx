export function ClientLogoRow() {
  const CLIENTS = [
    { name: "Pondy Tech Fest", category: "College & Hackathon Merch" },
    { name: "Café des Arts", category: "Staff Uniforms & Totes" },
    { name: "Auro Sports League", category: "Sublimated Team Jerseys" },
    { name: "Bay Leaf Hospitality", category: "Embroidered Pique Polos" },
    { name: "Ocean Pulse Surf Co.", category: "Heavyweight Graphic Drops" },
    { name: "Pulse Fitness Club", category: "Gym Wear & Steel Shakers" },
  ];

  return (
    <section className="py-14 border-t border-border/60 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center">
        <span className="text-[10px] font-display uppercase tracking-[0.3em] text-muted-foreground block mb-2">
          Trusted Across Puducherry &amp; Pan-India
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-8">
          Brands, Teams &amp; Studios We&apos;ve Printed For
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              className="bg-card border border-border/60 hover:border-splash-pink/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-display font-extrabold text-gradient text-base mb-2">
                {client.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <h4 className="font-display font-bold text-xs text-foreground leading-tight">
                {client.name}
              </h4>
              <span className="text-[10px] text-muted-foreground mt-1">
                {client.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}