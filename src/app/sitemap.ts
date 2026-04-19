import type { MetadataRoute } from "next";
import { LANGUAGE_SLUGS } from "@/lib/languages";

export const dynamic = "force-static";

const BASE = "https://codesnap.starmap.quest";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    ...LANGUAGE_SLUGS.map((slug) => ({
      url: `${BASE}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
