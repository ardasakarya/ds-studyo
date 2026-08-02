import Link from "next/link";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/lib/data";

/** 13 — müşteri yorumları. */
export function Testimonials() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          no="06"
          eyebrow="yorumlar"
          lines={["Müşterilerimiz", "ne diyor?"]}
        />

        <ul className="mt-14 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <li
              key={item.role}
              className="reveal"
              style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
            >
              <figure className="card hairline-top flex h-full flex-col gap-6 p-8">
                <Quote className="size-6 text-accent/60" strokeWidth={1.5} aria-hidden />
                <blockquote className="text-[1.05rem] text-fg-muted">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-0.5 border-t border-line pt-5 text-sm">
                  <span className="text-fg">{item.author}</span>
                  <Link
                    href={`/referanslar/${item.project}`}
                    className="text-fg-faint transition-colors hover:text-accent"
                  >
                    {item.role}
                  </Link>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
