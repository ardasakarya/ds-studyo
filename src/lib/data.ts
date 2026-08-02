/**
 * Sitenin TÜM içeriği bu dosyada.
 * Yeni hizmet / proje / paket eklemek = ilgili diziye bir kayıt eklemek.
 * Sayfalar ve bileşenler bu dosyadan beslenir, hiçbir metin JSX içine gömülmez.
 */

/* ------------------------------------------------------------------ */
/* Hizmetler                                                           */
/* ------------------------------------------------------------------ */

export type ServiceGroupId = "yazilim" | "buyume" | "tasarim-destek";

export const serviceGroups: {
  id: ServiceGroupId;
  title: string;
  description: string;
}[] = [
  {
    id: "yazilim",
    title: "Yazılım geliştirme",
    description: "Ürünün kendisi: site, uygulama, panel, entegrasyon.",
  },
  {
    id: "buyume",
    title: "Büyüme",
    description: "Ürün yayına girdikten sonra görünürlük ve talep.",
  },
  {
    id: "tasarim-destek",
    title: "Tasarım & destek",
    description: "Deneyimi tasarlayan ve ayakta tutan katman.",
  },
];

export type Service = {
  slug: string;
  no: string;
  title: string;
  tag: string;
  icon: string; // components/ui/icon.tsx içindeki anahtar
  /** Hizmetler sayfasındaki sahnede kullanılan kapak (koyu tema). */
  image: string;
  /** Aynı kapağın aydınlık tema sürümü (kâğıt zemin + mürekkep çizgi). */
  imageLight: string;
  group: ServiceGroupId;
  featured?: boolean; // anasayfadaki 6 kart
  summary: string;
  intro: string;
  forWho: string[];
  scope: string[];
  deliverables: string[];
  tech: string[];
  priceFrom: string;
  timeline: string;
  relatedProjects: string[]; // project slug
};

/**
 * ŞİMDİLİK yayından kaldırılan hizmetler.
 * Veri aşağıda duruyor; listelerde, paketlerde, sitemap'te ve kendi detay
 * sayfasında görünmüyor. Geri açmak için slug'ı bu diziden silmek yeterli.
 */
export const hiddenServiceSlugs: string[] = [
  "yapay-zeka",
  "saas",
  "api-entegrasyon",
  "bakim-destek",
];

