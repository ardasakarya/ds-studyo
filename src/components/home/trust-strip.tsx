import { projects } from "@/lib/data";

/** 02 — güven şeridi: birlikte çalıştığımız markalar. */
export function TrustStrip() {
  return (
    <section id="icerik" className="scroll-mt-24">
      <div className="shell flex flex-col gap-7 py-10">
        <p className="reveal font-mono text-xs tracking-[0.18em] text-fg-faint uppercase">
          birlikte çalıştığımız markalar
        </p>
        <ul className="reveal grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between">
          {projects.map((project) => (
            <li key={project.slug}>
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="font-display text-[1.05rem] whitespace-nowrap text-fg-faint transition-colors duration-300 hover:text-fg"
              >
                {project.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
