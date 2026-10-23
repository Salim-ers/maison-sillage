import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";
import { cormorant, manrope } from "./fonts";
import { SITE } from "@/lib/utils";
import { AMBIANCE_SCRIPT, DEFAULT_AMBIANCE, INTRO_SCRIPT } from "@/lib/ambiance-script";
import { IntroCurtain } from "@/components/layout/Intro";
import { photo } from "@/data/images";
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
    <html
      lang="fr"
      className={`${cormorant.variable} ${manrope.variable}`}
      data-season={DEFAULT_AMBIANCE.season}
      data-light={DEFAULT_AMBIANCE.light}
      suppressHydrationWarning
    >
      <head>
        {/* ambiance mémorisée appliquée avant le premier rendu : aucune couleur ne clignote */}
        <script dangerouslySetInnerHTML={{ __html: AMBIANCE_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        {/* écran d'ouverture : présent dès le HTML, le rideau se lève quand la page est prête */}
        <div id="intro" aria-hidden>
          <span className="intro-halo" />
          <div className="intro-contenu">
            <Image src={photo("brand-logo-dark").src} alt="" width={photo("brand-logo-dark").width} height={photo("brand-logo-dark").height} sizes="230px" preload className="intro-logo" draggable={false} />
            <svg className="intro-sillage" viewBox="0 0 260 22" aria-hidden>
              <path d="M2 12 C 40 2, 72 2, 104 11 S 170 22, 206 11 S 246 3, 258 8" fill="none" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </div>
        </div>
        <IntroCurtain />
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
