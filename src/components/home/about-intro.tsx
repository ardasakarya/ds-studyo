import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

const principles = [
  {
    title: "Aracı yok",
    body: "Müşteri temsilcisiyle değil, kodu yazan ekiple konuşursunuz. Karar bir toplantıda alınır.",
  },
  {
    title: "Şeffaf fiyat",
    body: "Kapsam netleşir, fiyat sabitlenir. Süreç içinde sürpriz kalem çıkmaz.",
  },
  {
    title: "Kod sizin",
    body: "Kaynak kod, tasarım dosyaları ve tüm hesaplar teslimde size devredilir.",
  },
];

/** 03 — biz kimiz. */
export function AboutIntro() {
  return (
    <section className="section">
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <SectionHeading
          no="01"
          eyebrow="manifesto"
          lines={["İki kişilik çekirdek,", "kurumsal disiplin."]}
          description="Küçük bir ekibiz ve bunu avantaja çeviriyoruz: işi kim yapıyorsa onunla konuşuyorsunuz. Beş yıldır ürün geliştiriyoruz; gayrimenkulden turizme, medikalden kuyumculuğa kadar farklı sektörlerde yayında olan işlerimiz var."
        >
          <Link
            href="/hakkimizda"
            className="group mt-2 inline-flex w-fit items-center gap-2 text-sm text-accent"
          >
            Hikâyemizi oku
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </SectionHeading>

        <ul className="flex flex-col gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
          {principles.map((principle, i) => (
            <li
              key={principle.title}
              className="reveal flex flex-col gap-2 bg-ink-950 px-7 py-8 transition-colors duration-500 hover:bg-ink-800/60"
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
            >
              <h3 className="text-xl">{principle.title}</h3>
              <p className="text-fg-muted">{principle.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
