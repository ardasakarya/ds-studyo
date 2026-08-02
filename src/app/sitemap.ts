import type { MetadataRoute } from "next";
import { posts, projects, services } from "@/lib/data";
import { site } from "@/lib/site";

/** Statik dışa aktarımda derleme anında üretilir. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/hizmetler",
    "/referanslar",
    "/paketler",
    "/teklif-al",
    "/hakkimizda",
    "/blog",
    "/iletisim",
    "/gizlilik",
    "/kvkk",
    "/cerez",
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      priority: route === "" ? 1 : 0.8,
    })),
    ...services.map((service) => ({
      url: `${site.url}/hizmetler/${service.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/referanslar/${project.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      priority: 0.5,
    })),
  ];
}
