import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Projenizi konuşalım. Aynı gün dönüş yapıyoruz — e-posta, telefon veya WhatsApp.",
};

export default function ContactPage() {
  const channels = [
    {
      icon: Mail,
      label: "E-posta",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: site.contact.phone,
      href: site.contact.phoneHref,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Hızlı yanıt",
      href: site.contact.whatsapp,
    },
    {
      icon: MapPin,
      label: "Konum",
      value: site.contact.location,
      href: undefined,
    },
  ];

  return (
    <>
      <PageHero
        no="06"
        eyebrow="iletişim"
        title="Projeni konuşalım."
        description="Kısa bir görüşmeyle ihtiyacını netleştirip yol haritası çıkarıyoruz. Keşif görüşmesi ücretsiz."
        breadcrumbs={[{ label: "Anasayfa", href: "/" }, { label: "İletişim" }]}
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div className="reveal flex flex-col gap-8">
            <ul className="flex flex-col gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
              {channels.map((channel) => {
                const Icon = channel.icon;
                const content = (
                  <span className="flex items-center gap-4 bg-ink-950 px-6 py-5 transition-colors duration-300 group-hover:bg-ink-800/60">
                    <Icon
                      className="size-5 shrink-0 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span className="flex flex-col">
                      <span className="text-xs text-fg-faint">
                        {channel.label}
                      </span>
                      <span className="text-fg">{channel.value}</span>
                    </span>
                  </span>
                );
                return (
                  <li key={channel.label} className="group">
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={
                          channel.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noreferrer"
                        className="block"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-transparent p-6">
              <h2 className="text-lg">Çalışma saatleri</h2>
              <p className="text-sm text-fg-muted">
                Hafta içi 09:00 – 19:00. Mesajlara genelde aynı gün, en geç 24
                saat içinde dönüyoruz.
              </p>
            </div>
          </div>

          <div className="reveal">
            <Suspense
              fallback={<div className="card h-[520px]" aria-hidden />}
            >
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
