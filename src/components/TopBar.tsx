import { Clock, Zap, Truck, Phone } from "lucide-react";
import { WHATSAPP_PHONE } from "@/lib/cart";

export function TopBar() {
  return (
    <div className="w-full bg-secondary/80 border-b border-border/60 text-muted-foreground text-[11px] font-sans px-4 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        {/* Hours & turnaround */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
          <span className="flex items-center gap-1.5 text-foreground/80 font-medium">
            <Clock size={12} className="text-splash-pink" />
            <span>Mon–Sat: 9:30 AM – 8:30 PM | Sun: 10 AM – 2 PM</span>
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5 text-splash-orange font-semibold">
            <Zap size={12} className="text-splash-orange animate-pulse" />
            <span>48h Rush Turnaround Available</span>
          </span>
        </div>

        {/* Shipping & Direct Contact */}
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5 text-splash-teal">
            <Truck size={12} />
            <span>Shipping Across India from Puducherry</span>
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello Aiel Studio, I have a custom print inquiry!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-foreground/90 hover:text-splash-pink transition-colors font-medium"
          >
            <Phone size={11} className="text-splash-pink" />
            <span>+91 91502 34277</span>
          </a>
        </div>
      </div>
    </div>
  );
}