/**
 * Fiyatlandırma verisi — 15 hizmetin tamamı için.
 *
 * Her hizmet için:
 *  - tiers   : 3 kademe (başlangıç fiyatları, alt sınır)
 *  - matrix  : kademeleri yan yana koyan karşılaştırma satırları (özellik adı + açıklaması)
 *  - questions: fiyat hesaplayıcıda o hizmete özel sorular (çarpanlı)
 *  - addOns  : hesaplayıcıda seçilebilen ek modüller
 *
 * Fiyatlar KDV hariç, TL ve "başlayan fiyat"tır; hesaplayıcı bunları çarpanlarla
 * bir aralığa çevirir. Tek gerçek kaynak burasıdır — sayfalar buradan beslenir.
 */

import { serviceGroups, services, type ServiceGroupId } from "@/lib/data";

export type PriceUnit = "proje" | "ay";

export type PricingTier = {
  slug: string;
  name: string;
  /** Başlangıç fiyatı (TL, KDV hariç). */
  price: number;
  tagline: string;
  features: string[];
  delivery: string;
  popular?: boolean;
};

export type PricingChoice = {
  value: string;
  label: string;
  hint?: string;
  /** Tahmini fiyata uygulanan çarpan. */
  multiplier: number;
};

export type PricingQuestion = {
  id: string;
  question: string;
  hint?: string;
  choices: PricingChoice[];
};

export type PricingAddOn = {
  slug: string;
  name: string;
  price: number;
};

/** Karşılaştırma tablosunun bir satırı: özellik adı + ne demek olduğu. */
export type MatrixRow = {
  label: string;
  meaning: string;
  values: [string, string, string];
};

export type ServicePricing = {
  service: string; // hizmet slug'ı
  unit: PriceUnit;
  /** Fiyatın kapsamına dair uyarı (ör. reklam bütçesi hariç). */
  note?: string;
  tiers: [PricingTier, PricingTier, PricingTier];
  matrix: MatrixRow[];
  questions: [PricingQuestion, PricingQuestion];
  addOns: PricingAddOn[];
};

/* ------------------------------------------------------------------ */
/* Hizmet bazlı fiyatlandırma                                          */
/* ------------------------------------------------------------------ */

