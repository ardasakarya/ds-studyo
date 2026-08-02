import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/lib/data";

/** 07 — nasıl çalışırız (sticky başlık + 4 adım). */
export function Process() {
  return (
    <section className="section">
      <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            no="04"
            eyebrow="süreç"
            lines={["Dört adım,", "sürprizsiz süreç."]}
            description="Her adımın çıktısı bellidir. Onaylamadığınız hiçbir şey bir sonraki adıma geçmez."
          />
        </div>

        <ol className="flex flex-col">
          {processSteps.map((step, i) => (
            <li
              key={step.no}
              className="reveal group relative flex flex-col gap-3 border-t border-line py-9 last:border-b"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <div className="flex items-baseline gap-5">
                <span className="font-mono text-sm text-accent">{step.no}</span>
                <h3 className="text-2xl">{step.title}</h3>
                <span className="ml-auto text-sm text-fg-faint">
                  {step.duration}
                </span>
              </div>

              <p className="max-w-xl pl-10 text-fg-muted">{step.description}</p>

              <span className="ml-10 w-fit rounded-full border border-line bg-ink-800/60 px-3 py-1 text-xs text-fg-muted">
                Çıktı: {step.output}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
