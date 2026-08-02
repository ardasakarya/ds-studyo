import { Counter } from "@/components/ui/counter";
import { stats } from "@/lib/data";

/** 10 — rakamlar. */
export function Stats() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="shell relative">
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal flex flex-col gap-2"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <dt className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none text-fg">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dt>
              <dd className="text-sm text-fg-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