const allServicePricing: ServicePricing[] = [
  /* --- 01 Web sitesi ------------------------------------------------ */
  {
    service: "web-sitesi",
    unit: "proje",
    tiers: [
      {
        slug: "web-sitesi-baslangic",
        name: "Başlangıç",
        price: 14900,
        tagline: "Tek sayfalık premium vitrin — hızlı ve etkili giriş.",
        features: [
          "Tek sayfa özel tasarım (şablon değil)",
          "Mobil uyum ve hız optimizasyonu",
          "Temel SEO kurulumu",
          "İletişim formu + WhatsApp hattı",
          "Alan adı, SSL ve yayına alma",
          "2 revizyon turu",
        ],
        delivery: "≈ 1 hafta",
      },
      {
        slug: "web-sitesi-kurumsal",
        name: "Kurumsal",
        price: 29900,
        popular: true,
        tagline: "Markanı tam anlatan, animasyonlu kurumsal site.",
        features: [
          "6 sayfaya kadar özel tasarım",
          "Mikro animasyon ve scroll deneyimi",
          "Gelişmiş SEO + Google Analytics",
          "Google İşletme ve harita kaydı",
          "Blog / içerik altyapısı",
          "3 revizyon turu",
        ],
        delivery: "≈ 2–3 hafta",
      },
      {
        slug: "web-sitesi-prestij",
        name: "Prestij",
        price: 59900,
        tagline: "Ödül seviyesinde deneyim — tam anlatı, tam performans.",
        features: [
          "Sınırsız sayfa + özel sanat yönetimi",
          "Scroll storytelling ve ileri animasyon",
          "Çok dilli altyapı",
          "Core Web Vitals optimizasyonu",
          "İçerik yönetim paneli (CMS)",
          "Öncelikli destek hattı",
        ],
        delivery: "≈ 4–6 hafta",
      },
    ],
    matrix: [
      {
        label: "Sayfa sayısı",
        meaning: "Özel tasarlanan benzersiz sayfa adedi",
        values: ["1 sayfa", "6 sayfaya kadar", "Sınırsız"],
      },
      {
        label: "Tasarım yönü",
        meaning: "Görsel dilin ne kadar sıfırdan kurgulandığı",
        values: [
          "Hazır düzen + marka renkleri",
          "Markaya özel tasarım",
          "Award-level sanat yönetimi",
        ],
      },
      {
        label: "Animasyon",
        meaning: "Sayfadaki hareket ve geçişlerin derinliği",
        values: ["Temel geçişler", "Mikro animasyon", "Scroll storytelling"],
      },
      {
        label: "SEO kurulumu",
        meaning: "Arama motorları için yapılan teknik hazırlık",
        values: ["Temel (meta + sitemap)", "Gelişmiş + Analytics", "Gelişmiş + hız + şema"],
      },
      {
        label: "İçerik yönetimi (CMS)",
        meaning: "İçeriği bize sormadan kendin güncelleyebilme",
        values: ["—", "Opsiyonel (+₺9.900)", "Dahil"],
      },
      {
        label: "Çok dil",
        meaning: "Sitenin birden fazla dilde yayınlanması",
        values: ["—", "Opsiyonel (+₺7.900)", "Dahil"],
      },
      {
        label: "Revizyon",
        meaning: "Tasarım üzerinde ücretsiz düzeltme turu",
        values: ["2 tur", "3 tur", "Kapsam içi sınırsız"],
      },
      {
        label: "Yayın sonrası destek",
        meaning: "Teslimden sonra ücretsiz destek süresi",
        values: ["1 ay", "3 ay", "6 ay öncelikli"],
      },
    ],
    questions: [
      {
        id: "sayfa",
        question: "Kaç sayfa olacak?",
        hint: "Anasayfa, hakkımızda, hizmetler… her biri bir sayfa.",
        choices: [
          { value: "1-3", label: "1–3 sayfa", multiplier: 0.9 },
          { value: "4-8", label: "4–8 sayfa", multiplier: 1 },
          { value: "9+", label: "9 ve üzeri", multiplier: 1.3 },
        ],
      },
      {
        id: "icerik",
        question: "Metin ve görseller hazır mı?",
        choices: [
          { value: "hazir", label: "Hazır", hint: "Bize teslim edeceğiz", multiplier: 1 },
          { value: "kismen", label: "Kısmen hazır", hint: "Düzenleme gerekiyor", multiplier: 1.08 },
          { value: "yok", label: "Yok", hint: "İçeriği siz üretin", multiplier: 1.22 },
        ],
      },
    ],
    addOns: [
      { slug: "cok-dil", name: "Çok dilli altyapı", price: 7900 },
      { slug: "blog", name: "Blog / haber modülü", price: 4900 },
      { slug: "cms", name: "İçerik yönetim paneli (CMS)", price: 9900 },
      { slug: "icerik-girisi", name: "İçerik girişi (10 sayfaya kadar)", price: 3900 },
      { slug: "marka", name: "Logo ve marka kimliği", price: 8900 },
    ],
  },

  /* --- 02 Web uygulaması -------------------------------------------- */
  {
    service: "web-uygulamasi",
    unit: "proje",
    tiers: [
      {
        slug: "web-uygulamasi-panel",
        name: "Panel",
        price: 69900,
        tagline: "Tek ekibin kullandığı yönetim paneli.",
        features: [
          "5 ana ekrana kadar arayüz",
          "Kullanıcı girişi ve 2 rol",
          "Veri modeli ve veritabanı kurulumu",
          "Temel raporlama ekranı",
          "Bulut kurulumu ve günlük yedekleme",
          "1 ay yayın sonrası destek",
        ],
        delivery: "≈ 6 hafta",
      },
      {
        slug: "web-uygulamasi-platform",
        name: "Platform",
        price: 119900,
        popular: true,
        tagline: "Çok rollü, dışarıya da açılan iş platformu.",
        features: [
          "Sınırsız ekran + tasarım sistemi",
          "Rol bazlı yetkilendirme (5+ rol)",
          "Müşteri / bayi portalı",
          "Gelişmiş raporlama ve Excel dışa aktarma",
          "Bildirim ve e-posta akışları",
          "3 ay yayın sonrası destek",
        ],
        delivery: "≈ 8–12 hafta",
      },
      {
        slug: "web-uygulamasi-kurumsal",
        name: "Kurumsal",
        price: 199900,
        tagline: "Yük altında çalışan, entegre ve denetlenebilir sistem.",
        features: [
          "Çoklu şube / çok kiracı yapısı",
          "SSO ve denetim kaydı (audit log)",
          "ERP / CRM entegrasyonları",
          "Yük testi ve ölçekleme mimarisi",
          "İzleme, uyarı ve SLA",
          "6 ay öncelikli destek",
        ],
        delivery: "≈ 12–16 hafta",
      },
    ],
    matrix: [
      {
        label: "Ekran sayısı",
        meaning: "Özel tasarlanan panel ekranı adedi",
        values: ["5 ekrana kadar", "Sınırsız", "Sınırsız + modüler"],
      },
      {
        label: "Kullanıcı rolleri",
        meaning: "Farklı yetki seviyesi tanımlayabilme",
        values: ["2 rol", "5+ rol", "Sınırsız + SSO"],
      },
      {
        label: "Raporlama",
        meaning: "Veriyi ekranda görme ve dışa aktarma",
        values: ["Liste + filtre", "Grafik + Excel", "Özel rapor tasarımı"],
      },
      {
        label: "Entegrasyon",
        meaning: "Dış sistemlere (ERP, CRM, muhasebe) bağlanma",
        values: ["—", "2 entegrasyona kadar", "Sınırsız"],
      },
      {
        label: "Denetim kaydı",
        meaning: "Kimin neyi ne zaman değiştirdiğinin kaydı",
        values: ["—", "Temel log", "Tam audit log"],
      },
      {
        label: "Yedekleme ve izleme",
        meaning: "Veri güvenliği ve kesinti takibi",
        values: ["Günlük yedek", "Yedek + uptime izleme", "Yedek + izleme + SLA"],
      },
      {
        label: "Yayın sonrası destek",
        meaning: "Teslimden sonra ücretsiz destek süresi",
        values: ["1 ay", "3 ay", "6 ay öncelikli"],
      },
    ],
    questions: [
      {
        id: "kullanici",
        question: "Sistemi kaç kişi kullanacak?",
        choices: [
          { value: "kucuk", label: "1–10 kişi", multiplier: 0.95 },
          { value: "orta", label: "11–50 kişi", multiplier: 1.1 },
          { value: "buyuk", label: "50+ kişi", multiplier: 1.3 },
        ],
      },
      {
        id: "entegrasyon",
        question: "Başka sistemlere bağlanacak mı?",
        hint: "Muhasebe, ERP, e-fatura, kargo…",
        choices: [
          { value: "yok", label: "Hayır", hint: "Tek başına çalışacak", multiplier: 1 },
          { value: "az", label: "1–2 entegrasyon", multiplier: 1.15 },
          { value: "cok", label: "3+ entegrasyon", multiplier: 1.35 },
        ],
      },
    ],
    addOns: [
      { slug: "mobil-surum", name: "Mobil uygulama sürümü", price: 39900 },
      { slug: "rapor", name: "Gelişmiş rapor modülü", price: 12900 },
      { slug: "dokuman", name: "Doküman / e-imza akışı", price: 14900 },
      { slug: "cok-dil", name: "Çok dilli arayüz", price: 9900 },
    ],
  },

  /* --- 03 Mobil uygulama -------------------------------------------- */
  {
    service: "mobil-uygulama",
    unit: "proje",
    tiers: [
      {
        slug: "mobil-mvp",
        name: "MVP",
        price: 49900,
        tagline: "Fikrini en hızlı yoldan mağazaya taşı.",
        features: [
          "Tek platform (iOS veya Android)",
          "6 ekrana kadar özel arayüz",
          "Üyelik ve push bildirim",
          "Temel backend altyapısı",
          "Mağaza yayın süreci",
          "1 ay ücretsiz bakım",
        ],
        delivery: "≈ 4 hafta",
      },
      {
        slug: "mobil-cross",
        name: "Cross-platform",
        price: 89900,
        popular: true,
        tagline: "iOS + Android tek kod tabanında, panel dahil.",
        features: [
          "iOS + Android (React Native)",
          "Sınırsız ekran ve tasarım sistemi",
          "Yönetim paneli dahil",
          "Ödeme altyapısı entegrasyonu",
          "Analitik ve çökme raporlama",
          "3 ay ücretsiz bakım",
        ],
        delivery: "≈ 6–10 hafta",
      },
      {
        slug: "mobil-ortaklik",
        name: "Ürün ortaklığı",
        price: 149900,
        tagline: "Uzun soluklu ürün geliştirme — sprint bazlı çalışma.",
        features: [
          "Aylık sprint planlaması",
          "Sürekli geliştirme ve iterasyon",
          "A/B test ve büyüme desteği",
          "Öncelikli SLA'li destek",
          "Teknik danışmanlık",
          "Kod tabanı tamamen sizin",
        ],
        delivery: "İlk sürüm ≈ 10 hafta",
      },
    ],
    matrix: [
      {
        label: "Platform",
        meaning: "Uygulamanın yayınlanacağı mağazalar",
        values: ["Tek platform", "iOS + Android", "iOS + Android + web"],
      },
      {
        label: "Ekran sayısı",
        meaning: "Özel tasarlanan uygulama ekranı",
        values: ["6 ekrana kadar", "Sınırsız", "Sınırsız + modüler"],
      },
      {
        label: "Yönetim paneli",
        meaning: "İçeriği ve kullanıcıları yönettiğiniz web ekranı",
        values: ["—", "Dahil", "Dahil + rol yönetimi"],
      },
      {
        label: "Ödeme / abonelik",
        meaning: "Uygulama içi satış altyapısı",
        values: ["—", "Tek seferlik ödeme", "Ödeme + abonelik"],
      },
      {
        label: "Push bildirim",
        meaning: "Kullanıcıya bildirim gönderme",
        values: ["Temel", "Segmentli", "Otomasyonlu kampanya"],
      },
      {
        label: "Mağaza yayını",
        meaning: "App Store ve Google Play süreçlerinin yürütülmesi",
        values: ["Tek mağaza", "İki mağaza", "İki mağaza + sürüm yönetimi"],
      },
      {
        label: "Bakım",
        meaning: "Yayın sonrası ücretsiz bakım süresi",
        values: ["1 ay", "3 ay", "Sürekli (sprint)"],
      },
    ],
    questions: [
      {
        id: "platform",
        question: "Hangi platformlarda olacak?",
        choices: [
          { value: "tek", label: "Tek platform", hint: "iOS veya Android", multiplier: 0.9 },
          { value: "ikisi", label: "iOS + Android", multiplier: 1 },
          { value: "web", label: "iOS + Android + web", multiplier: 1.25 },
        ],
      },
      {
        id: "hesap",
        question: "Kullanıcı hesabı olacak mı?",
        choices: [
          { value: "yok", label: "Giriş yok", hint: "Herkes aynı içeriği görür", multiplier: 0.9 },
          { value: "uyelik", label: "Üyelik var", multiplier: 1 },
          { value: "odeme", label: "Üyelik + ödeme", hint: "Abonelik veya satın alma", multiplier: 1.2 },
        ],
      },
    ],
    addOns: [
      { slug: "odeme", name: "Uygulama içi ödeme", price: 14900 },
      { slug: "harita", name: "Harita ve konum takibi", price: 12900 },
      { slug: "sohbet", name: "Canlı sohbet / destek", price: 9900 },
      { slug: "magaza-gorsel", name: "Mağaza görselleri ve tanıtım videosu", price: 6900 },
    ],
  },

  /* --- 04 E-ticaret -------------------------------------------------- */
  {
    service: "e-ticaret",
    unit: "proje",
    tiers: [
      {
        slug: "eticaret-vitrin",
        name: "Vitrin",
        price: 39900,
        tagline: "Ürünü göster, siparişi almaya başla.",
        features: [
          "50 ürüne kadar katalog",
          "Sepet ve sipariş akışı",
          "Tek ödeme entegrasyonu (iyzico / PayTR)",
          "Kargo takip bağlantısı",
          "Temel SEO ve ürün şeması",
          "1 ay destek",
        ],
        delivery: "≈ 3 hafta",
      },
      {
        slug: "eticaret-magaza",
        name: "Mağaza",
        price: 69900,
        popular: true,
        tagline: "Stok, kampanya ve kargo otomatik dönsün.",
        features: [
          "Sınırsız ürün + varyant yapısı",
          "Stok ve fiyat yönetimi",
          "Kupon, kampanya ve sepet kuralları",
          "Kargo ve e-fatura entegrasyonu",
          "GA4 + Meta Pixel dönüşüm ölçümü",
          "3 ay destek",
        ],
        delivery: "≈ 4–6 hafta",
      },
      {
        slug: "eticaret-olcek",
        name: "Ölçek",
        price: 119900,
        tagline: "Pazaryeri, B2B ve çok kanallı satış.",
        features: [
          "Pazaryeri entegrasyonları (Trendyol, Hepsiburada)",
          "B2B / bayi fiyat listeleri",
          "Gelişmiş arama ve filtreleme",
          "Sadakat ve terk edilmiş sepet akışları",
          "Çok dilli / çok para birimli yapı",
          "6 ay öncelikli destek",
        ],
        delivery: "≈ 8–12 hafta",
      },
    ],
    matrix: [
      {
        label: "Ürün sayısı",
        meaning: "Katalogda yönetebileceğiniz ürün adedi",
        values: ["50 ürüne kadar", "Sınırsız", "Sınırsız + çok kanal"],
      },
      {
        label: "Varyant yönetimi",
        meaning: "Beden, renk gibi seçeneklerin stok takibi",
        values: ["Temel", "Tam varyant + stok", "Tam varyant + çok depo"],
      },
      {
        label: "Ödeme",
        meaning: "Müşterinin ödeyebileceği yöntemler",
        values: ["Tek sağlayıcı", "Çoklu + taksit", "Çoklu + B2B vadeli"],
      },
      {
        label: "Kargo ve fatura",
        meaning: "Sipariş sonrası otomasyon",
        values: ["Manuel takip", "Otomatik entegrasyon", "Çok depo + entegrasyon"],
      },
      {
        label: "Kampanya araçları",
        meaning: "İndirim, kupon ve sepet kuralları",
        values: ["—", "Kupon + kampanya", "Kupon + sadakat + segment"],
      },
      {
        label: "Pazaryeri entegrasyonu",
        meaning: "Trendyol, Hepsiburada vb. ile stok/sipariş bağlantısı",
        values: ["—", "Opsiyonel (+₺14.900)", "Dahil"],
      },
      {
        label: "Dönüşüm ölçümü",
        meaning: "Satışın hangi kanaldan geldiğini görme",
        values: ["Temel GA4", "GA4 + Meta Pixel", "GA4 + Pixel + gelir raporu"],
      },
    ],
    questions: [
      {
        id: "urun",
        question: "Kaç ürün satacaksın?",
        choices: [
          { value: "az", label: "1–50 ürün", multiplier: 0.9 },
          { value: "orta", label: "50–500 ürün", multiplier: 1 },
          { value: "cok", label: "500+ ürün", multiplier: 1.25 },
        ],
      },
      {
        id: "kanal",
        question: "Nerede satacaksın?",
        choices: [
          { value: "site", label: "Sadece kendi sitem", multiplier: 1 },
          { value: "pazaryeri", label: "Site + pazaryeri", multiplier: 1.2 },
          { value: "b2b", label: "Site + pazaryeri + B2B", multiplier: 1.4 },
        ],
      },
    ],
    addOns: [
      { slug: "pazaryeri", name: "Pazaryeri entegrasyonu", price: 14900 },
      { slug: "efatura", name: "E-fatura / muhasebe entegrasyonu", price: 9900 },
      { slug: "cekim", name: "Ürün fotoğraf çekimi (20 ürün)", price: 7900 },
      { slug: "abonelik", name: "Abonelik satışı modülü", price: 12900 },
    ],
  },

  /* --- 05 Kişiye özel yazılım ---------------------------------------- */
  {
    service: "ozel-yazilim",
    unit: "proje",
    tiers: [
      {
        slug: "ozel-mvp",
        name: "Keşif + MVP",
        price: 24900,
        tagline: "Tek bir süreci yazılıma taşı, hızlı sonuç al.",
        features: [
          "Süreç analizi ve keşif çalışması",
          "Tek modüllük uygulama",
          "Temel kullanıcı yönetimi",
          "Sunucu kurulumu ve devir",
          "Kullanım eğitimi (1 oturum)",
        ],
        delivery: "≈ 2–4 hafta",
      },
      {
        slug: "ozel-moduler",
        name: "Modüler sistem",
        price: 59900,
        popular: true,
        tagline: "Birden çok süreci tek yerde toplayan iç yazılım.",
        features: [
          "3–5 modül (teklif, stok, servis vb.)",
          "Rol bazlı yetkilendirme",
          "Mevcut sistemlerle entegrasyon",
          "Raporlama ve dışa aktarma",
          "Eğitim + kullanım dokümanı",
          "3 ay destek",
        ],
        delivery: "≈ 6–10 hafta",
      },
      {
        slug: "ozel-kurumsal",
        name: "Kurumsal sistem",
        price: 119900,
        tagline: "Şirketin omurgasını taşıyan, ölçeklenebilir yapı.",
        features: [
          "Sınırsız modül ve şube",
          "ERP / muhasebe entegrasyonları",
          "Yetki matrisi ve denetim kaydı",
          "Yük testi ve felaket kurtarma planı",
          "6 ay öncelikli destek + SLA",
        ],
        delivery: "≈ 12+ hafta",
      },
    ],
    matrix: [
      {
        label: "Modül sayısı",
        meaning: "Ayrı ayrı çalışan iş bölümü adedi",
        values: ["1 modül", "3–5 modül", "Sınırsız"],
      },
      {
        label: "Süreç analizi",
        meaning: "İşin sahada nasıl döndüğünün incelenmesi",
        values: ["1 günlük keşif", "Detaylı süreç haritası", "Süreç haritası + iyileştirme"],
      },
      {
        label: "Yetkilendirme",
        meaning: "Kimin neyi görüp değiştirebileceği",
        values: ["Tek rol", "Rol bazlı", "Yetki matrisi + audit"],
      },
      {
        label: "Entegrasyon",
        meaning: "Hâlihazırda kullandığınız yazılımlara bağlanma",
        values: ["—", "2 entegrasyona kadar", "Sınırsız"],
      },
      {
        label: "Kurulum",
        meaning: "Yazılımın çalışacağı ortam",
        values: ["Bulut", "Bulut veya kendi sunucunuz", "Özel yedekli mimari"],
      },
      {
        label: "Eğitim ve devir",
        meaning: "Ekibin kullanmayı öğrenmesi",
        values: ["1 oturum", "Eğitim + doküman", "Eğitim + doküman + video"],
      },
      {
        label: "Destek",
        meaning: "Teslim sonrası ücretsiz destek süresi",
        values: ["1 ay", "3 ay", "6 ay + SLA"],
      },
    ],
    questions: [
      {
        id: "surec",
        question: "Kaç süreci yazılıma taşıyacağız?",
        hint: "Teklif hazırlama, stok takibi, servis kaydı…",
        choices: [
          { value: "tek", label: "Tek süreç", multiplier: 0.9 },
          { value: "birkac", label: "2–4 süreç", multiplier: 1.1 },
          { value: "tum", label: "Tüm operasyon", multiplier: 1.4 },
        ],
      },
      {
        id: "kullanici",
        question: "Kaç kişi kullanacak?",
        choices: [
          { value: "kucuk", label: "1–10 kişi", multiplier: 0.95 },
          { value: "orta", label: "11–50 kişi", multiplier: 1.1 },
          { value: "buyuk", label: "50+ kişi", multiplier: 1.3 },
        ],
      },
    ],
    addOns: [
      { slug: "pwa", name: "Mobil erişim (PWA)", price: 14900 },
      { slug: "veri-aktarim", name: "Eski sistemden veri aktarımı", price: 9900 },
      { slug: "entegrasyon", name: "Ek entegrasyon", price: 12900 },
      { slug: "egitim", name: "Yerinde eğitim günü", price: 6900 },
    ],
  },

  /* --- 06 Yapay zekâ -------------------------------------------------- */
  {
    service: "yapay-zeka",
    unit: "proje",
    note: "Model kullanım (token) maliyeti fiyata dahil değildir; aylık tahmini tablo halinde paylaşılır.",
    tiers: [
      {
        slug: "ai-pilot",
        name: "Pilot",
        price: 34900,
        tagline: "Tek senaryoda işe yaradığını kanıtla.",
        features: [
          "Tek kullanım senaryosu",
          "Kendi verinizle asistan (RAG)",
          "Doğruluk ölçümü ve rapor",
          "Maliyet tahmin tablosu",
          "Basit web arayüzü",
        ],
        delivery: "≈ 3 hafta",
      },
      {
        slug: "ai-asistan",
        name: "Asistan",
        price: 74900,
        popular: true,
        tagline: "Ekibin günlük işine gömülü yapay zekâ.",
        features: [
          "Çoklu veri kaynağı bağlantısı",
          "Site / panel içine gömülü asistan",
          "Yönetim ve izleme ekranı",
          "Kullanım limiti ve maliyet kontrolü",
          "3 ay iyileştirme desteği",
        ],
        delivery: "≈ 5–8 hafta",
      },
      {
        slug: "ai-kurumsal",
        name: "Kurumsal AI",
        price: 139900,
        tagline: "Süreçlere bağlanan, denetlenebilir AI altyapısı.",
        features: [
          "Belge işleme ve veri çıkarma hattı",
          "Rol bazlı erişim ve gizlilik planı",
          "İnsan onaylı iş akışları",
          "Değerlendirme (eval) altyapısı",
          "6 ay öncelikli destek",
        ],
        delivery: "≈ 8–14 hafta",
      },
    ],
    matrix: [
      {
        label: "Kullanım senaryosu",
        meaning: "Yapay zekânın çözeceği iş sayısı",
        values: ["1 senaryo", "3 senaryoya kadar", "Sınırsız"],
      },
      {
        label: "Veri kaynağı",
        meaning: "Asistanın beslendiği belge ve sistemler",
        values: ["Tek kaynak (dosyalar)", "Çoklu kaynak + site", "Sistem entegrasyonlu"],
      },
      {
        label: "Arayüz",
        meaning: "Kullanıcının yapay zekâyla buluştuğu yer",
        values: ["Basit web arayüzü", "Sitenize/panelinize gömülü", "Çok kanallı (web, WhatsApp)"],
      },
      {
        label: "Doğruluk ölçümü",
        meaning: "Cevapların ne kadar güvenilir olduğunun testi",
        values: ["Tek seferlik rapor", "Düzenli ölçüm", "Otomatik eval + regresyon"],
      },
      {
        label: "Gizlilik",
        meaning: "Verinin nerede ve nasıl işlendiği",
        values: ["Standart", "KVKK uyumlu kurgu", "İzole / özel kurulum"],
      },
      {
        label: "Maliyet kontrolü",
        meaning: "Model kullanım giderinin sınırlandırılması",
        values: ["Tahmin tablosu", "Limit + uyarı", "Kota + kullanıcı bazlı rapor"],
      },
      {
        label: "Destek",
        meaning: "Teslim sonrası ücretsiz iyileştirme süresi",
        values: ["1 ay", "3 ay", "6 ay öncelikli"],
      },
    ],
    questions: [
      {
        id: "veri",
        question: "Yapay zekâ neyi bilecek?",
        choices: [
          { value: "belge", label: "Hazır belgeler", hint: "PDF, Word, Excel", multiplier: 1 },
          { value: "site", label: "Site + belgeler", multiplier: 1.15 },
          { value: "sistem", label: "Kendi sistemlerimizdeki veri", multiplier: 1.35 },
        ],
      },
      {
        id: "hacim",
        question: "Aylık kaç işlem bekleniyor?",
        hint: "Soru, belge veya sınıflandırma adedi.",
        choices: [
          { value: "az", label: "1.000'e kadar", multiplier: 0.95 },
          { value: "orta", label: "1.000–10.000", multiplier: 1.1 },
          { value: "cok", label: "10.000+", multiplier: 1.3 },
        ],
      },
    ],
    addOns: [
      { slug: "whatsapp", name: "WhatsApp / Telegram kanalı", price: 12900 },
      { slug: "sesli", name: "Sesli asistan", price: 16900 },
      { slug: "ocr", name: "Belge işleme hattı (OCR)", price: 19900 },
      { slug: "ek-dil", name: "Ek dil desteği", price: 9900 },
    ],
  },

  /* --- 07 SaaS -------------------------------------------------------- */
  {
    service: "saas",
    unit: "proje",
    tiers: [
      {
        slug: "saas-cekirdek",
        name: "Çekirdek",
        price: 79900,
        tagline: "İlk müşterine satış yapabileceğin altyapı.",
        features: [
          "Çok kiracılı veri mimarisi",
          "Abonelik ve ödeme (Stripe / iyzico)",
          "Kayıt, deneme ve onboarding akışı",
          "Temel yönetim paneli",
          "1 ay destek",
        ],
        delivery: "≈ 8 hafta",
      },
      {
        slug: "saas-urun",
        name: "Ürün",
        price: 139900,
        popular: true,
        tagline: "Planlar, limitler ve büyüme araçları dahil.",
        features: [
          "Çoklu plan ve kullanım limitleri",
          "Takım / davet yapısı",
          "Faturalama, iade ve kupon akışları",
          "Ürün içi analitik",
          "3 ay destek",
        ],
        delivery: "≈ 10–14 hafta",
      },
      {
        slug: "saas-olcek",
        name: "Ölçek",
        price: 229900,
        tagline: "Kurumsal müşteriye satılabilir olgunluk.",
        features: [
          "SSO ve kurumsal güvenlik",
          "Bölgesel ölçekleme ve yedeklilik",
          "Denetim kaydı ve veri ihracı",
          "Durum sayfası ve SLA",
          "6 ay öncelikli destek",
        ],
        delivery: "≈ 14–20 hafta",
      },
    ],
    matrix: [
      {
        label: "Kiracı yapısı",
        meaning: "Müşterilerin verisinin birbirinden ayrılma şekli",
        values: ["Ortak veritabanı", "Şema bazlı ayrım", "İzole / bölgesel"],
      },
      {
        label: "Abonelik planı",
        meaning: "Satabileceğiniz farklı paket sayısı",
        values: ["Tek plan", "Çoklu plan + limit", "Özel kurumsal fiyat"],
      },
      {
        label: "Faturalama",
        meaning: "Tahsilat, iade ve fatura süreci",
        values: ["Kart ile tahsilat", "Fatura + iade + kupon", "Sözleşmeli / havale"],
      },
      {
        label: "Takım yönetimi",
        meaning: "Aynı hesapta birden çok kullanıcı",
        values: ["—", "Davet + roller", "SSO + rol matrisi"],
      },
      {
        label: "Ürün analitiği",
        meaning: "Kullanıcının üründe ne yaptığının ölçülmesi",
        values: ["Temel", "Huni + kohort", "Özel rapor + veri ihracı"],
      },
      {
        label: "Güvenlik",
        meaning: "Hesap ve veri güvenliği seviyesi",
        values: ["Standart", "2FA + log", "SSO + audit + sızma testi"],
      },
      {
        label: "Destek",
        meaning: "Teslim sonrası ücretsiz destek süresi",
        values: ["1 ay", "3 ay", "6 ay + SLA"],
      },
    ],
    questions: [
      {
        id: "plan",
        question: "Kaç farklı plan satacaksın?",
        choices: [
          { value: "tek", label: "Tek plan", multiplier: 0.9 },
          { value: "birkac", label: "2–3 plan", multiplier: 1 },
          { value: "kurumsal", label: "Kurumsal dahil 4+", multiplier: 1.2 },
        ],
      },
      {
        id: "musteri",
        question: "Hedef müşterin kim?",
        choices: [
          { value: "bireysel", label: "Bireysel kullanıcı", multiplier: 1 },
          { value: "kobi", label: "KOBİ", multiplier: 1.1 },
          { value: "kurumsal", label: "Kurumsal şirketler", multiplier: 1.3 },
        ],
      },
    ],
    addOns: [
      { slug: "affiliate", name: "Ortaklık / affiliate modülü", price: 16900 },
      { slug: "kullanim-fatura", name: "Kullanıma göre faturalama", price: 19900 },
      { slug: "api", name: "Genel API + dokümantasyon", price: 22900 },
      { slug: "pazarlama", name: "Pazarlama (landing) sitesi", price: 14900 },
    ],
  },

  /* --- 08 Masaüstü uygulaması ---------------------------------------- */
  {
    service: "masaustu-uygulama",
    unit: "proje",
    tiers: [
      {
        slug: "masaustu-tek",
        name: "Tek nokta",
        price: 54900,
        tagline: "Tek bilgisayarda çalışan kurulabilir yazılım.",
        features: [
          "Tek platform (Windows veya macOS)",
          "Yerel veritabanı (SQLite)",
          "Yazıcı / barkod desteği",
          "İmzalı kurulum paketi",
          "Kullanım kılavuzu",
        ],
        delivery: "≈ 6 hafta",
      },
      {
        slug: "masaustu-pro",
        name: "Profesyonel",
        price: 94900,
        popular: true,
        tagline: "Çevrimdışı çalışır, bağlanınca senkronlar.",
        features: [
          "Windows + macOS",
          "Çevrimdışı çalışma + senkronizasyon",
          "Otomatik güncelleme sistemi",
          "Bulut yedekleme",
          "3 ay destek",
        ],
        delivery: "≈ 8–10 hafta",
      },
      {
        slug: "masaustu-kurumsal",
        name: "Kurumsal",
        price: 159900,
        tagline: "Çok kullanıcılı, merkezden yönetilen kurulum.",
        features: [
          "Merkezi yönetim paneli",
          "Toplu kurulum ve politika yönetimi",
          "Donanım entegrasyonları (kasa, terazi)",
          "Loglama ve uzaktan destek",
          "6 ay öncelikli destek",
        ],
        delivery: "≈ 12+ hafta",
      },
    ],
    matrix: [
      {
        label: "İşletim sistemi",
        meaning: "Uygulamanın çalışacağı platformlar",
        values: ["Tek platform", "Windows + macOS", "Windows + macOS + Linux"],
      },
      {
        label: "Çevrimdışı çalışma",
        meaning: "İnternet yokken kullanabilme",
        values: ["Tam çevrimdışı", "Çevrimdışı + senkron", "Çok şube senkronu"],
      },
      {
        label: "Otomatik güncelleme",
        meaning: "Yeni sürümün kendiliğinden inmesi",
        values: ["Manuel kurulum", "Otomatik", "Otomatik + sürüm politikası"],
      },
      {
        label: "Donanım desteği",
        meaning: "Yazıcı, barkod, kasa gibi cihaz bağlantıları",
        values: ["Yazıcı + barkod", "+ Terazi / el terminali", "Özel donanım entegrasyonu"],
      },
      {
        label: "Cihaz sayısı",
        meaning: "Aynı anda kurulu çalışabilecek bilgisayar",
        values: ["1 cihaz", "10 cihaza kadar", "Sınırsız + merkezi yönetim"],
      },
      {
        label: "Yedekleme",
        meaning: "Verinin nereye kopyalandığı",
        values: ["Yerel", "Bulut yedek", "Bulut + felaket kurtarma"],
      },
      {
        label: "Destek",
        meaning: "Teslim sonrası ücretsiz destek süresi",
        values: ["1 ay", "3 ay", "6 ay öncelikli"],
      },
    ],
    questions: [
      {
        id: "cihaz",
        question: "Kaç cihazda çalışacak?",
        choices: [
          { value: "az", label: "1–3 cihaz", multiplier: 0.9 },
          { value: "orta", label: "4–20 cihaz", multiplier: 1.1 },
          { value: "cok", label: "20+ cihaz", multiplier: 1.35 },
        ],
      },
      {
        id: "donanim",
        question: "Donanım bağlantısı gerekiyor mu?",
        choices: [
          { value: "yok", label: "Gerekmiyor", multiplier: 0.95 },
          { value: "temel", label: "Yazıcı / barkod", multiplier: 1.1 },
          { value: "ozel", label: "Kasa, terazi, el terminali", multiplier: 1.3 },
        ],
      },
    ],
    addOns: [
      { slug: "eslik", name: "Mobil / web eşlik uygulaması", price: 24900 },
      { slug: "veri-aktarim", name: "Eski programdan veri aktarımı", price: 9900 },
      { slug: "imza", name: "Kod imzalama sertifikası kurulumu", price: 6900 },
      { slug: "yerinde", name: "Yerinde kurulum ve eğitim", price: 7900 },
    ],
  },

  /* --- 09 API & entegrasyon ------------------------------------------ */
  {
    service: "api-entegrasyon",
    unit: "proje",
    tiers: [
      {
        slug: "api-tek",
        name: "Tek entegrasyon",
        price: 19900,
        tagline: "İki sistemi konuştur, elle veri girişini bitir.",
        features: [
          "Tek sistem bağlantısı",
          "Alan eşleme (field mapping)",
          "Hata yönetimi ve tekrar deneme",
          "Temel izleme ve uyarı",
          "Teknik doküman",
        ],
        delivery: "≈ 1–2 hafta",
      },
      {
        slug: "api-coklu",
        name: "Çoklu entegrasyon",
        price: 39900,
        popular: true,
        tagline: "Birden çok sistemi tek akışta topla.",
        features: [
          "3 sisteme kadar bağlantı",
          "İki yönlü senkronizasyon",
          "Kuyruk ve tekrar deneme mimarisi",
          "İzleme paneli ve uyarılar",
          "3 ay destek",
        ],
        delivery: "≈ 3–5 hafta",
      },
      {
        slug: "api-altyapi",
        name: "Entegrasyon altyapısı",
        price: 79900,
        tagline: "Yeni sistemlerin kolayca eklendiği köprü katmanı.",
        features: [
          "Sınırsız entegrasyon için altyapı",
          "Kendi API'nizin geliştirilmesi",
          "Yetkilendirme ve limit yönetimi",
          "Log, uyarı ve SLA",
          "6 ay öncelikli destek",
        ],
        delivery: "≈ 6–10 hafta",
      },
    ],
    matrix: [
      {
        label: "Bağlanan sistem",
        meaning: "Entegre edilecek yazılım adedi",
        values: ["1 sistem", "3 sisteme kadar", "Sınırsız"],
      },
      {
        label: "Akış yönü",
        meaning: "Verinin hangi tarafa aktığı",
        values: ["Tek yönlü", "İki yönlü", "İki yönlü + çakışma çözümü"],
      },
      {
        label: "Senkron sıklığı",
        meaning: "Verinin ne sıklıkla güncellendiği",
        values: ["Günlük / saatlik", "Dakikalık", "Anlık (webhook)"],
      },
      {
        label: "Hata yönetimi",
        meaning: "Bir aktarım başarısız olduğunda ne olacağı",
        values: ["E-posta uyarısı", "Otomatik tekrar deneme", "Kuyruk + kurtarma ekranı"],
      },
      {
        label: "İzleme",
        meaning: "Akışın çalıştığını görebilme",
        values: ["Temel log", "İzleme paneli", "Panel + uyarı + SLA"],
      },
      {
        label: "Dokümantasyon",
        meaning: "Teknik ekibinize bırakılan rehber",
        values: ["Teknik not", "Tam doküman", "Doküman + API portalı"],
      },
      {
        label: "Destek",
        meaning: "Teslim sonrası ücretsiz destek süresi",
        values: ["1 ay", "3 ay", "6 ay öncelikli"],
      },
    ],
    questions: [
      {
        id: "sistem",
        question: "Kaç sistem bağlanacak?",
        choices: [
          { value: "iki", label: "2 sistem", multiplier: 0.9 },
          { value: "birkac", label: "3–4 sistem", multiplier: 1.15 },
          { value: "cok", label: "5+ sistem", multiplier: 1.4 },
        ],
      },
      {
        id: "siklik",
        question: "Veri ne sıklıkla güncellenmeli?",
        choices: [
          { value: "gunluk", label: "Günlük", multiplier: 0.95 },
          { value: "saatlik", label: "Saatlik", multiplier: 1.1 },
          { value: "anlik", label: "Anlık", multiplier: 1.25 },
        ],
      },
    ],
    addOns: [
      { slug: "ek-sistem", name: "Ek sistem bağlantısı", price: 9900 },
      { slug: "kendi-api", name: "Kendi API'nizin geliştirilmesi", price: 24900 },
      { slug: "veri-temizleme", name: "Veri temizleme ve eşleştirme", price: 7900 },
      { slug: "uyari", name: "Uyarı ve nöbet kurulumu", price: 5900 },
    ],
  },

  /* --- 10 İş süreci otomasyonu --------------------------------------- */
  {
    service: "otomasyon",
    unit: "proje",
    tiers: [
      {
        slug: "otomasyon-tek",
        name: "Tek akış",
        price: 24900,
        tagline: "En çok zaman yiyen işi otomatiğe bağla.",
        features: [
          "Süreç analizi ve zaman ölçümü",
          "Tek otomasyon akışı",
          "Zamanlanmış görev kurulumu",
          "Otomatik e-posta / rapor",
          "Dokümantasyon",
        ],
        delivery: "≈ 2 hafta",
      },
      {
        slug: "otomasyon-departman",
        name: "Departman",
        price: 49900,
        popular: true,
        tagline: "Bir ekibin tüm tekrarlayan işleri.",
        features: [
          "3–5 otomasyon akışı",
          "Sistemler arası veri aktarımı",
          "Hata uyarıları ve nöbet",
          "Kazanılan süre raporu",
          "3 ay destek",
        ],
        delivery: "≈ 3–5 hafta",
      },
      {
        slug: "otomasyon-kurumsal",
        name: "Kurumsal",
        price: 89900,
        tagline: "Şirket geneli, izlenebilir otomasyon katmanı.",
        features: [
          "Sınırsız akış",
          "Onay adımlı iş akışları",
          "Merkezi izleme paneli",
          "Rol bazlı erişim",
          "6 ay öncelikli destek",
        ],
        delivery: "≈ 6–10 hafta",
      },
    ],
    matrix: [
      {
        label: "Akış sayısı",
        meaning: "Otomatikleştirilen iş adedi",
        values: ["1 akış", "3–5 akış", "Sınırsız"],
      },
      {
        label: "Tetikleme",
        meaning: "Otomasyonun hangi durumda çalıştığı",
        values: ["Zamanlanmış", "Zaman + olay", "Zaman + olay + onay"],
      },
      {
        label: "Bağlanan sistem",
        meaning: "Veri alınan / yazılan yazılımlar",
        values: ["1 sistem", "3 sisteme kadar", "Sınırsız"],
      },
      {
        label: "Onay adımı",
        meaning: "İnsan onayı gereken ara adımlar",
        values: ["—", "Tek onay", "Çok aşamalı onay"],
      },
      {
        label: "Raporlama",
        meaning: "Kazanılan süre ve hata takibi",
        values: ["Aylık e-posta", "Panel + uyarı", "Panel + SLA"],
      },
      {
        label: "Eğitim",
        meaning: "Ekibin akışı yönetmeyi öğrenmesi",
        values: ["Doküman", "Doküman + 1 oturum", "Eğitim programı"],
      },
      {
        label: "Destek",
        meaning: "Teslim sonrası ücretsiz destek süresi",
        values: ["1 ay", "3 ay", "6 ay öncelikli"],
      },
    ],
    questions: [
      {
        id: "akis",
        question: "Kaç işi otomatikleştireceğiz?",
        choices: [
          { value: "tek", label: "1 iş", multiplier: 0.9 },
          { value: "birkac", label: "2–4 iş", multiplier: 1.1 },
          { value: "cok", label: "5+ iş", multiplier: 1.35 },
        ],
      },
      {
        id: "kaynak",
        question: "Veri nereden gelecek?",
        choices: [
          { value: "dosya", label: "Excel / e-posta", multiplier: 0.95 },
          { value: "api", label: "Web servisleri (API)", multiplier: 1.1 },
          { value: "kurumsal", label: "ERP / CRM gibi kurumsal yazılım", multiplier: 1.3 },
        ],
      },
    ],
    addOns: [
      { slug: "ek-akis", name: "Ek otomasyon akışı", price: 9900 },
      { slug: "whatsapp", name: "WhatsApp bildirim entegrasyonu", price: 6900 },
      { slug: "rapor-panel", name: "Excel / Sheets rapor paneli", price: 7900 },
      { slug: "nobet", name: "Uyarı ve nöbet kurulumu", price: 5900 },
    ],
  },

  /* --- 11 SEO --------------------------------------------------------- */
  {
    service: "seo",
    unit: "ay",
    note: "SEO aylık abonelik olarak çalışır; ilk sonuçlar genellikle 3. aydan itibaren görülür.",
    tiers: [
      {
        slug: "seo-temel",
        name: "Temel",
        price: 7900,
        tagline: "Teknik temeli düzelt, doğru ölçmeye başla.",
        features: [
          "Teknik SEO denetimi ve düzeltmeler",
          "Anahtar kelime araştırması (25 kelime)",
          "Search Console + GA4 kurulumu",
          "Aylık 2 içerik brief'i",
          "Aylık performans raporu",
        ],
        delivery: "Aylık · min. 3 ay",
      },
      {
        slug: "seo-buyume",
        name: "Büyüme",
        price: 14900,
        popular: true,
        tagline: "Sıralamayı içerik ve hızla yukarı taşı.",
        features: [
          "Temel paketin tamamı",
          "Aylık 4 optimize içerik",
          "Core Web Vitals iyileştirmesi",
          "Yapısal veri ve dahili bağlantı",
          "Rakip takibi + aylık toplantı",
        ],
        delivery: "Aylık · min. 6 ay",
      },
      {
        slug: "seo-kurumsal",
        name: "Kurumsal",
        price: 27900,
        tagline: "Çok sayfalı, çok lokasyonlu yapılar için.",
        features: [
          "Büyüme paketinin tamamı",
          "Aylık 8 içerik + editör kontrolü",
          "Çok dilli / çok lokasyonlu SEO",
          "Dijital PR ve bağlantı çalışması",
          "Canlı performans paneli",
        ],
        delivery: "Aylık · min. 6 ay",
      },
    ],
    matrix: [
      {
        label: "Teknik denetim",
        meaning: "Sitenin arama motoru uyumunun incelenmesi",
        values: ["İlk ay tam denetim", "Aylık kontrol", "Aylık + otomatik izleme"],
      },
      {
        label: "Anahtar kelime",
        meaning: "Sıralaması takip edilen arama terimi sayısı",
        values: ["25 kelime", "100 kelime", "300+ kelime"],
      },
      {
        label: "İçerik üretimi",
        meaning: "Ayda hazırlanan optimize içerik",
        values: ["2 brief (yazı sizde)", "4 içerik", "8 içerik + editör"],
      },
      {
        label: "Hız optimizasyonu",
        meaning: "Core Web Vitals iyileştirmesi",
        values: ["Rapor", "Uygulama dahil", "Uygulama + sürekli izleme"],
      },
      {
        label: "Bağlantı çalışması",
        meaning: "Dış sitelerden gelen referans linkler",
        values: ["—", "Temel", "Dijital PR"],
      },
      {
        label: "Raporlama",
        meaning: "Sonuçların paylaşılma biçimi",
        values: ["Aylık rapor", "Aylık rapor + toplantı", "Canlı panel + toplantı"],
      },
    ],
    questions: [
      {
        id: "sayfa",
        question: "Sitende kaç sayfa var?",
        choices: [
          { value: "az", label: "20'ye kadar", multiplier: 0.9 },
          { value: "orta", label: "20–100", multiplier: 1 },
          { value: "cok", label: "100+", multiplier: 1.25 },
        ],
      },
      {
        id: "rekabet",
        question: "Rekabet ne durumda?",
        choices: [
          { value: "yerel", label: "Yerel / niş", multiplier: 0.9 },
          { value: "ulusal", label: "Ulusal", multiplier: 1.1 },
          { value: "yuksek", label: "Yüksek rekabet", hint: "E-ticaret, sigorta, turizm", multiplier: 1.3 },
        ],
      },
    ],
    addOns: [
      { slug: "icerik", name: "Ek içerik yazımı (4 yazı / ay)", price: 4900 },
      { slug: "yerel", name: "Ek lokasyon için yerel SEO", price: 3900 },
      { slug: "ek-dil", name: "Ek dil", price: 5900 },
      { slug: "teknik", name: "Teknik düzeltmelerin uygulanması", price: 6900 },
    ],
  },

  /* --- 12 Google & Meta Ads ------------------------------------------- */
  {
    service: "reklam",
    unit: "ay",
    note: "Fiyatlar yönetim bedelidir; reklam bütçesi dahil değildir ve doğrudan platforma ödenir.",
    tiers: [
      {
        slug: "reklam-baslangic",
        name: "Başlangıç",
        price: 6900,
        tagline: "Tek kanalda doğru kurulum ve dürüst ölçüm.",
        features: [
          "Tek platform (Google veya Meta)",
          "Hesap ve dönüşüm kurulumu",
          "2 kampanya + hedef kitleler",
          "Aylık optimizasyon",
          "Aylık performans raporu",
        ],
        delivery: "Aylık · min. 3 ay",
      },
      {
        slug: "reklam-performans",
        name: "Performans",
        price: 12900,
        popular: true,
        tagline: "İki kanal, kreatif üretimi ve sürekli test.",
        features: [
          "Google + Meta",
          "Aylık 4 kreatif üretimi",
          "A/B testleri",
          "Remarketing kurgusu",
          "İki haftada bir optimizasyon toplantısı",
        ],
        delivery: "Aylık · min. 3 ay",
      },
      {
        slug: "reklam-funnel",
        name: "Full-funnel",
        price: 22900,
        tagline: "Farkındalıktan satışa kadar tüm huni.",
        features: [
          "Google + Meta + ek kanal (TikTok / LinkedIn)",
          "Aylık 8+ kreatif ve video",
          "Landing page testleri",
          "Gelir bazlı raporlama",
          "Haftalık toplantı",
        ],
        delivery: "Aylık · min. 6 ay",
      },
    ],
    matrix: [
      {
        label: "Kanal sayısı",
        meaning: "Yönetilen reklam platformu adedi",
        values: ["1 kanal", "2 kanal", "3+ kanal"],
      },
      {
        label: "Kreatif üretimi",
        meaning: "Ayda üretilen görsel ve video reklam",
        values: ["Mevcut görsellerle", "Aylık 4 kreatif", "Aylık 8+ kreatif ve video"],
      },
      {
        label: "Optimizasyon sıklığı",
        meaning: "Kampanyalara ne sıklıkla müdahale edildiği",
        values: ["Aylık", "İki haftada bir", "Haftalık"],
      },
      {
        label: "Dönüşüm takibi",
        meaning: "Satışın hangi reklamdan geldiğinin ölçümü",
        values: ["Temel kurulum", "Gelişmiş + Pixel", "Sunucu taraflı takip"],
      },
      {
        label: "Landing page",
        meaning: "Reklamın indiği sayfanın ele alınışı",
        values: ["Mevcut sayfa", "Öneri ve düzenleme", "Özel sayfa + A/B test"],
      },
      {
        label: "Raporlama",
        meaning: "Harcama ve dönüşün paylaşılma biçimi",
        values: ["Aylık rapor", "Aylık rapor + toplantı", "Canlı panel + haftalık"],
      },
    ],
    questions: [
      {
        id: "butce",
        question: "Aylık reklam bütçen ne kadar?",
        hint: "Bu tutar platforma ödenir, yönetim bedeline dahil değildir.",
        choices: [
          { value: "az", label: "₺10.000 altı", multiplier: 0.9 },
          { value: "orta", label: "₺10.000 – ₺50.000", multiplier: 1 },
          { value: "cok", label: "₺50.000+", multiplier: 1.3 },
        ],
      },
      {
        id: "kanal",
        question: "Hangi kanallarda yayınlayacağız?",
        choices: [
          { value: "tek", label: "Tek kanal", multiplier: 0.9 },
          { value: "iki", label: "Google + Meta", multiplier: 1 },
          { value: "cok", label: "3+ kanal", multiplier: 1.25 },
        ],
      },
    ],
    addOns: [
      { slug: "ek-kanal", name: "Ek kanal yönetimi", price: 4900 },
      { slug: "video", name: "Video reklam üretimi (2 video / ay)", price: 7900 },
      { slug: "landing", name: "Landing page A/B testi", price: 5900 },
      { slug: "email", name: "E-posta / SMS kampanyaları", price: 4900 },
    ],
  },

  /* --- 13 Sosyal medya ------------------------------------------------ */
  {
    service: "sosyal-medya",
    unit: "ay",
    tiers: [
      {
        slug: "sosyal-temel",
        name: "Temel",
        price: 9900,
        tagline: "Düzenli yayın akışını kur.",
        features: [
          "2 platform (Instagram + 1)",
          "Aylık 8 içerik",
          "İçerik takvimi",
          "Haftalık topluluk yönetimi",
          "Aylık rapor",
        ],
        delivery: "Aylık · min. 3 ay",
      },
      {
        slug: "sosyal-marka",
        name: "Marka",
        price: 17900,
        popular: true,
        tagline: "İçerik, video ve topluluk yönetimi bir arada.",
        features: [
          "3 platform",
          "Aylık 16 içerik + 4 reels",
          "Aylık 1 çekim günü",
          "Günlük topluluk yönetimi",
          "Rakip ve trend analizi",
        ],
        delivery: "Aylık · min. 3 ay",
      },
      {
        slug: "sosyal-360",
        name: "360",
        price: 29900,
        tagline: "İçerik, iş birliği ve reklam kreatifi tek elden.",
        features: [
          "4+ platform",
          "Aylık 24 içerik + 8 video",
          "Influencer ve iş birliği yönetimi",
          "Reklam kreatifleri dahil",
          "Haftalık raporlama",
        ],
        delivery: "Aylık · min. 6 ay",
      },
    ],
    matrix: [
      {
        label: "Platform sayısı",
        meaning: "Yönetilen sosyal medya hesabı",
        values: ["2 platform", "3 platform", "4+ platform"],
      },
      {
        label: "İçerik adedi",
        meaning: "Ayda yayınlanan gönderi sayısı",
        values: ["8 gönderi", "16 gönderi", "24 gönderi"],
      },
      {
        label: "Video / reels",
        meaning: "Ayda üretilen kısa video",
        values: ["—", "4 reels", "8 video"],
      },
      {
        label: "Çekim",
        meaning: "Yerinde fotoğraf ve video çekimi",
        values: ["—", "Aylık 1 gün", "Aylık 2 gün"],
      },
      {
        label: "Topluluk yönetimi",
        meaning: "Yorum ve mesajların yanıtlanması",
        values: ["Haftalık", "Günlük", "Günlük + kriz yönetimi"],
      },
      {
        label: "Raporlama",
        meaning: "Sonuçların paylaşılma sıklığı",
        values: ["Aylık", "Aylık + toplantı", "Haftalık + strateji"],
      },
    ],
    questions: [
      {
        id: "platform",
        question: "Hangi platformlar yönetilecek?",
        choices: [
          { value: "tek", label: "Tek platform", multiplier: 0.85 },
          { value: "iki", label: "2–3 platform", multiplier: 1 },
          { value: "cok", label: "4+ platform", multiplier: 1.3 },
        ],
      },
      {
        id: "cekim",
        question: "Çekim gerekiyor mu?",
        choices: [
          { value: "yok", label: "Hayır", hint: "Görseller bizde", multiplier: 0.9 },
          { value: "birgun", label: "Aylık 1 gün", multiplier: 1.1 },
          { value: "cok", label: "Aylık 2+ gün", multiplier: 1.35 },
        ],
      },
    ],
    addOns: [
      { slug: "ek-platform", name: "Ek platform", price: 3900 },
      { slug: "influencer", name: "Influencer iş birliği yönetimi", price: 6900 },
      { slug: "ek-cekim", name: "Ek çekim günü", price: 5900 },
      { slug: "reklam-kreatif", name: "Reklam kreatifi paketi", price: 4900 },
    ],
  },

  /* --- 14 UI/UX & ürün tasarımı --------------------------------------- */
  {
    service: "ui-ux",
    unit: "proje",
    tiers: [
      {
        slug: "uiux-arayuz",
        name: "Arayüz",
        price: 19900,
        tagline: "Var olan ürünün ekranlarını tasarlayalım.",
        features: [
          "6 ekrana kadar tasarım",
          "Mobil + masaüstü düzen",
          "Tıklanabilir prototip",
          "Figma dosyasının devri",
          "2 revizyon turu",
        ],
        delivery: "≈ 2 hafta",
      },
      {
        slug: "uiux-urun",
        name: "Ürün tasarımı",
        price: 44900,
        popular: true,
        tagline: "Araştırmadan prototipe tam süreç.",
        features: [
          "Kullanıcı ve rakip araştırması",
          "Akış ve wireframe",
          "Sınırsız ekran tasarımı",
          "Kullanılabilirlik testi (5 kişi)",
          "3 revizyon turu",
        ],
        delivery: "≈ 3–5 hafta",
      },
      {
        slug: "uiux-sistem",
        name: "Tasarım sistemi",
        price: 79900,
        tagline: "Ekibin uzun süre kullanacağı ortak tasarım dili.",
        features: [
          "Bileşen kütüphanesi ve token'lar",
          "Karanlık / aydınlık tema",
          "Erişilebilirlik (WCAG) kontrolü",
          "Geliştirici dokümantasyonu",
          "Ekip eğitimi",
        ],
        delivery: "≈ 6–8 hafta",
      },
    ],
    matrix: [
      {
        label: "Ekran sayısı",
        meaning: "Tasarlanan benzersiz ekran adedi",
        values: ["6 ekrana kadar", "Sınırsız", "Sınırsız + bileşen"],
      },
      {
        label: "Araştırma",
        meaning: "Kullanıcı ve rakip incelemesi",
        values: ["—", "Kullanıcı + rakip", "Derinlemesine görüşmeler"],
      },
      {
        label: "Prototip",
        meaning: "Kodlanmadan denenebilen tıklanabilir sürüm",
        values: ["Temel", "Tam akış", "Tam akış + animasyon"],
      },
      {
        label: "Kullanılabilirlik testi",
        meaning: "Gerçek kullanıcıyla yapılan test",
        values: ["—", "5 kişi", "10 kişi + rapor"],
      },
      {
        label: "Tasarım sistemi",
        meaning: "Tekrar kullanılabilir bileşenler ve kurallar",
        values: ["Renk + tipografi", "Temel bileşenler", "Tam kütüphane + token"],
      },
      {
        label: "Geliştirici dokümantasyonu",
        meaning: "Kodlayan ekibe bırakılan rehber",
        values: ["—", "Temel", "Tam doküman + eğitim"],
      },
      {
        label: "Revizyon",
        meaning: "Ücretsiz düzeltme turu",
        values: ["2 tur", "3 tur", "Kapsam içi sınırsız"],
      },
    ],
    questions: [
      {
        id: "ekran",
        question: "Kaç ekran tasarlanacak?",
        choices: [
          { value: "az", label: "1–6 ekran", multiplier: 0.9 },
          { value: "orta", label: "7–20 ekran", multiplier: 1.1 },
          { value: "cok", label: "20+ ekran", multiplier: 1.4 },
        ],
      },
      {
        id: "arastirma",
        question: "Araştırma gerekiyor mu?",
        choices: [
          { value: "yok", label: "Hayır", hint: "İhtiyaç net", multiplier: 0.9 },
          { value: "rakip", label: "Rakip analizi yeterli", multiplier: 1 },
          { value: "kullanici", label: "Kullanıcı görüşmeleri de olsun", multiplier: 1.25 },
        ],
      },
    ],
    addOns: [
      { slug: "test", name: "Kullanılabilirlik testi (5 kişi)", price: 9900 },
      { slug: "marka", name: "Logo ve marka kimliği", price: 8900 },
      { slug: "ikon", name: "İllüstrasyon / ikon seti", price: 6900 },
      { slug: "sunum", name: "Sunum ve pitch deck tasarımı", price: 7900 },
    ],
  },

  /* --- 15 Bakım, bulut & destek --------------------------------------- */
  {
    service: "bakim-destek",
    unit: "ay",
    note: "Bakım aboneliği proje bedelinden ayrıdır; teslim sonrası ücretsiz destek süresi bitince başlar.",
    tiers: [
      {
        slug: "bakim-temel",
        name: "Temel",
        price: 1900,
        tagline: "Site ayakta kalsın, yedeği alınsın.",
        features: [
          "Hosting, alan adı ve SSL yönetimi",
          "Haftalık yedekleme",
          "Güvenlik güncellemeleri",
          "Aylık 2 saat içerik / geliştirme desteği",
          "E-posta desteği",
        ],
        delivery: "Aylık · iptal edilebilir",
      },
      {
        slug: "bakim-pro",
        name: "Pro",
        price: 3900,
        popular: true,
        tagline: "İzleme, raporlama ve hızlı müdahale.",
        features: [
          "Temel paketin tamamı",
          "Uptime izleme + anlık uyarı",
          "Aylık 6 saat geliştirme desteği",
          "Performans ve SEO raporu",
          "48 saat içinde müdahale",
        ],
        delivery: "Aylık · iptal edilebilir",
      },
      {
        slug: "bakim-kurumsal",
        name: "Kurumsal",
        price: 8900,
        tagline: "SLA'li öncelikli destek ve sürekli geliştirme.",
        features: [
          "Pro paketin tamamı",
          "SLA'li öncelikli destek (4 saat)",
          "Özel sunucu / bulut mimarisi",
          "Aylık 15 saat geliştirme",
          "Sprint bazlı yol haritası",
        ],
        delivery: "Aylık · min. 6 ay",
      },
    ],
    matrix: [
      {
        label: "Yedekleme sıklığı",
        meaning: "Verinin ne sıklıkla kopyalandığı",
        values: ["Haftalık", "Günlük", "Günlük + coğrafi yedek"],
      },
      {
        label: "Uptime izleme",
        meaning: "Sitenin kapandığını fark etme",
        values: ["—", "Anlık uyarı", "Anlık uyarı + nöbet"],
      },
      {
        label: "Destek saati",
        meaning: "Aylık fiyata dahil geliştirme süresi",
        values: ["2 saat", "6 saat", "15 saat"],
      },
      {
        label: "Müdahale süresi",
        meaning: "Sorun bildirildikten sonra dönüş süresi",
        values: ["72 saat", "48 saat", "4 saat (SLA)"],
      },
      {
        label: "Raporlama",
        meaning: "Ay içinde ne yapıldığının paylaşımı",
        values: ["—", "Performans + SEO raporu", "Detaylı rapor + toplantı"],
      },
      {
        label: "Sunucu mimarisi",
        meaning: "Ürünün çalıştığı altyapı",
        values: ["Paylaşımlı bulut", "Ayrılmış kaynak", "Özel / yedekli mimari"],
      },
    ],
    questions: [
      {
        id: "kapsam",
        question: "Neyin bakımı yapılacak?",
        choices: [
          { value: "site", label: "Tek site", multiplier: 0.9 },
          { value: "site-panel", label: "Site + panel", multiplier: 1.1 },
          { value: "coklu", label: "Birden çok ürün", multiplier: 1.35 },
        ],
      },
      {
        id: "kritik",
        question: "Kesintiye ne kadar dayanabilirsin?",
        choices: [
          { value: "esnek", label: "Birkaç saat sorun değil", multiplier: 0.95 },
          { value: "gun", label: "Aynı gün çözülmeli", multiplier: 1.1 },
          { value: "kritik", label: "Kritik — dakikalar", multiplier: 1.4 },
        ],
      },
    ],
    addOns: [
      { slug: "ek-saat", name: "Ek 5 saat geliştirme", price: 2900 },
      { slug: "nobet", name: "7/24 nöbet", price: 4900 },
      { slug: "icerik", name: "İçerik güncelleme paketi", price: 1900 },
      { slug: "guvenlik", name: "Aylık güvenlik taraması", price: 1900 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Ortak sorular ve yardımcılar                                        */
/* ------------------------------------------------------------------ */

/**
 * Paketler sayfasında gösterilen fiyatlandırmalar — `hiddenServiceSlugs` ile
 * şimdilik kaldırılan hizmetler burada da elenir (derin bağlantı dahil).
 */
export const servicePricing: ServicePricing[] = allServicePricing.filter(
  (pricing) => services.some((service) => service.slug === pricing.service),
);

/** Her hizmette sorulan zamanlama sorusu. */
export const timingQuestion: PricingQuestion = {
  id: "zaman",
  question: "Ne zaman başlamak istiyorsun?",
  hint: "Acil işler sırayı öne alır, bu da fiyata yansır.",
  choices: [
    {
      value: "acil",
      label: "En kısa sürede",
      hint: "Hızlandırılmış takvim",
      multiplier: 1.2,
    },
    { value: "normal", label: "1–2 ay içinde", multiplier: 1 },
    {
      value: "esnek",
      label: "Esnek",
      hint: "Planlama aşamasındayız",
      multiplier: 0.95,
    },
  ],
};

export function getServicePricing(slug: string) {
  return servicePricing.find((item) => item.service === slug);
}

export function getTier(pricing: ServicePricing, tierSlug: string) {
  return pricing.tiers.find((tier) => tier.slug === tierSlug);
}

/** Fiyatlandırmalı hizmetler, hizmet grubuna göre sıralı. */
export const pricedServices = services
  .filter((service) => getServicePricing(service.slug))
  .map((service) => ({
    slug: service.slug,
    title: service.title,
    tag: service.tag,
    group: service.group,
    summary: service.summary,
  }));

export const pricedServiceGroups: {
  id: ServiceGroupId;
  title: string;
  services: typeof pricedServices;
}[] = serviceGroups.map((group) => ({
  id: group.id,
  title: group.title,
  services: pricedServices.filter((service) => service.group === group.id),
}));

export const tl = (value: number) =>
  `₺${value.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;

const roundTo = (value: number, step: number) =>
  Math.round(value / step) * step;

/**
 * Seçimlerden tahmini aralık üretir.
 * Alt sınır = paket başlangıç fiyatı × çarpanlar + ek modüller.
 */
export function estimateRange({
  pricing,
  tierSlug,
  multipliers,
  addOnSlugs,
}: {
  pricing: ServicePricing;
  tierSlug: string;
  multipliers: number[];
  addOnSlugs: string[];
}) {
  const tier = getTier(pricing, tierSlug) ?? pricing.tiers[0];
  const factor = multipliers.reduce((total, value) => total * value, 1);
  const step = pricing.unit === "ay" ? 100 : 500;

  const addOnTotal = pricing.addOns
    .filter((addOn) => addOnSlugs.includes(addOn.slug))
    .reduce((total, addOn) => total + addOn.price, 0);

  const low = roundTo(tier.price * factor, step) + addOnTotal;
  const high = roundTo(low * (pricing.unit === "ay" ? 1.2 : 1.35), step);

  return { low, high, addOnTotal, tier };
}
