import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/*
  Social scrapers will not resolve a relative image path, so metadataBase has
  to be absolute. Preview deployments get their own generated URL, which keeps
  their link previews pointing at themselves instead of at production.
*/
const siteUrl = process.env.VERCEL_ENV === "production"
  ? site.url
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.hook,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.hook,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.hook,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
