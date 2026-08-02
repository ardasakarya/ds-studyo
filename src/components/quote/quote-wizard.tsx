"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { wizardSteps } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Çok adımlı teklif sihirbazı.
 * Şu an gönderim mailto + WhatsApp özeti üzerinden — backend hazır olduğunda
 * `buildSummary` çıktısı bir API route'una POST edilecek.
 */

type Answers = Record<string, string>;

export function QuoteWizard() {
  const searchParams = useSearchParams();
  const presetType = searchParams.get("tip") ?? searchParams.get("paket") ?? "";

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(
    presetType ? { tip: presetType } : {},
  );
  const [contact, setContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    note: "",
  });

  const totalSteps = wizardSteps.length + 1;
  const isContactStep = step === wizardSteps.length;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const summary = useMemo(() => {
    const lines = wizardSteps.map((s) => {
      const value = answers[s.id];
      const option = s.options.find((o) => o.value === value);
      return `${s.question} ${option?.label ?? value ?? "—"}`;
    });
    return [
      "Yeni teklif talebi",
      "",
      ...lines,
      "",
      `Ad: ${contact.name}`,
      `Firma: ${contact.company}`,
      `E-posta: ${contact.email}`,
      `Telefon: ${contact.phone}`,
      "",
      `Not: ${contact.note}`,
    ].join("\n");
  }, [answers, contact]);

  const canContinue = isContactStep
    ? contact.name.trim() !== "" && contact.email.trim() !== ""
    : Boolean(answers[wizardSteps[step].id]);

  const select = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (step < wizardSteps.length) {
      window.setTimeout(() => setStep((s) => Math.min(s + 1, totalSteps - 1)), 220);
    }
  };

  const submit = () => {
    const subject = encodeURIComponent(`Teklif talebi — ${contact.name}`);
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:${site.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="card flex flex-col gap-10 p-8 lg:p-12">
      {/* İlerleme */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
            adım {step + 1} / {totalSteps}
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

      {/* Sorular */}
      {!isContactStep ? (
        <div key={step} className="animate-fade-up flex flex-col gap-8">
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">
            {wizardSteps[step].question}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {wizardSteps[step].options.map((option) => {
              const selected = answers[wizardSteps[step].id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => select(wizardSteps[step].id, option.value)}
                  aria-pressed={selected}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-xl border p-5 text-left transition-all duration-300",
                    selected
                      ? "border-accent bg-accent/10"
                      : "border-line hover:border-line-strong hover:bg-ink-800/60",
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-3 text-fg">
                    {option.label}
                    {selected ? (
                      <Check className="size-4 text-accent" strokeWidth={2} aria-hidden />
                    ) : null}
                  </span>
                  {"hint" in option && option.hint ? (
                    <span className="text-sm text-fg-faint">{option.hint}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-fade-up flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">
              Size nasıl dönelim?
            </h2>
            <p className="text-fg-muted">
              48 saat içinde kapsam önerisi ve net fiyatla dönüyoruz.
            </p>
          </div>

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
            <span className="text-sm text-fg-muted">Projeni birkaç cümleyle anlat</span>
            <textarea
              rows={4}
              value={contact.note}
              onChange={(e) => setContact({ ...contact, note: e.target.value })}
              className="resize-none rounded-xl border border-line bg-ink-950 px-4 py-3 text-fg outline-none transition-colors duration-300 placeholder:text-fg-faint focus:border-accent/60"
              placeholder="Örn. 8 sayfalık kurumsal site + ürün kataloğu, eylülde yayında olmalı."
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
        </div>
      )}

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

        {isContactStep ? (
          <Button onClick={submit} disabled={!canContinue}>
            Teklif talebini gönder
            <Send className="size-4" strokeWidth={1.5} aria-hidden />
          </Button>
        ) : (
          <Button
            onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
            disabled={!canContinue}
          >
            Devam
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Button>
        )}
      </div>
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
