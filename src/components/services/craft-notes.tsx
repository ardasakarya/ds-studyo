import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Hizmet listesinin altındaki iki not: tasarımı nasıl kurduğumuz ve paneli
 * kime göre yaptığımız. Fiyat listesine bakan kişinin en çok merak ettiği
 * ama hizmet kartlarına sığmayan iki konu.
 */
const notes = [
  {
    no: "01",
    title: "Tasarım şablondan gelmiyor",
    body: "Hazır tema kurmuyoruz, yapay zekâya da çizdirmiyoruz. Her proje için ayrı bir tasarım kuruyor; renk, yazı ve düzeni markanın diline göre tek tek oturtuyoruz.",
    points: [
      "Rakip taraması ve marka dili çıkarımı",
      "Sıfırdan kurulan düzen ve tasarım sistemi",
      "Ekran ekran gözden geçirme, sonra kod",
    ],
  },
  {
    no: "02",
    title: "Panel sizin işinize göre",
    body: "Yönetim panelini kalıptan çıkarmıyoruz. Önce günlük işinizi dinliyoruz; hangi işi kaç kere yapıyorsanız panel onun etrafında kuruluyor.",
    points: [
      "Sık yapılan iş, en az tıklamayla",
      "Sadece işinize yarayan alanlar ve raporlar",
      "Rol bazlı erişim: herkes kendi ekranını görür",
    ],
  },
] as const;

export function CraftNotes() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="çalışma biçimi"
          lines={["Aynı işi", "iki kere yapmıyoruz."]}
          description="Hizmet listesi herkeste benzer görünür; fark, tasarımın ve panelin nasıl kurulduğunda ortaya çıkıyor."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          {notes.map((note, i) => (
            <article
              key={note.no}
              className="reveal flex flex-col gap-5 bg-ink-950 p-8 lg:p-10"
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
            >
              <span className="edge-note text-fg-faint">{note.no}</span>

              <h3 className="max-w-[16ch] text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.02]">
                {note.title}
              </h3>

              <p className="max-w-md text-fg-muted">{note.body}</p>

              <ul className="mt-auto flex flex-col gap-2.5 border-t border-line pt-6">
                {note.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-fg-muted"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
