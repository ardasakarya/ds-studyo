import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerNav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div
        className="glow -top-40 left-1/2 size-[600px] -translate-x-1/2 bg-accent/8"
        aria-hidden
      />

      <div className="shell relative py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-display text-2xl">
              {site.name}
              <span className="text-accent">.</span>
            </Link>
            <p className="max-w-sm text-fg-muted">{site.description}</p>
            <div className="flex flex-col gap-1 text-sm">
              <a
                href={`mailto:${site.contact.email}`}
                className="text-fg transition-colors hover:text-accent"
              >
                {site.contact.email}
              </a>
              <a
                href={site.contact.phoneHref}
                className="text-fg-muted transition-colors hover:text-fg"
              >
                {site.contact.phone}
              </a>
              <span className="text-fg-faint">{site.contact.location}</span>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((column) => (
              <div key={column.title} className="flex flex-col gap-4">
                <h3 className="font-mono text-xs tracking-[0.18em] text-fg-faint uppercase">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-fg-muted transition-colors duration-300 hover:text-fg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg-faint">
            © {new Date().getFullYear()} {site.legalName}. Tüm hakları saklıdır.
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {social.label}
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
