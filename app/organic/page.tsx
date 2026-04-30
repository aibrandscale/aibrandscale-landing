import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: { canonical: "https://aibrandscale.io/" },
};

export default function OrganicPage() {
  return <Home />;
}
