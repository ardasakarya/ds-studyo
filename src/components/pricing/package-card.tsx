"use client";

import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { tl, type PriceUnit, type PricingTier } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/**
 * Tek paket kademesi.
 * `onSelect` verilirse hesaplayıcıya bağlanır, verilmezse `href`e gider.
 */
export function PackageCard({
  tier,
  unit,
  active,
  onSelect,
  href,
  cta = "Bu paketle devam et",
  className,
}: {
  tier: PricingTier;
  unit: PriceUnit;
  active?: boolean;
  onSelect?: () => void;
  href?: string;
  cta?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card hairline-top flex h-full flex-col gap-7 p-8 transition-colors duration-300",
        tier.popular && "border-accent/35 bg-ink-800",
        active && "border-accent bg-ink-800",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-xl">{tier.name}</h3>
          {active ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs text-ink-950">
              Seçili
            </span>
          ) : tier.popular ? (
            <span className="rounded-full bg-accent/12 px-3 py-1 text-xs text-accent-soft">
              En çok tercih edilen
            </span>
          ) : null}
        </div>
        <p className="text-sm text-fg-muted">{tier.tagline}</p>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
          başlayan fiyat
        </span>
        <p className="flex items-baseline gap-1.5">
          <span className="font-display text-[2.4rem] leading-none">
            {tl(tier.price)}
          </span>
          <span className="text-sm text-fg-faint">
            {unit === "ay" ? "/ ay" : "'den başlayan"}
          </span>
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[0.95rem]">
            <Check
              className="mt-1 size-4 shrink-0 text-accent"
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-fg-muted">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-fg-faint">Teslim</span>
          <span className="text-fg">{tier.delivery}</span>
        </div>
        {onSelect ? (
          <Button
            onClick={onSelect}
            variant={tier.popular || active ? "primary" : "outline"}
            className="w-full"
          >
            {cta}
          </Button>
        ) : (
          <ButtonLink
            href={href ?? "/paketler"}
            variant={tier.popular ? "primary" : "outline"}
            className="w-full"
          >
            {cta}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
