import { Sparkles, RefreshCw, Zap, Receipt, ShieldCheck } from "lucide-react";

export function WhyAielStrip() {
  const PILLARS = [
    {
      icon: Sparkles,
      title: "Colour Proofed",
      desc: "Pantone-matched calibrations & digital proof approvals before mass printing. Zero colour drift.",
      tag: "100% Match",
      accent: "text-splash-pink",
    },
    {
      icon: RefreshCw,
      title: "Free Revisions",
      desc: "Our graphic designers tweak placement, typography and alignment until you love the pre-print proof.",
      tag: "Zero Risk",
      accent: "text-splash-purple",
    },
    {
      icon: Zap,
      title: "48h Rush Turnaround",
      desc: "Tight event deadline? We offer expedited 24-48 hour rush printing dispatched directly from Puducherry.",
      tag: "Lightning Fast",
      accent: "text-splash-orange",
    },
    {
      icon: Receipt,
      title: "Bulk & GST Invoice",
      desc: "Official 18% GST tax input invoices with tiered corporate slab discounts for startups and enterprises.",
      tag: "B2B Ready",
      accent: "text-splash-teal",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-border/60 bg-gradient-to-b from-card/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary border border-border px-3.5 py-1 rounded-full text-xs font-display uppercase tracking-widest text-splash-pink mb-3">
            <ShieldCheck size={13} /> The Aiel Studio Promise
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Printing you can <span className="text-gradient">proudly wear</span> and share.
          </h2>
          <p className="text-muted-foreground text-sm mt-3">
            Every garment, mug, keychain, and case is inspected by hand in our Puducherry studio before dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="bg-card border border-border/70 hover:border-splash-pink/50 rounded-3xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center ${p.accent}`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-display font-semibold uppercase tracking-wider bg-secondary px-2.5 py-1 rounded-full text-muted-foreground">
                      {p.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-foreground mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="w-8 h-1 bg-gradient-to-r from-splash-pink to-splash-orange rounded-full mt-6" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}