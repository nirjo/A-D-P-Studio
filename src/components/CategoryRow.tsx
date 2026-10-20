import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

interface CategoryRowProps {
  index: string;
  title: string;
  subtitle: string;
  categorySlug: string;
  products: Product[];
}

export function CategoryRow({ index, title, subtitle, categorySlug, products }: CategoryRowProps) {
  return (
    <section className="py-14 sm:py-20 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Heading Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-display text-xs tracking-[0.3em] text-splash-pink font-bold">
                {index}
              </span>
              <span className="h-[1.5px] w-12 bg-gradient-to-r from-splash-pink to-splash-orange" />
              <span className="font-display text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
                Product Category
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>

          <Link
            to={categorySlug}
            className="inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider text-splash-pink hover:text-foreground transition-colors self-start md:self-auto group"
          >
            <span>View All {title}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}