import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/site";

/** 16 — kapanış CTA. */
export function ClosingCta() {
  return (
    <section className="relative overflow-hidden py-28">
            <div
        className="glow bottom-[-30%] left-1/2 size-[620px] -translate-x-1/2 bg-accent/12"
        aria-hidden
      />

      <div className="shell relative flex flex-col items-center gap-8 text-center">
        <span className="chapter"><b>07</b>iletişim</span>

        <h2 className="max-w-[14ch] text-[clamp(2.4rem,6vw,4.6rem)]">
          <span className="line-mask reveal">
            <span>Projeni anlat,</span>
          </span>
          <span
            className="line-mask reveal"
            style={{ "--reveal-delay": "110ms" } as React.CSSProperties}
          >
            <span className="text-gradient">48 saatte dönelim.</span>
          </span>
        </h2>

        <p className="reveal max-w-lg text-fg-muted">
          Ücretsiz keşif görüşmesi: ihtiyacınızı dinler, kapsamı netleştirir ve
          net fiyatlı bir teklif hazırlarız. Sonrasında karar sizin.
        </p>

        <div className="reveal flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/teklif-al" size="lg">
            Teklif al
          </ButtonLink>
          <ButtonLink
            href={site.contact.whatsapp}
            variant="outline"
            size="lg"
            target="_blank"
          >
            WhatsApp&apos;tan yaz
          </ButtonLink>
        </div>

        <a
          href={`mailto:${site.contact.email}`}
          className="reveal font-display text-lg text-fg-muted transition-colors hover:text-accent"
        >
          {site.contact.email}
        </a>
      </div>
    </section>
  );
}
