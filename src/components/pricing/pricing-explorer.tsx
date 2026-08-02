"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PackageCard } from "@/components/pricing/package-card";
import { smoothScrollTo } from "@/components/providers/smooth-scroll";
import { pricingNote } from "@/lib/data";
import { site } from "@/lib/site";
import {
  estimateRange,
  getServicePricing,
  pricedServiceGroups,
  pricedServices,
  servicePricing,
  timingQuestion,
  tl,
  type PricingQuestion,
  type ServicePricing,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

/**
 * Paketler sayfasının çekirdeği.
 *
 * Tek bir durum (hizmet + kademe + cevaplar) hem paket kartlarını, hem
 * karşılaştırma tablosunu, hem de fiyat hesaplayıcıyı besler. Bir pakete
 * tıklamak hesaplayıcıyı o seçimlerle açar; hesaplayıcıda hizmet değiştirmek
 * yukarıdaki paketleri değiştirir.
 */

const DEFAULT_SERVICE = "web-sitesi";

type Answers = Record<string, string>;

type Step =
  | { kind: "service" }
  | { kind: "tier" }
  | { kind: "question"; question: PricingQuestion }
  | { kind: "addons" }
  | { kind: "form" };

const defaultTier = (pricing: ServicePricing) =>
  (pricing.tiers.find((tier) => tier.popular) ?? pricing.tiers[0]).slug;

/** /paketler?hizmet=...&paket=... → açılışta seçili hizmet, kademe ve adım. */
function resolveDeepLink(linkedService?: string, linkedTier?: string) {
  const owner =
    (linkedService ? getServicePricing(linkedService) : undefined) ??
    (linkedTier
      ? servicePricing.find((item) =>
          item.tiers.some((tier) => tier.slug === linkedTier),
        )
      : undefined) ??
    getServicePricing(DEFAULT_SERVICE)!;

  const tier = owner.tiers.find((item) => item.slug === linkedTier);

  return {
    service: owner.service,
    tier: tier?.slug ?? defaultTier(owner),
    step: tier ? 2 : 0,
  };
}

/* --- Adres çubuğundaki sorgu dizesi (statik dışa aktarım uyumlu) -------- */

const subscribeToSearch = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

const readSearch = () => window.location.search;
/** Sunucuda ve hidrasyon anında boş: ilk boyama her iki tarafta da aynı. */
const noSearch = () => "";

/**
 * Sorguyu okur ve seçimleri ona göre kuran asıl bileşeni döndürür.
 *
 * Sayfa statik dışa aktarıldığı için `searchParams` sunucudan gelemiyor;
 * sorgu hidrasyondan sonra okunuyor ve `key` değişince iç bileşen o
 * seçimlerle yeniden kuruluyor (efekt içinde setState yok, uyuşmazlık yok).
 */
export function PricingExplorer() {
  const search = useSyncExternalStore(subscribeToSearch, readSearch, noSearch);
  const params = new URLSearchParams(search);
  const linked = resolveDeepLink(
    params.get("hizmet") ?? undefined,
    params.get("paket") ?? undefined,
  );

  return (
    <PricingExplorerView
      key={`${linked.service}-${linked.tier}-${linked.step}`}
      linked={linked}
    />
  );
}

function PricingExplorerView({
  linked,
}: {
  linked: ReturnType<typeof resolveDeepLink>;
}) {
  const calculatorRef = useRef<HTMLDivElement>(null);

  const [serviceSlug, setServiceSlug] = useState(linked.service);
  const [tierSlug, setTierSlug] = useState(linked.tier);
  const [answers, setAnswers] = useState<Answers>({});
  const [addOnSlugs, setAddOnSlugs] = useState<string[]>([]);
  const [step, setStep] = useState(linked.step);
  const [contact, setContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    note: "",
  });

  const pricing = getServicePricing(serviceSlug)!;
  const service = pricedServices.find((item) => item.slug === serviceSlug)!;
  const activeGroup = service.group;

  /* --- Adımlar --------------------------------------------------------- */
  const steps: Step[] = useMemo(
    () => [
      { kind: "service" },
      { kind: "tier" },
      { kind: "question", question: pricing.questions[0] },
      { kind: "question", question: pricing.questions[1] },
      { kind: "addons" },
      { kind: "question", question: timingQuestion },
      { kind: "form" },
    ],
    [pricing],
  );

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  /* --- Tahmin ---------------------------------------------------------- */
  const questionList = [
    pricing.questions[0],
    pricing.questions[1],
    timingQuestion,
  ];

  const multipliers = questionList.map(
    (question) =>
      question.choices.find((choice) => choice.value === answers[question.id])
        ?.multiplier ?? 1,
  );

  const { low, high, addOnTotal, tier } = estimateRange({
    pricing,
    tierSlug,
    multipliers,
    addOnSlugs,
  });

  const unitLabel = pricing.unit === "ay" ? " / ay" : "";
  const answeredCount = questionList.filter((q) => answers[q.id]).length;

  const selectedAddOns = pricing.addOns.filter((addOn) =>
    addOnSlugs.includes(addOn.slug),
  );

  /* --- Eylemler -------------------------------------------------------- */
  const chooseService = (slug: string) => {
    const next = getServicePricing(slug);
    if (!next) return;
    setServiceSlug(slug);
    setTierSlug(defaultTier(next));
    setAnswers({});
    setAddOnSlugs([]);
  };

  const goToCalculator = (nextStep: number) => {
    setStep(nextStep);
    const target = calculatorRef.current;
    // Adım değişimi boyandıktan sonra kaydır.
    if (target) window.setTimeout(() => smoothScrollTo(target), 0);
  };

  const answer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    window.setTimeout(
      () => setStep((s) => Math.min(s + 1, steps.length - 1)),
      200,
    );
  };

  const toggleAddOn = (slug: string) =>
    setAddOnSlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug],
    );

  const canContinue = (() => {
    if (current.kind === "question") return Boolean(answers[current.question.id]);
    if (current.kind === "form")
      return contact.name.trim() !== "" && contact.email.trim() !== "";
    return true;
  })();

  const summary = useMemo(() => {
    const lines = questionList.map((question) => {
      const choice = question.choices.find(
        (item) => item.value === answers[question.id],
      );
      return `${question.question} ${choice?.label ?? "—"}`;
    });

    return [
      "Yeni teklif talebi",
      "",
      `Hizmet: ${service.title}`,
      `Paket: ${tier.name} (${tl(tier.price)}${unitLabel} başlangıç)`,
      ...lines,
      `Ek modüller: ${
        selectedAddOns.length
          ? selectedAddOns.map((addOn) => addOn.name).join(", ")
          : "—"
      }`,
      `Tahmini aralık: ${tl(low)} – ${tl(high)}${unitLabel} (KDV hariç)`,
      "",
      `Ad: ${contact.name}`,
      `Firma: ${contact.company}`,
      `E-posta: ${contact.email}`,
      `Telefon: ${contact.phone}`,
      "",
      `Not: ${contact.note}`,
    ].join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, contact, selectedAddOns, service, tier, low, high, unitLabel]);

  const submit = () => {
    const subject = encodeURIComponent(
      `Teklif talebi — ${service.title} · ${tier.name}`,
    );
    window.location.href = `mailto:${site.contact.email}?subject=${subject}&body=${encodeURIComponent(summary)}`;
  };

  /* ------------------------------------------------------------------ */

  return (
    <>
      {/* Paketler */}
      <section id="paketler" className="section">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            no="01"
            eyebrow="paketler"
            lines={["Her hizmetin", "fiyatı burada."]}
            description="15 hizmetin tamamı için üç kademe ve başlayan fiyatlar. Hizmeti seçin, paketler ve karşılaştırma tablosu ona göre değişsin."
          />

          {/* Hizmet seçimi */}
          <div className="reveal flex flex-col gap-6">
            {pricedServiceGroups.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <span
                  className={cn(
                    "font-mono text-xs tracking-[0.16em] uppercase",
                    group.id === activeGroup ? "text-accent" : "text-fg-faint",
                  )}
                >
                  {group.title}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.services.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => chooseService(item.slug)}
                      aria-pressed={item.slug === serviceSlug}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                        item.slug === serviceSlug
                          ? "border-accent bg-accent text-ink-950"
                          : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                      )}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Seçili hizmet başlığı */}
          <div className="reveal flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-[clamp(1.5rem,3vw,2.2rem)]">
                {service.title}
              </h3>
              <p className="max-w-xl text-fg-muted">{service.summary}</p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className="text-sm text-fg-faint">Başlayan fiyat</span>
              <span className="font-display text-2xl text-accent">
                {tl(pricing.tiers[0].price)}
                {unitLabel}
              </span>
              <Link
                href={`/hizmetler/${service.slug}`}
                className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent"
              >
                Hizmet detayı
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            </div>
          </div>

          {/* Kademeler */}
          <div key={serviceSlug} className="animate-fade-up grid gap-4 lg:grid-cols-3">
            {pricing.tiers.map((item) => (
              <PackageCard
                key={item.slug}
                tier={item}
                unit={pricing.unit}
                active={item.slug === tierSlug}
                onSelect={() => {
                  setTierSlug(item.slug);
                  goToCalculator(2);
                }}
                cta={
                  item.slug === tierSlug
                    ? "Bu paketle devam et"
                    : "Bu paketi seç"
                }
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="max-w-3xl text-sm text-fg-faint">{pricingNote}</p>
            {pricing.note ? (
              <p className="max-w-3xl text-sm text-fg-faint">{pricing.note}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Karşılaştırma */}
      <section id="karsilastirma" className="section">
        <div className="shell">
          <SectionHeading
            no="02"
            eyebrow="karşılaştırma"
            lines={[`${service.title}`, "paketleri yan yana."]}
            description="Her satır bir özelliği ve o özelliğin ne anlama geldiğini gösterir; kademeler arasındaki farkı buradan görürsünüz."
          />

          <div className="reveal mt-12 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="w-[32%] py-5 pr-6 font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                    özellik
                  </th>
                  {pricing.tiers.map((item) => (
                    <th key={item.slug} className="py-5 pr-6 align-bottom">
                      <button
                        type="button"
                        onClick={() => setTierSlug(item.slug)}
                        className="flex flex-col items-start gap-1 text-left"
                      >
                        <span
                          className={cn(
                            "font-display text-lg font-medium transition-colors duration-300",
                            item.slug === tierSlug
                              ? "text-accent"
                              : "text-fg-muted hover:text-fg",
                          )}
                        >
                          {item.name}
                        </span>
                        <span className="font-mono text-xs text-fg-faint">
                          {tl(item.price)}
                          {unitLabel}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricing.matrix.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-line transition-colors duration-300 hover:bg-ink-800/40"
                  >
                    <th scope="row" className="py-5 pr-6 font-normal">
                      <span className="block text-[0.95rem] text-fg">
                        {row.label}
                      </span>
                      <span className="block text-sm text-fg-faint">
                        {row.meaning}
                      </span>
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={`${row.label}-${i}`}
                        className={cn(
                          "py-5 pr-6 text-[0.95rem]",
                          value === "—"
                            ? "text-fg-faint"
                            : pricing.tiers[i].slug === tierSlug
                              ? "text-fg"
                              : "text-fg-muted",
                        )}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Hesaplayıcı */}
      <section id="hesaplayici" className="section">
        <div className="shell" ref={calculatorRef}>
          <SectionHeading
            no="03"
            eyebrow="fiyat hesaplayıcı"
            lines={["Kapsamı seç,", "aralığı gör."]}
            description="Her adımda tek soru. Sonunda iletişim formuna geliyorsunuz; cevaplarınız teklif talebine otomatik ekleniyor."
          />

          <div className="reveal card mt-12 grid gap-10 p-8 lg:grid-cols-[1.25fr_0.75fr] lg:p-12">
            {/* Sol: adımlar */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                    adım {step + 1} / {steps.length}
                  </span>
                  <span className="text-fg-faint">{progress}%</span>
                </div>
                <div className="h-px w-full bg-line">
                  <div
                    className="h-px bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div key={step} className="animate-fade-up flex flex-col gap-8">
                {current.kind === "service" ? (
                  <>
                    <StepTitle
                      title="Hangi hizmeti istiyorsun?"
                      hint="Tüm hizmetler burada; sonraki sorular seçimine göre değişir."
                    />
                    <div className="flex flex-col gap-6">
                      {pricedServiceGroups.map((group) => (
                        <div key={group.id} className="flex flex-col gap-3">
                          <span className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                            {group.title}
                          </span>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {group.services.map((item) => {
                              const itemPricing = getServicePricing(item.slug)!;
                              const selected = item.slug === serviceSlug;
                              return (
                                <button
                                  key={item.slug}
                                  type="button"
                                  onClick={() => {
                                    chooseService(item.slug);
                                    setStep(1);
                                  }}
                                  aria-pressed={selected}
                                  className={cn(
                                    "flex flex-col gap-1 rounded-xl border p-4 text-left transition-all duration-300",
                                    selected
                                      ? "border-accent bg-accent/10"
                                      : "border-line hover:border-line-strong hover:bg-ink-800/60",
                                  )}
                                >
                                  <span className="flex w-full items-center justify-between gap-3 text-fg">
                                    {item.title}
                                    {selected ? (
                                      <Check
                                        className="size-4 text-accent"
                                        strokeWidth={2}
                                        aria-hidden
                                      />
                                    ) : null}
                                  </span>
                                  <span className="text-sm text-fg-faint">
                                    {itemPricing.unit === "ay"
                                      ? `aylık ${tl(itemPricing.tiers[0].price)}'den başlar`
                                      : `${tl(itemPricing.tiers[0].price)}'den başlar`}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}

                {current.kind === "tier" ? (
                  <>
                    <StepTitle
                      title={`${service.title} için hangi paket?`}
                      hint="Emin değilsen en çok tercih edileni seç; keşifte birlikte netleştiriyoruz."
                    />
                    <div className="grid gap-3">
                      {pricing.tiers.map((item) => {
                        const selected = item.slug === tierSlug;
                        return (
                          <button
                            key={item.slug}
                            type="button"
                            onClick={() => {
                              setTierSlug(item.slug);
                              setStep(2);
                            }}
                            aria-pressed={selected}
                            className={cn(
                              "flex flex-col gap-1 rounded-xl border p-5 text-left transition-all duration-300",
                              selected
                                ? "border-accent bg-accent/10"
                                : "border-line hover:border-line-strong hover:bg-ink-800/60",
                            )}
                          >
                            <span className="flex w-full items-center justify-between gap-3">
                              <span className="text-fg">{item.name}</span>
                              <span className="font-mono text-sm text-accent">
                                {tl(item.price)}
                                {unitLabel}
                              </span>
                            </span>
                            <span className="text-sm text-fg-faint">
                              {item.tagline}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {current.kind === "question" ? (
                  <>
                    <StepTitle
                      title={current.question.question}
                      hint={current.question.hint}
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      {current.question.choices.map((choice) => {
                        const selected =
                          answers[current.question.id] === choice.value;
                        return (
                          <button
                            key={choice.value}
                            type="button"
                            onClick={() => answer(current.question.id, choice.value)}
                            aria-pressed={selected}
                            className={cn(
                              "flex flex-col items-start gap-1 rounded-xl border p-5 text-left transition-all duration-300",
                              selected
                                ? "border-accent bg-accent/10"
                                : "border-line hover:border-line-strong hover:bg-ink-800/60",
                            )}
                          >
                            <span className="flex w-full items-center justify-between gap-3 text-fg">
                              {choice.label}
                              {selected ? (
                                <Check
                                  className="size-4 text-accent"
                                  strokeWidth={2}
                                  aria-hidden
                                />
                              ) : null}
                            </span>
                            {choice.hint ? (
                              <span className="text-sm text-fg-faint">
                                {choice.hint}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {current.kind === "addons" ? (
                  <>
                    <StepTitle
                      title="Ek modül lazım mı?"
                      hint="İsteğe bağlı — birden fazla seçebilir, hiçbirini seçmeden devam edebilirsin."
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {pricing.addOns.map((addOn) => {
                        const selected = addOnSlugs.includes(addOn.slug);
                        return (
                          <button
                            key={addOn.slug}
                            type="button"
                            onClick={() => toggleAddOn(addOn.slug)}
                            aria-pressed={selected}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-300",
                              selected
                                ? "border-accent bg-accent/10"
                                : "border-line hover:border-line-strong hover:bg-ink-800/60",
                            )}
                          >
                            <span className="text-[0.95rem] text-fg">
                              {addOn.name}
                            </span>
                            <span className="flex shrink-0 items-center gap-2 font-mono text-sm text-accent">
                              +{tl(addOn.price)}
                              {selected ? (
                                <Check className="size-4" strokeWidth={2} aria-hidden />
                              ) : (
                                <Plus className="size-4" strokeWidth={2} aria-hidden />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {current.kind === "form" ? (
                  <>
                    <StepTitle
                      title="Son adım: sana nasıl dönelim?"
                      hint="48 saat içinde kapsam önerisi ve net fiyatla dönüyoruz."
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Ad soyad *"
                        value={contact.name}
                        onChange={(v) => setContact({ ...contact, name: v })}
                      />
                      <Field
                        label="Firma"
                        value={contact.company}
                        onChange={(v) => setContact({ ...contact, company: v })}
                      />
                      <Field
                        label="E-posta *"
                        type="email"
                        value={contact.email}
                        onChange={(v) => setContact({ ...contact, email: v })}
                      />
                      <Field
                        label="Telefon"
                        type="tel"
                        value={contact.phone}
                        onChange={(v) => setContact({ ...contact, phone: v })}
                      />
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="text-sm text-fg-muted">
                        Eklemek istediğin bir şey var mı?
                      </span>
                      <textarea
                        rows={4}
                        value={contact.note}
                        onChange={(e) =>
                          setContact({ ...contact, note: e.target.value })
                        }
                        className="resize-none rounded-xl border border-line bg-ink-950 px-4 py-3 text-fg outline-none transition-colors duration-300 placeholder:text-fg-faint focus:border-accent/60"
                        placeholder="Örn. eylülde yayında olmalı, mevcut sitemizden içerik aktarılacak."
                      />
                    </label>

                    <details className="rounded-xl border border-line bg-ink-950/60 p-5">
                      <summary className="cursor-pointer text-sm text-fg-muted">
                        Gönderilecek özeti gör
                      </summary>
                      <pre className="mt-4 font-mono text-xs whitespace-pre-wrap text-fg-faint">
                        {summary}
                      </pre>
                    </details>
                  </>
                ) : null}
              </div>

              {/* Navigasyon */}
              <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
                  Geri
                </Button>

                {current.kind === "form" ? (
                  <Button onClick={submit} disabled={!canContinue}>
                    Teklif talebini gönder
                    <Send className="size-4" strokeWidth={1.5} aria-hidden />
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setStep((s) => Math.min(steps.length - 1, s + 1))
                    }
                    disabled={!canContinue}
                  >
                    Devam
                    <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
                  </Button>
                )}
              </div>
            </div>

            {/* Sağ: canlı özet */}
            <aside className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-line bg-ink-950/80 p-7 lg:sticky lg:top-28 lg:self-start">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-fg-faint">Tahmini aralık</span>
                <p className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-none">
                  {tl(low)}
                  <span className="text-fg-faint"> – </span>
                  {tl(high)}
                </p>
                <p className="text-sm text-fg-muted">
                  {service.title} · {tier.name}
                  {pricing.unit === "ay" ? " · aylık" : ""}
                </p>
                <p className="text-xs text-fg-faint">
                  {answeredCount}/3 soru yanıtlandı — cevapladıkça netleşir.
                </p>
              </div>

              <dl className="flex flex-col gap-3 border-t border-line pt-5 text-sm">
                {questionList.map((question) => {
                  const choice = question.choices.find(
                    (item) => item.value === answers[question.id],
                  );
                  return (
                    <div
                      key={question.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <dt className="text-fg-faint">{question.question}</dt>
                      <dd
                        className={cn(
                          "shrink-0 text-right",
                          choice ? "text-fg" : "text-fg-faint",
                        )}
                      >
                        {choice?.label ?? "—"}
                      </dd>
                    </div>
                  );
                })}
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-fg-faint">Ek modüller</dt>
                  <dd className="shrink-0 text-right text-fg">
                    {selectedAddOns.length
                      ? `${selectedAddOns.length} adet · +${tl(addOnTotal)}`
                      : "—"}
                  </dd>
                </div>
              </dl>

              <ul className="flex flex-col gap-2 border-t border-line pt-5 text-sm text-fg-muted">
                <li>KDV hariç, kapsama göre değişir</li>
                <li>%50 başlangıç, %50 teslim</li>
                <li>Keşif görüşmesi ücretsiz</li>
              </ul>

              {step < steps.length - 1 ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(steps.length - 1)}
                >
                  Forma geç
                  <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
                </Button>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function StepTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[clamp(1.4rem,2.6vw,2rem)]">{title}</h3>
      {hint ? <p className="text-sm text-fg-muted">{hint}</p> : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-fg-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-line bg-ink-950 px-4 text-fg outline-none transition-colors duration-300 focus:border-accent/60"
      />
    </label>
  );
}
