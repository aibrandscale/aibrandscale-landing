import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://aibrandscale.io/sitemap.xml",
    host: "https://aibrandscale.io",
  };
}
