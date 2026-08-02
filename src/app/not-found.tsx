import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-32">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <div className="shell relative flex flex-col items-start gap-6">
        <span className="eyebrow">404</span>
        <h1 className="max-w-[16ch] text-[clamp(2.4rem,6vw,4.2rem)]">
          Aradığınız sayfa burada değil.
        </h1>
        <p className="max-w-md text-fg-muted">
          Bağlantı taşınmış ya da hiç var olmamış olabilir. Buradan devam
          edebilirsiniz.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/">Anasayfa</ButtonLink>
          <ButtonLink href="/referanslar" variant="outline">
            Referanslar
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
