/**
 * Ekip kartları — ipe asılı ProfileCard'ları besler
 * (bkz. components/about/team-lanyards.tsx).
 */
export type TeamMember = {
  slug: string;
  no: string;
  name: string;
  role: string;
  handle: string;
  status: string;
  image: string;
  skills: string[];
};

export const teamMembers: TeamMember[] = [
  {
    slug: "arda",
    no: "01",
    name: "Arda SAKARYA",
    role: "Bilgisayar Mühendisi",
    handle: "ardasakarya",
    status: "Projede aktif",
    image: "/scenes/hizmetler-light-v2.webp",
    skills: ["Arayüz mimarisi", "Motion & 3B", "Performans"],
  },
  {
    slug: "hasan-denizhan",
    no: "02",
    name: "Hasan DENİZHAN",
    role: "Bilgisayar Mühendisi",
    handle: "hasandenizhan",
    status: "Projede aktif",
    image: "/scenes/hakkimizda-light-v2.webp",
    skills: ["Veri modeli", "Entegrasyon", "Bulut & güvenlik"],
  },
];
