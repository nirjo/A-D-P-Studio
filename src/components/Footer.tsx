import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, MapPin, Clock, Phone, Mail, Sparkles, ShieldCheck } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { WHATSAPP_PHONE } from "@/lib/cart";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border bg-card/60 pt-16 pb-24 md:pb-12 text-muted-foreground text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-splash-purple via-splash-pink to-splash-orange p-[1px]">
                <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center">
                  <img src={mascot} alt="Aiel Studio" className="w-6 h-6 object-contain" />
                </div>
              </div>
              <span className="font-display font-extrabold text-lg text-foreground tracking-tight">
                AIEL <span className="text-gradient">STUDIO</span>
              </span>
            </Link>

            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Puducherry&apos;s creative design and custom printing atelier. We craft bespoke oversized tees, ceramic mugs, laser keychains, heavy totes, and shockproof cases with precision colour proofing and 48-hour rush dispatch.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground hover:text-splash-pink hover:border-splash-pink/50 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://instagram.com/aieldesignstudio"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground hover:text-splash-pink hover:border-splash-pink/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-foreground">
              Custom Prints
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link to="/tshirts" className="hover:text-foreground transition-colors">Custom T-Shirts</Link>
              </li>
              <li>
                <Link to="/mugs" className="hover:text-foreground transition-colors">Ceramic &amp; Magic Mugs</Link>
              </li>
              <li>
                <Link to="/keychains" className="hover:text-foreground transition-colors">Acrylic &amp; Metal Keychains</Link>
              </li>
              <li>
                <Link to="/tote-bags" className="hover:text-foreground transition-colors">Canvas Tote Bags</Link>
              </li>
              <li>
                <Link to="/phone-cases" className="hover:text-foreground transition-colors">Impact Phone Cases</Link>
              </li>
              <li>
                <Link to="/combos" className="hover:text-foreground transition-colors">Value Combo Packs</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Location & Hours */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-foreground">
              Puducherry Studio
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-splash-teal mt-0.5 flex-shrink-0" />
                <span>42 Mission Street, Heritage Town, Puducherry 605001, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-splash-orange flex-shrink-0" />
                <span>Mon–Sat: 9:30 AM – 8:30 PM</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground/80 pl-5">
                <span>Sunday: 10:00 AM – 2:00 PM</span>
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Phone size={14} className="text-splash-pink flex-shrink-0" />
                <a href={`tel:+${WHATSAPP_PHONE}`} className="hover:text-foreground">+91 91502 34277</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-splash-purple flex-shrink-0" />
                <a href="mailto:aieldesignstudio@gmail.com" className="hover:text-foreground">aieldesignstudio@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Col 5: Policies & Quality Guarantee */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-foreground">
              Studio Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#shipping-policy" className="hover:text-foreground transition-colors">Shipping Policy (Pan-India)</a>
              </li>
              <li>
                <a href="#refund-policy" className="hover:text-foreground transition-colors">Refund &amp; Replacement Policy</a>
              </li>
              <li>
                <a href="#privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hi Aiel Studio, I need a GST B2B invoice quote!")}`} target="_blank" rel="noreferrer" className="hover:text-splash-pink transition-colors text-splash-pink flex items-center gap-1 font-semibold">
                  <ShieldCheck size={12} /> B2B GST Bulk Inquiries
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Year and Credits */}
        <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>&copy; {currentYear} Aiel Design &amp; Printing Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-foreground/80">
              <Sparkles size={12} className="text-splash-pink" /> 48h Turnaround Guaranteed
            </span>
            <span>•</span>
            <span>Crafted in Puducherry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}