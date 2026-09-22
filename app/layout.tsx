import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

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
      <body>
        {children}
        {/*
          Vercel Analytics. Mounted once in the root layout rather than per
          page, which is what covers every route: the layout wraps all of them
          and survives client side navigation, so page views are counted once
          each. Repeating it per page would mount a second collector.

          It only reports from a Vercel deployment with Analytics switched on
          for the project; locally it is inert.
        */}
        <Analytics />
      </body>
    </html>
  );
}
