import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { comparison } from "@/lib/data";
import { cn } from "@/lib/utils";

/** 09 — neden biz (karşılaştırma tablosu). */
export function WhyUs() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="neden biz"
          lines={["Üç seçeneğiniz var.", "Farkı açıkça yazdık."]}
          description="Her iş için doğru cevap biz değiliz — hangi durumda kimin daha uygun olduğunu da söylüyoruz."
        />

        <div className="reveal mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[26%] py-5 pr-6 font-mono text-xs tracking-[0.16em] text-fg-faint uppercase">
                  karşılaştırma
                </th>
                {comparison.columns.map((column, i) => {
                  const isUs = i === comparison.columns.length - 1;
                  return (
                    <th
                      key={column}
                      className={cn(
                        "py-5 pr-6 font-display text-lg font-medium",
                        isUs ? "text-accent" : "text-fg-muted",
                      )}
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-line transition-colors duration-300 hover:bg-ink-800/40"
                >
                  <th
                    scope="row"
                    className="py-5 pr-6 align-top text-sm font-normal text-fg-faint"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => {
                    const isUs = i === row.values.length - 1;
                    return (
                      <td
                        key={`${row.label}-${value}`}
                        className={cn(
                          "py-5 pr-6 align-top text-[0.95rem]",
                          isUs ? "text-fg" : "text-fg-muted",
                        )}
                      >
                        <span className="flex items-start gap-2">
                          {isUs ? (
                            <Check
                              className="mt-1 size-4 shrink-0 text-mint"
                              strokeWidth={2}
                              aria-hidden
                            />
                          ) : null}
                          {value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
