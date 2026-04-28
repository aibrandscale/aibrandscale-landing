import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aibrandscale.io";
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#izborut`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#kakvo-shte-otkriesh`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#zashto-sega`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#ot-kogo`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#moduli`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#rezultati`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/#chzv`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
