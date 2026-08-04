"use client";

import { useEffect, useState } from "react";
import Lanyard from "@/components/ui/lanyard";
import { ProfileCard } from "@/components/ui/profile-card";
import { site } from "@/lib/site";
import { teamMembers } from "@/lib/team";
import { asset } from "@/lib/asset";

/**
 * Ekip bölümü.
 *
 * Masaüstünde (ince imleç + geniş ekran) kartlar ipe asılıdır: üzerine
 * gelince holografik parlama ve tilt çalışır, kartı tutup sallayabilirsiniz.
 *
 * Dokunmatik ve dar ekranlarda (telefon/tablet) fizik sahnesi devre dışı:
 * WebGL tuvali + `touch-action: none` kombinasyonu dokunmatikte kaydırmayı
 * kilitleyip kartı takılı bırakabiliyordu. Orada düz `ProfileCard` gösterilir.
 */
const cardSocials = site.socials.filter((social) =>
  ["LinkedIn", "GitHub", "Instagram"].includes(social.label),
);

/** Fizik sahnesinin KAPALI olduğu ekranlar. */
const COMPACT_QUERY = "(max-width: 1023.98px), (pointer: coarse)";
const COARSE_QUERY = "(pointer: coarse)";

/**
 * Sunucuda ve ilk boyamada güvenli taraf (düz kart) seçilir; masaüstü
 * olduğu ilk efektte anlaşılınca ipe asılı sürüme geçilir. Böylece JS
 * çalışmasa da bölüm çalışır durumda kalır.
 */
function useCompactTeam() {
  const [state, setState] = useState({ compact: true, coarse: true });

  useEffect(() => {
    const compactMq = window.matchMedia(COMPACT_QUERY);
    const coarseMq = window.matchMedia(COARSE_QUERY);

    const sync = () =>
      setState({ compact: compactMq.matches, coarse: coarseMq.matches });

    sync();
    compactMq.addEventListener("change", sync);
    coarseMq.addEventListener("change", sync);

    return () => {
      compactMq.removeEventListener("change", sync);
      coarseMq.removeEventListener("change", sync);
    };
  }, []);

  return state;
}

export function TeamLanyards() {
  const { compact, coarse } = useCompactTeam();

  const card = (member: (typeof teamMembers)[number], standalone: boolean) => (
    <ProfileCard
      className={standalone ? "pc-standalone" : "pc-on-lanyard"}
      /* Dokunmatikte tilt kapalı: pointermove dinleyicisi olmayınca
         kaydırma da kesilmiyor. */
      enableTilt={standalone ? !coarse : true}
      avatarUrl={member.image}
      kicker={`${site.name} / ${member.no}`}
      name={member.name}
      title={member.role}
      handle={member.handle}
      status={member.status}
      contactText="Yaz"
      socialLinks={cardSocials}
      onContactClick={() => {
        window.location.href = `mailto:${site.contact.email}`;
      }}
    />
  );

  return (
    <section
      className="section relative isolate overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(230,221,170,0.075),transparent_34%),radial-gradient(circle_at_18%_64%,rgba(90,129,146,0.07),transparent_32%),linear-gradient(180deg,transparent,rgba(255,255,255,0.012)_48%,transparent)]"
      id="ekip"
    >
      <div
        className="pointer-events-none absolute top-[24%] left-1/2 -z-10 h-[62%] w-[82%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(242,236,201,0.09),rgba(74,104,117,0.035)_38%,transparent_72%)] blur-3xl"
        aria-hidden
      />

      <div className="shell relative z-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="chapter">ekip / 06</span>
            <h2 className="display mt-6 max-w-[11ch] -rotate-2 text-[clamp(3rem,7vw,7.5rem)]">
              Kodu yazan ekip.
            </h2>
          </div>
          <p className="max-w-sm text-fg-muted">
            Toplantıda gördüğünüz kişilerle ürünü geliştiren kişiler aynı.
            {compact
              ? " Kartlardaki ikonlardan bize doğrudan ulaşabilirsiniz."
              : " Kartın üzerine gelin, tutup sallayın; ikonlardan bize ulaşın."}
          </p>
        </div>

        {compact ? (
          <div className="mt-12 grid justify-items-center gap-10 sm:grid-cols-2 sm:gap-6">
            {teamMembers.map((member) => (
              <article key={member.slug} className="w-full max-w-[380px]">
                <h3 className="sr-only">{`${member.name} — ${member.role}`}</h3>
                {card(member, true)}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <article
                key={member.slug}
                className="lanyard-panel relative min-w-0 overflow-hidden"
                style={
                  {
                    "--lanyard-height": "820px",
                    "--lanyard-height-mobile": "620px",
                  } as React.CSSProperties
                }
              >
                <h3 className="sr-only">{`${member.name} — ${member.role}`}</h3>
                <Lanyard
                  position={[0, 1.6, 16]}
                  gravity={[0, -40, 0]}
                  fov={22}
                  lanyardImage={asset("/lanyard/lanyard-light.png")}
                  lanyardWidth={0.92}
                  dropDirection={index % 2 === 0 ? -1 : 1}
                  cardContent={card(member, false)}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