const allServices: Service[] = [
  {
    slug: "web-sitesi",
    no: "01",
    title: "Web sitesi",
    tag: "WEB",
    icon: "globe",
    image: "/services/web-sitesi.webp",
    imageLight: "/services/web-sitesi-aydinlik.webp",
    group: "yazilim",
    featured: true,
    summary:
      "Kurumsal, marka ve kampanya siteleri; hızlı, erişilebilir ve dönüşüm odaklı.",
    intro:
      "Şablon kurmuyoruz. Markanın anlatısını, hedef kitlesini ve satış hedefini konuşup ona göre bir yapı kuruyoruz; sonuç hem güzel hem ölçülebilir oluyor.",
    forWho: [
      "İnternette ciddi görünmesi gereken kurumsal firmalar",
      "Yeni markasını lanse eden ekipler",
      "Mevcut sitesi yavaş, mobilde bozuk olan işletmeler",
    ],
    scope: [
      "İçerik mimarisi ve sayfa planı",
      "Özel tasarım (şablon değil) + tasarım sistemi",
      "Mikro animasyonlar ve scroll deneyimi",
      "Teknik SEO, hız ve erişilebilirlik",
      "Form, WhatsApp ve analitik kurulumu",
    ],
    deliverables: [
      "Yayına alınmış site + alan adı & SSL",
      "İçerik yönetim paneli (opsiyonel)",
      "Google Analytics / Search Console kurulumu",
      "Kaynak kodu ve tam devir",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Vercel"],
    priceFrom: "₺14.900",
    timeline: "1–4 hafta",
    relatedProjects: ["merada-gayrimenkul", "denizhan-medical", "elit-profil"],
  },
  {
    slug: "web-uygulamasi",
    no: "02",
    title: "Web uygulaması",
    tag: "WEB APP",
    icon: "app-window",
    image: "/services/web-uygulamasi.webp",
    imageLight: "/services/web-uygulamasi-aydinlik.webp",
    group: "yazilim",
    featured: true,
    summary:
      "Yönetim panelleri, portallar, rezervasyon ve operasyon platformları.",
    intro:
      "İşin tarayıcıda dönüyorsa panelin hızlı, yetkilendirmesi doğru ve verisi güvende olmalı. Kullanıcı rollerinden raporlamaya kadar tüm akışı kuruyoruz.",
    forWho: [
      "Excel ve WhatsApp ile yönetilen operasyonlar",
      "Bayi / müşteri portalı gereken firmalar",
      "Kendi SaaS ürününü kuran ekipler",
    ],
    scope: [
      "Veri modeli ve yetki mimarisi",
      "Yönetim paneli ve kullanıcı arayüzleri",
      "Raporlama ve analitik ekranları",
      "Bulut kurulumu, yedekleme, izleme",
      "Rol bazlı erişim ve denetim kaydı",
    ],
    deliverables: [
      "Canlı uygulama + yönetim paneli",
      "Veritabanı ve yedekleme planı",
      "Teknik dokümantasyon",
      "Ekip eğitimi (1 oturum)",
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "MySQL", "Supabase"],
    priceFrom: "₺69.900",
    timeline: "6–12 hafta",
    relatedProjects: ["merada-yonetim", "diamond-tourism"],
  },
  {
    slug: "mobil-uygulama",
    no: "03",
    title: "Mobil uygulama",
    tag: "MOBILE",
    icon: "smartphone",
    image: "/services/mobil-uygulama.webp",
    imageLight: "/services/mobil-uygulama-aydinlik.webp",
    group: "yazilim",
    featured: true,
    summary: "iOS ve Android için hızlı, sezgisel ve uzun ömürlü ürünler.",
    intro:
      "Tek kod tabanıyla iki mağazaya çıkıyoruz. Mağaza yayını, bildirim altyapısı ve güncelleme süreci dahil; siz sadece ürünü büyütmeye odaklanıyorsunuz.",
    forWho: [
      "Fikrini MVP olarak hızlı test etmek isteyenler",
      "Sahada çalışan ekipler için iç uygulama arayanlar",
      "Müşterisiyle bildirimle iletişim kuran markalar",
    ],
    scope: [
      "Ürün akışı ve ekran tasarımı",
      "iOS + Android geliştirme",
      "Üyelik, bildirim, ödeme entegrasyonu",
      "Backend ve yönetim paneli",
      "Mağaza yayını ve sürüm yönetimi",
    ],
    deliverables: [
      "App Store & Google Play'de yayında uygulama",
      "Yönetim paneli",
      "Analitik ve çökme raporlama",
      "3 ay yayın sonrası bakım",
    ],
    tech: ["React Native", "Expo", "TypeScript", "Node.js", "Firebase"],
    priceFrom: "₺49.900",
    timeline: "4–10 hafta",
    relatedProjects: ["diamond-tourism"],
  },
  {
    slug: "e-ticaret",
    no: "04",
    title: "E-ticaret sistemleri",
    tag: "COMMERCE",
    icon: "shopping-cart",
    image: "/services/e-ticaret.webp",
    imageLight: "/services/e-ticaret-aydinlik.webp",
    group: "yazilim",
    featured: true,
    summary:
      "Ürün, stok, ödeme, kargo ve pazaryeri entegrasyonlarıyla satış altyapıları.",
    intro:
      "Vitrin güzel olsun ama asıl iş arkada: stok doğru, ödeme sorunsuz, kargo otomatik. Satışı yavaşlatan her adımı ölçüp kısaltıyoruz.",
    forWho: [
      "Kendi markasını satan üreticiler",
      "Pazaryerinden kendi sitesine geçmek isteyenler",
      "Sepette müşteri kaybeden mağazalar",
    ],
    scope: [
      "Ürün, varyant ve stok yapısı",
      "Ödeme (iyzico / PayTR / Stripe) entegrasyonu",
      "Kargo ve fatura entegrasyonları",
      "Kampanya, kupon ve sepet optimizasyonu",
      "Dönüşüm ölçümü ve remarketing kurulumu",
    ],
    deliverables: [
      "Yayında mağaza + yönetim paneli",
      "Ödeme ve kargo entegrasyonları",
      "Ürün girişi eğitimi",
      "Dönüşüm takibi (GA4 + Meta Pixel)",
    ],
    tech: ["Next.js", "Stripe", "iyzico", "MySQL", "Vercel"],
    priceFrom: "₺39.900",
    timeline: "3–8 hafta",
    relatedProjects: ["by-kurtulus"],
  },
  {
    slug: "ozel-yazilim",
    no: "05",
    title: "Kişiye özel yazılım",
    tag: "CUSTOM",
    icon: "wrench",
    image: "/services/ozel-yazilim.webp",
    imageLight: "/services/ozel-yazilim-aydinlik.webp",
    group: "yazilim",
    featured: true,
    summary:
      "Küçük ve orta ölçekli şirketlerin kendi iş akışına göre yazılmış araçlar.",
    intro:
      "Hazır programa uymaya çalışmak yerine programı işinize uyduruyoruz. Önce süreci izliyor, sonra sadece gerçekten gereken şeyi yazıyoruz.",
    forWho: [
      "Süreci hazır yazılımlara sığmayan firmalar",
      "Birden çok sistemi elle senkronlayan ekipler",
      "Kendi verisini kendi sunucusunda tutmak isteyenler",
    ],
    scope: [
      "Süreç analizi ve keşif çalışması",
      "Kapsam ve öncelik planı",
      "Aşamalı geliştirme (sprint)",
      "Mevcut sistemlerle entegrasyon",
      "Eğitim ve devir",
    ],
    deliverables: [
      "Firmaya özel uygulama",
      "Süreç dokümanı",
      "Kaynak kod + sunucu kurulumu",
      "Kullanıcı eğitimi",
    ],
    tech: ["Next.js", "Node.js", "Python", "PostgreSQL", "Docker"],
    priceFrom: "₺24.900",
    timeline: "2–12 hafta",
    relatedProjects: ["merada-yonetim"],
  },
  {
    slug: "yapay-zeka",
    no: "06",
    title: "Yapay zekâ çözümleri",
    tag: "AI",
    icon: "sparkles",
    image: "/services/yapay-zeka.webp",
    imageLight: "/services/yapay-zeka-aydinlik.webp",
    group: "yazilim",
    featured: true,
    summary:
      "Kuruma özel asistanlar, belge işleme, öneri ve üretken yapay zekâ sistemleri.",
    intro:
      "Demo için değil, işin içine gömülü yapay zekâ. Kendi verinizle konuşan asistan, belgeden veri çıkarma, otomatik sınıflandırma — ölçülebilir kazançla.",
    forWho: [
      "Gün içinde çok belge/teklif işleyen ekipler",
      "Müşteri sorularının %70'i tekrar eden firmalar",
      "Veriden öneri üretmek isteyen platformlar",
    ],
    scope: [
      "Kullanım senaryosu ve fizibilite",
      "Veri hazırlığı ve gizlilik planı",
      "RAG / asistan altyapısı",
      "Değerlendirme ve doğruluk ölçümü",
      "Maliyet ve limit yönetimi",
    ],
    deliverables: [
      "Çalışan asistan / işleme hattı",
      "Yönetim ve izleme ekranı",
      "Doğruluk raporu",
      "Maliyet tahmin tablosu",
    ],
    tech: ["Claude API", "OpenAI", "LangChain", "pgvector", "Python"],
    priceFrom: "₺34.900",
    timeline: "3–8 hafta",
    relatedProjects: [],
  },
  {
    slug: "saas",
    no: "07",
    title: "SaaS ürün altyapısı",
    tag: "SAAS",
    icon: "boxes",
    image: "/services/saas.webp",
    imageLight: "/services/saas-aydinlik.webp",
    group: "yazilim",
    summary:
      "Abonelik, üyelik, ödeme ve çok kiracılı ölçeklenebilir ürün altyapıları.",
    intro:
      "Ürününüzü satmaya başlayabilmeniz için gereken sıkıcı ama kritik katman: abonelik, faturalama, kiracı ayrımı, kullanım limitleri.",
    forWho: [
      "SaaS ürününü ilk kez satışa açanlar",
      "Kurumsal müşteri isteyen ürün ekipleri",
    ],
    scope: [
      "Çok kiracılı veri mimarisi",
      "Abonelik ve faturalama akışı",
      "Kullanım limiti ve planlar",
      "Onboarding ve deneme süreci",
      "Yönetim / destek paneli",
    ],
    deliverables: [
      "Abonelik altyapısı",
      "Faturalama entegrasyonu",
      "Yönetim paneli",
      "Teknik dokümantasyon",
    ],
    tech: ["Next.js", "Stripe", "PostgreSQL", "Supabase", "Docker"],
    priceFrom: "₺79.900",
    timeline: "8–14 hafta",
    relatedProjects: ["merada-yonetim"],
  },
  {
    slug: "masaustu-uygulama",
    no: "08",
    title: "Masaüstü uygulaması",
    tag: "DESKTOP",
    icon: "monitor",
    image: "/services/masaustu-uygulama.webp",
    imageLight: "/services/masaustu-uygulama-aydinlik.webp",
    group: "yazilim",
    summary:
      "macOS ve Windows için güvenli, hızlı ve çevrimdışı çalışabilen yazılımlar.",
    intro:
      "İnternet olmadığında da durmayan, donanımla (yazıcı, barkod, kasa) konuşan uygulamalar.",
    forWho: [
      "Mağaza / depo / atölye gibi saha noktaları",
      "Çevrimdışı çalışması gereken ekipler",
    ],
    scope: [
      "Çevrimdışı veri ve senkronizasyon",
      "Donanım entegrasyonları",
      "Otomatik güncelleme sistemi",
      "Kurulum paketleri (dmg / exe)",
    ],
    deliverables: [
      "İmzalı kurulum paketleri",
      "Otomatik güncelleme sunucusu",
      "Kullanım kılavuzu",
    ],
    tech: ["Tauri", "Electron", "SQLite", "TypeScript"],
    priceFrom: "₺54.900",
    timeline: "6–10 hafta",
    relatedProjects: [],
  },
  {
    slug: "api-entegrasyon",
    no: "09",
    title: "API & entegrasyon",
    tag: "API",
    icon: "webhook",
    image: "/services/api-entegrasyon.webp",
    imageLight: "/services/api-entegrasyon-aydinlik.webp",
    group: "yazilim",
    summary:
      "CRM, ERP, ödeme, muhasebe ve üçüncü taraf sistemleri tek akışta buluştururuz.",
    intro:
      "Aynı veriyi iki yere elle girmek zorunda kalmayın. Sistemler arası köprüyü kurup hata durumlarını da biz yönetiyoruz.",
    forWho: [
      "Birden çok yazılım kullanan firmalar",
      "Pazaryeri + kendi sitesi olan satıcılar",
    ],
    scope: [
      "Entegrasyon haritası çıkarma",
      "API geliştirme veya bağlama",
      "Hata yönetimi ve tekrar deneme",
      "İzleme ve uyarı sistemi",
    ],
    deliverables: [
      "Çalışan entegrasyon",
      "API dokümantasyonu",
      "İzleme paneli / uyarılar",
    ],
    tech: ["Node.js", "REST", "Webhooks", "Redis", "Docker"],
    priceFrom: "₺19.900",
    timeline: "1–5 hafta",
    relatedProjects: ["diamond-tourism"],
  },
  {
    slug: "otomasyon",
    no: "10",
    title: "İş süreci otomasyonu",
    tag: "AUTOMATION",
    icon: "workflow",
    image: "/services/otomasyon.webp",
    imageLight: "/services/otomasyon-aydinlik.webp",
    group: "yazilim",
    summary:
      "Tekrarlayan operasyonları ölçülebilir ve hatasız dijital akışlara dönüştürürüz.",
    intro:
      "Her ay tekrarlayan 20 saatlik işi 20 dakikaya indiriyoruz. Önce ölçüyoruz, sonra otomatikleştiriyoruz.",
    forWho: [
      "Manuel raporlama yapan ekipler",
      "Teklif / fatura / stok akışı elle yürüyen firmalar",
    ],
    scope: [
      "Süreç analizi ve zaman ölçümü",
      "Zamanlanmış görevler ve botlar",
      "Otomatik raporlama e-postaları",
      "Dokümantasyon ve eğitim",
    ],
    deliverables: [
      "Otomasyon akışları",
      "Kazanılan süre raporu",
      "Bakım planı",
    ],
    tech: ["Node.js", "Python", "Cron", "n8n", "Google API"],
    priceFrom: "₺24.900",
    timeline: "2–4 hafta",
    relatedProjects: [],
  },
  {
    slug: "seo",
    no: "11",
    title: "SEO",
    tag: "GROWTH",
    icon: "trending-up",
    image: "/services/seo.webp",
    imageLight: "/services/seo-aydinlik.webp",
    group: "buyume",
    summary:
      "Teknik SEO, içerik mimarisi, hız ve organik görünürlük çalışmaları.",
    intro:
      "Sıralama vaadi vermiyoruz; teknik temeli, içerik yapısını ve hızı düzeltip ölçümü şeffaf paylaşıyoruz.",
    forWho: [
      "Google'da rakiplerinin arkasında kalan firmalar",
      "Yeni site açıp organik trafik isteyenler",
    ],
    scope: [
      "Teknik SEO denetimi",
      "Anahtar kelime ve içerik haritası",
      "Core Web Vitals iyileştirmesi",
      "Yapısal veri ve dahili bağlantı",
    ],
    deliverables: [
      "Denetim raporu ve yol haritası",
      "Uygulanmış teknik düzeltmeler",
      "Aylık performans raporu",
    ],
    tech: ["Search Console", "GA4", "Lighthouse", "Schema.org"],
    priceFrom: "₺7.900 / ay",
    timeline: "Sürekli",
    relatedProjects: ["merada-gayrimenkul"],
  },
  {
    slug: "reklam",
    no: "12",
    title: "Google & Meta Ads",
    tag: "ADS",
    icon: "megaphone",
    image: "/services/reklam.webp",
    imageLight: "/services/reklam-aydinlik.webp",
    group: "buyume",
    summary:
      "Ölçülebilir reklam stratejisi, kampanya kurulumu ve dönüşüm optimizasyonu.",
    intro:
      "Bütçeyi yakmadan test ediyoruz: küçük başlayıp çalışan kampanyayı büyütüyoruz. Her ay net rapor.",
    forWho: [
      "Hızlı talep yaratması gereken markalar",
      "Reklam veriyor ama dönüşü ölçemeyen firmalar",
    ],
    scope: [
      "Hesap ve dönüşüm kurulumu",
      "Kampanya stratejisi ve kreatif brief",
      "A/B testleri",
      "Aylık optimizasyon ve raporlama",
    ],
    deliverables: [
      "Kurulu reklam hesapları",
      "Kampanyalar ve hedef kitleler",
      "Aylık performans raporu",
    ],
    tech: ["Google Ads", "Meta Ads", "GA4", "Tag Manager"],
    priceFrom: "₺6.900 / ay",
    timeline: "Sürekli",
    relatedProjects: [],
  },
  {
    slug: "sosyal-medya",
    no: "13",
    title: "Sosyal medya yönetimi",
    tag: "SOCIAL",
    icon: "share",
    image: "/services/sosyal-medya.webp",
    imageLight: "/services/sosyal-medya-aydinlik.webp",
    group: "buyume",
    summary:
      "İçerik planı, kreatif üretim, topluluk yönetimi ve performans raporlaması.",
    intro:
      "Marka sesini oturtup düzenli yayın akışı kuruyoruz; içerik üretimi ve raporlama bizde.",
    forWho: ["Düzenli içerik üretemeyen ekipler", "Yeni lanse edilen markalar"],
    scope: [
      "İçerik takvimi",
      "Görsel ve video kreatif üretimi",
      "Topluluk yönetimi",
      "Aylık performans raporu",
    ],
    deliverables: ["Aylık içerik planı", "Üretilmiş kreatifler", "Rapor"],
    tech: ["Figma", "Premiere", "Meta Business", "Buffer"],
    priceFrom: "₺9.900 / ay",
    timeline: "Sürekli",
    relatedProjects: ["by-kurtulus"],
  },
  {
    slug: "ui-ux",
    no: "14",
    title: "UI/UX & ürün tasarımı",
    tag: "DESIGN",
    icon: "palette",
    image: "/services/ui-ux.webp",
    imageLight: "/services/ui-ux-aydinlik.webp",
    group: "tasarim-destek",
    summary:
      "Araştırmadan prototipe, tasarım sisteminden kullanılabilirlik testine.",
    intro:
      "Kod yazmadan önce doğru ekranı bulmak en ucuz aşamadır. Prototiple test ediyor, sonra geliştiriyoruz.",
    forWho: [
      "Ürünü karmaşıklaşan ekipler",
      "Yatırımcıya sunum yapacak kurucular",
    ],
    scope: [
      "Kullanıcı ve rakip araştırması",
      "Akış ve wireframe",
      "Yüksek çözünürlüklü tasarım",
      "Tasarım sistemi ve bileşen kütüphanesi",
      "Kullanılabilirlik testi",
    ],
    deliverables: [
      "Figma dosyası ve prototip",
      "Tasarım sistemi",
      "Test bulguları raporu",
    ],
    tech: ["Figma", "Framer", "Maze"],
    priceFrom: "₺19.900",
    timeline: "2–5 hafta",
    relatedProjects: ["elit-profil", "denizhan-medical"],
  },
  {
    slug: "bakim-destek",
    no: "15",
    title: "Bakım, bulut & destek",
    tag: "CLOUD",
    icon: "life-buoy",
    image: "/services/bakim-destek.webp",
    imageLight: "/services/bakim-destek-aydinlik.webp",
    group: "tasarim-destek",
    summary:
      "Yayın, izleme, güvenlik, yedekleme ve sürdürülebilir teknik destek.",
    intro:
      "Yayına almak bitiş değil başlangıç. Güncelleme, yedek, izleme ve destek aboneliğiyle site/uygulama ayakta kalır.",
    forWho: [
      "Teknik ekibi olmayan firmalar",
      "Kritik iş akışı yazılıma bağlı olanlar",
    ],
    scope: [
      "Sunucu / bulut kurulumu",
      "Otomatik yedekleme",
      "Güvenlik güncellemeleri",
      "Uptime izleme ve uyarılar",
      "Aylık destek saatleri",
    ],
    deliverables: [
      "İzleme paneli",
      "Yedekleme politikası",
      "Aylık bakım raporu",
    ],
    tech: ["Vercel", "Hetzner", "Docker", "Cloudflare", "Sentry"],
    priceFrom: "₺1.900 / ay",
    timeline: "Sürekli",
    relatedProjects: [],
  },
];

/**
 * Sitede görünen hizmetler — gizlenenler hariç.
 * Sıra numarası (01, 02, …) burada yeniden veriliyor ki bir hizmet
 * gizlenince numaralarda boşluk kalmasın.
 */
export const services: Service[] = allServices
  .filter((service) => !hiddenServiceSlugs.includes(service.slug))
  .map((service, index) => ({
    ...service,
    no: String(index + 1).padStart(2, "0"),
  }));

export const featuredServices = services.filter((s) => s.featured);

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ */
/* İşler / referanslar                                                 */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  no: string;
  title: string;
  category: string;
  domain: string;
  href: string;
  image: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  /** Projede somut olarak yapılan işler — referans anlatısında listelenir. */
  highlights: string[];
  results: { value: string; label: string }[];
  services: string[]; // service slug
  stack: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "merada-gayrimenkul",
    no: "01",
    title: "Merada Gayrimenkul",
    category: "Gayrimenkul · Kurumsal web",
    domain: "meradagayrimenkul.com",
    href: "https://meradagayrimenkul.com/",
    image: "/references/merada-gayrimenkul.jpg",
    year: "2025",
    summary:
      "Mersin'in emlak ofisi için ilan yönetimi olan kurumsal site ve arama deneyimi.",
    challenge:
      "İlanlar farklı portallarda dağınıktı, müşteri firmanın kendi vitrinini göremiyordu.",
    solution:
      "İlan girişinin panelden yapıldığı, filtrelenebilir ve hızlı bir kurumsal site kurduk.",
    highlights: [
      "Panelden ilan girişi ve içerik yönetimi",
      "Konuma ve tipe göre filtrelenebilir ilan arama",
      "0,9 saniyede açılan performans kurulumu",
      "Teknik SEO ve yerel arama optimizasyonu",
    ],
    results: [
      { value: "2.4x", label: "Site üzerinden gelen talep" },
      { value: "0.9 sn", label: "Ortalama açılış süresi" },
      { value: "%100", label: "Mobil uyum skoru" },
    ],
    services: ["web-sitesi", "seo"],
    stack: ["Next.js", "Node.js", "MySQL", "Tailwind"],
    featured: true,
  },
  {
    slug: "merada-yonetim",
    no: "02",
    title: "Merada Yönetim",
    category: "Site yönetimi · Web uygulaması",
    domain: "meradayonetim.com",
    href: "https://meradayonetim.com/",
    image: "/references/merada-yonetim.jpg",
    year: "2025",
    summary:
      "Apartman ve site yönetimi için aidat, gider ve duyuru akışını tek panelde toplayan platform.",
    challenge:
      "Aidat takibi Excel'de, duyurular WhatsApp'ta; sakinlerin sorularına cevap vermek saatler alıyordu.",
    solution:
      "Rol bazlı panel: yönetici gider ve aidat girer, sakin kendi hesabını ve duyuruları görür.",
    highlights: [
      "Yönetici ve sakin için rol bazlı iki ayrı panel",
      "Aidat, gider ve borç kalemlerinin dijital takibi",
      "Sakinlere açık duyuru ve talep akışı",
      "Excel + WhatsApp trafiğini bitiren tek merkez",
    ],
    results: [
      { value: "%70", label: "Daha az manuel takip" },
      { value: "Tek panel", label: "Aidat + gider + duyuru" },
      { value: "7/24", label: "Sakin erişimi" },
    ],
    services: ["web-uygulamasi", "ozel-yazilim"],
    stack: ["React", "Vite", "Node.js", "MySQL"],
    featured: true,
  },
  {
    slug: "denizhan-medical",
    no: "03",
    title: "Denizhan Medical",
    category: "Sağlık teknolojileri · Kurumsal web",
    domain: "denizhanmedikal.com.tr",
    href: "https://test.denizhanmedikal.com.tr/",
    image: "/references/denizhan-medikal.jpg",
    year: "2026",
    summary:
      "Medikal cihaz firması için ürün kataloğu ve bayi odaklı kurumsal site.",
    challenge:
      "Geniş ürün kataloğu PDF olarak dolaşıyor, güncel fiyat ve teknik bilgi kayboluyordu.",
    solution:
      "Kategorili ürün yapısı, teknik doküman alanı ve teklif talebi akışı olan kurumsal site.",
    highlights: [
      "180+ ürünün kategorili katalog mimarisine taşınması",
      "Ürün bazlı teknik doküman ve belge alanı",
      "Tek tıkla teklif talebi formu",
      "Bayi ve satış ekibi için iletişim akışı",
    ],
    results: [
      { value: "180+", label: "Kataloğa alınan ürün" },
      { value: "Tek tık", label: "Teklif talebi" },
      { value: "%45", label: "Daha uzun oturum süresi" },
    ],
    services: ["web-sitesi", "ui-ux"],
    stack: ["Next.js", "TypeScript", "Tailwind"],
    featured: true,
  },
  {
    slug: "by-kurtulus",
    no: "04",
    title: "By Kurtuluş",
    category: "Kuyumculuk · E-ticaret",
    domain: "bykurtulus.com",
    href: "https://bykurtulus.com/",
    image: "/references/by-kurtulus.jpg",
    year: "2025",
    summary:
      "Kuyum markası için ürün vitrini ve online satış deneyimi.",
    challenge:
      "Ürünler yalnızca Instagram'da satılıyordu; ölçüm ve stok takibi yoktu.",
    solution:
      "Ürün, varyant ve stok yapısı kurulmuş, ödeme entegrasyonlu mağaza deneyimi.",
    highlights: [
      "Ürün, varyant ve stok yapısının kurulması",
      "Ödeme entegrasyonlu sepet ve sipariş akışı",
      "Kuyum vitrinine uygun ürün fotoğraf düzeni",
      "Sipariş ve stok takibi için yönetim ekranı",
    ],
    results: [
      { value: "7/24", label: "Satış kanalı" },
      { value: "Otomatik", label: "Stok ve sipariş takibi" },
      { value: "%38", label: "Sepet tamamlama artışı" },
    ],
    services: ["e-ticaret", "sosyal-medya"],
    stack: ["Next.js", "Stripe", "MySQL"],
  },
  {
    slug: "diamond-tourism",
    no: "05",
    title: "Diamond Tourism",
    category: "Turizm · Rezervasyon platformu",
    domain: "diamondtourism.tr",
    href: "https://diamondtourism.tr/anasayfa",
    image: "/references/diamond-tourism.jpg",
    year: "2026",
    summary:
      "Villa, araç ve tekne kiralama için rezervasyon ve admin altyapısı.",
    challenge:
      "Rezervasyonlar telefonla alınıyor, müsaitlik takvimi tutulamıyordu.",
    solution:
      "Takvim tabanlı rezervasyon akışı, admin CRUD paneli ve fotoğraf yönetimi.",
    highlights: [
      "Takvim ve misafir sayısına göre rezervasyon akışı",
      "Villa, araç ve tekne için ayrı kategori yapısı",
      "Admin CRUD paneli ve fotoğraf yönetimi",
      "Anlık müsaitlik kontrolü ve rezervasyon notları",
    ],
    results: [
      { value: "3 kategori", label: "Villa · araç · tekne" },
      { value: "Anlık", label: "Müsaitlik kontrolü" },
      { value: "Panelden", label: "Tüm içerik yönetimi" },
    ],
    services: ["web-uygulamasi", "mobil-uygulama", "api-entegrasyon"],
    stack: ["Node.js", "Express", "MySQL"],
    featured: true,
  },
  {
    slug: "elit-profil",
    no: "06",
    title: "Elit Profil",
    category: "Endüstri · Kurumsal web",
    domain: "elitprofil.com",
    href: "https://ardasakarya.github.io/elitProfil_new/",
    image: "/references/elit-profil.jpg",
    year: "2026",
    summary:
      "Isıcam profili üreticisi için ürünü anlatan sinematik kurumsal deneyim.",
    challenge:
      "Teknik bir ürünü anlatmak zordu; katalog metni kimseyi ikna etmiyordu.",
    solution:
      "Scroll ile ilerleyen, ürünün kesitini ve avantajlarını adım adım gösteren anlatı.",
    highlights: [
      "Scroll'a bağlı sinematik ürün anlatımı",
      "Isıcam profilinin kesitini gösteren 3B sahne",
      "Avantajları adım adım açan bölüm kurgusu",
      "B2B bayi başvuru akışı",
    ],
    results: [
      { value: "Sinematik", label: "Ürün anlatımı" },
      { value: "%60", label: "Daha düşük çıkma oranı" },
      { value: "B2B", label: "Bayi başvuru akışı" },
    ],
    services: ["web-sitesi", "ui-ux"],
    stack: ["Vite", "React", "GSAP"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Süreç                                                               */
/* ------------------------------------------------------------------ */

export const processSteps = [
  {
    no: "01",
    title: "Keşif",
    duration: "2–5 gün",
    description:
      "İhtiyacını dinliyor, hedef kitleni ve rakiplerini inceliyoruz. Kapsam, bütçe ve yol haritası netleşiyor.",
    output: "Kapsam dokümanı + net teklif",
  },
  {
    no: "02",
    title: "Tasarım",
    duration: "1–3 hafta",
    description:
      "Wireframe'den premium arayüze. Her ekran onayına sunulur; beğenmediğin hiçbir şey koda girmez.",
    output: "Figma tasarım + prototip",
  },
  {
    no: "03",
    title: "Geliştirme",
    duration: "2–8 hafta",
    description:
      "Sprint'ler halinde geliştirir, her aşamada canlı önizleme linki paylaşırız. Süreç şeffaftır.",
    output: "Canlı önizleme + haftalık ilerleme",
  },
  {
    no: "04",
    title: "Yayın & destek",
    duration: "Sürekli",
    description:
      "Alan adı, SSL, yayına alma ve sonrasında bakım. Ölçer, raporlar, birlikte büyütürüz.",
    output: "Yayında ürün + bakım planı",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Teknoloji                                                           */
/* ------------------------------------------------------------------ */

export const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "React Native",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MySQL",
  "Supabase",
  "Tailwind CSS",
  "GSAP",
  "Motion",
  "Docker",
  "Vercel",
  "Cloudflare",
  "Figma",
] as const;

/* ------------------------------------------------------------------ */
/* Neden biz — karşılaştırma                                           */
/* ------------------------------------------------------------------ */

export const comparison = {
  columns: ["Freelancer", "Büyük ajans", "Biz"],
  rows: [
    {
      label: "Kiminle konuşursun",
      values: ["Tek kişi", "Müşteri temsilcisi", "Kodu yazan ekibin kendisi"],
    },
    {
      label: "Fiyat",
      values: ["Düşük", "Yüksek + ajans payı", "Şeffaf, kapsama göre sabit"],
    },
    {
      label: "Süreklilik",
      values: ["Kaybolabilir", "Ekip değişir", "Bakım aboneliğiyle kalıcı"],
    },
    {
      label: "Teknoloji",
      values: ["Alışkanlığa göre", "Kurumsal ve ağır", "Projeye göre seçilir"],
    },
    {
      label: "Kod sahipliği",
      values: ["Belirsiz", "Ajansta kalabilir", "Tamamen sizin"],
    },
    {
      label: "Teslim sonrası",
      values: ["Genelde biter", "Ek sözleşme", "Bakım + geliştirme planı"],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Rakamlar                                                            */
/* ------------------------------------------------------------------ */

export const stats = [
  { value: 24, suffix: "+", label: "Teslim edilen proje" },
  { value: 6, suffix: "", label: "Canlı yayında ürün" },
  { value: 99.9, suffix: "%", label: "Ortalama uptime" },
  { value: 3, suffix: " hafta", label: "Ortalama teslim süresi" },
] as const;

/* ------------------------------------------------------------------ */
/* Paketler                                                            */
/* ------------------------------------------------------------------ */

/**
 * Paket kademeleri, karşılaştırma tabloları, ek modüller ve fiyat
 * hesaplayıcının soruları `src/lib/pricing.ts` içinde — 15 hizmetin tamamı için.
 * Burada yalnızca tüm sayfalarda tekrar eden fiyat notu duruyor.
 */
export const pricingNote =
  "Fiyatlar başlangıç fiyatıdır ve KDV hariçtir. Net teklif, ücretsiz keşif görüşmesinden sonra paylaşılır. Ödeme planı: %50 başlangıç, %50 teslim.";

/* ------------------------------------------------------------------ */
/* Teklif sihirbazı                                                    */
/* ------------------------------------------------------------------ */

export const wizardSteps = [
  {
    id: "tip",
    question: "Ne yaptırmak istiyorsun?",
    options: [
      { value: "web", label: "Web sitesi", hint: "Kurumsal / marka sitesi" },
      { value: "eticaret", label: "E-ticaret", hint: "Online satış" },
      { value: "mobil", label: "Mobil uygulama", hint: "iOS / Android" },
      { value: "panel", label: "Web uygulaması", hint: "Panel / portal" },
      { value: "ozel", label: "Özel yazılım", hint: "Otomasyon / entegrasyon" },
      { value: "bilmiyorum", label: "Emin değilim", hint: "Birlikte netleşsin" },
    ],
  },
  {
    id: "kapsam",
    question: "Kapsam yaklaşık ne kadar?",
    options: [
      { value: "kucuk", label: "Küçük", hint: "1–5 sayfa / ekran" },
      { value: "orta", label: "Orta", hint: "6–15 sayfa / ekran" },
      { value: "buyuk", label: "Büyük", hint: "15+ sayfa / ekran" },
    ],
  },
  {
    id: "butce",
    question: "Bütçe aralığın?",
    options: [
      { value: "a", label: "₺15.000 altı" },
      { value: "b", label: "₺15.000 – ₺50.000" },
      { value: "c", label: "₺50.000 – ₺100.000" },
      { value: "d", label: "₺100.000+" },
      { value: "e", label: "Henüz netleşmedi" },
    ],
  },
  {
    id: "zaman",
    question: "Ne zaman yayında olmalı?",
    options: [
      { value: "acil", label: "2 hafta içinde" },
      { value: "normal", label: "1–2 ay" },
      { value: "esnek", label: "Esnek" },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* Yorumlar                                                            */
/* ------------------------------------------------------------------ */

export const testimonials = [
  {
    quote:
      "İlk görüşmede ne istediğimizi bizden iyi özetlediler. Site yayına gireli üç ay oldu, gelen taleplerin çoğu artık buradan.",
    author: "Yönetici",
    role: "Merada Gayrimenkul",
    project: "merada-gayrimenkul",
  },
  {
    quote:
      "Aidat takibini Excel'den panele taşımak sandığımızdan kolay oldu. Sakinler artık bizi aramadan her şeyi görüyor.",
    author: "Site yöneticisi",
    role: "Merada Yönetim",
    project: "merada-yonetim",
  },
  {
    quote:
      "Ürünlerimizi anlatmakta zorlanıyorduk. Şimdi siteyi açan kişi teknik detayı sormadan anlıyor.",
    author: "Satış müdürü",
    role: "Elit Profil",
    project: "elit-profil",
  },
] as const;

/* ------------------------------------------------------------------ */
/* SSS                                                                 */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    q: "Fiyat neye göre belirleniyor?",
    a: "Sayfa/ekran sayısı, özel geliştirme gerektiren özellikler, entegrasyonlar ve teslim süresi. Keşif görüşmesinden sonra sabit fiyatlı net teklif veriyoruz; süreç içinde kapsam değişmedikçe fiyat değişmiyor.",
  },
  {
    q: "Ödeme nasıl işliyor?",
    a: "Projeye %50 ön ödeme ile başlıyoruz, kalan %50 teslimde alınıyor. Büyük projelerde sprint bazlı ödeme planı yapabiliyoruz.",
  },
  {
    q: "Süreci nasıl takip ederim?",
    a: "Her aşamada canlı önizleme linki paylaşıyoruz. Tasarım onayları ve revizyonlar bu link üzerinden hızlıca ilerliyor; haftalık ilerleme özeti gönderiyoruz.",
  },
  {
    q: "Kod ve tasarım kime ait?",
    a: "Tamamen size. Teslimde kaynak kodu, tasarım dosyaları ve tüm hesapların erişimi devredilir. Bize bağlı kalmak zorunda değilsiniz.",
  },
  {
    q: "Teslimden sonra ne oluyor?",
    a: "Pakete göre 1–6 ay destek dahil. Sonrasında isterseniz aylık bakım aboneliğiyle güncelleme, yedekleme, izleme ve geliştirme desteği veriyoruz.",
  },
  {
    q: "Mevcut sitemi/uygulamamı devralır mısınız?",
    a: "Evet. Önce teknik denetim yapıp devralmanın mı yoksa yeniden yazmanın mı daha ucuz olduğunu açıkça söylüyoruz.",
  },
  {
    q: "Ne kadar sürede teslim ediyorsunuz?",
    a: "Tek sayfalık site ≈ 1 hafta, kurumsal site 2–3 hafta, mobil uygulama 4–10 hafta, kapsamlı panel 6–12 hafta. Keşifte net tarih veriyoruz.",
  },
  {
    q: "Uzaktan çalışıyor musunuz?",
    a: "Evet, Türkiye'nin her yerinden müşteriyle çalışıyoruz. Görüşmeler online, gerektiğinde yerinde toplantı yapıyoruz.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Blog (şimdilik statik taslak)                                       */
/* ------------------------------------------------------------------ */

export const posts = [
  {
    slug: "kurumsal-site-maliyeti",
    title: "Kurumsal bir web sitesi gerçekte ne kadara mal olur?",
    excerpt:
      "Ajans teklifleri neden 10 kat fark ediyor? Fiyatı belirleyen kalemleri tek tek açıyoruz.",
    date: "2026-06-18",
    readingTime: "6 dk",
    category: "Fiyatlandırma",
  },
  {
    slug: "hazir-tema-mi-ozel-yazilim-mi",
    title: "Hazır tema mı, özel geliştirme mi?",
    excerpt:
      "İkisinin de doğru olduğu senaryolar var. Hangisinin size uyduğunu 6 soruyla belirleyin.",
    date: "2026-05-30",
    readingTime: "5 dk",
    category: "Karar rehberi",
  },
  {
    slug: "site-hizi-satisi-nasil-etkiler",
    title: "Site hızı satışı gerçekten etkiliyor mu?",
    excerpt:
      "Core Web Vitals metriklerini ve kendi projelerimizde ölçtüğümüz sonuçları paylaşıyoruz.",
    date: "2026-05-12",
    readingTime: "8 dk",
    category: "Performans",
  },
] as const;
