"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

/**
 * İletişim formu.
 * Şimdilik mailto ile gönderiyor; backend hazır olduğunda bu fonksiyon
 * `/api/iletisim` route'una POST edecek.
 */
export function ContactForm() {
  const searchParams = useSearchParams();
  const [preset, setPreset] = useState(searchParams.get("paket") ?? "");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      preset ? `İletişim — ${preset}` : `İletişim — ${form.name}`,
    );
    const body = encodeURIComponent(
      [
        preset ? `İlgilenilen paket: ${preset}` : "",
        `Ad: ${form.name}`,
        `E-posta: ${form.email}`,
        `Telefon: ${form.phone}`,
        "",
        form.message,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${site.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={submit} className="card flex flex-col gap-6 p-8 lg:p-10">
      {preset ? (
        <span className="flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm text-accent-soft">
          {preset}
          <button
            type="button"
            onClick={() => setPreset("")}
            aria-label="Paket seçimini kaldır"
            className="text-accent-soft/70 transition-colors hover:text-fg"
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        </span>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-fg-muted">Ad soyad *</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-12 rounded-xl border border-line bg-ink-950 px-4 text-fg outline-none transition-colors duration-300 focus:border-accent/60"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm text-fg-muted">E-posta *</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="h-12 rounded-xl border border-line bg-ink-950 px-4 text-fg outline-none transition-colors duration-300 focus:border-accent/60"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-fg-muted">Telefon</span>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="h-12 rounded-xl border border-line bg-ink-950 px-4 text-fg outline-none transition-colors duration-300 focus:border-accent/60"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-fg-muted">Mesajınız *</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="resize-none rounded-xl border border-line bg-ink-950 px-4 py-3 text-fg outline-none transition-colors duration-300 placeholder:text-fg-faint focus:border-accent/60"
          placeholder="Nasıl yardımcı olabiliriz?"
        />
      </label>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-fg-faint">
          Gönderdiğiniz bilgiler yalnızca size dönüş yapmak için kullanılır.
        </p>
        <Button type="submit">
          Gönder
          <Send className="size-4" strokeWidth={1.5} aria-hidden />
        </Button>
      </div>
    </form>
  );
}
