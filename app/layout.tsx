import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cormorant, manrope } from "./fonts";
import { SITE } from "@/lib/utils";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Maison Sillage — L'empreinte d'une saveur",
    template: "%s · Maison Sillage",
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: "Maison Sillage — L'empreinte d'une saveur",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f3e8d4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <Providers>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
        </Providers>
      </body>
    </html>
  );
}
