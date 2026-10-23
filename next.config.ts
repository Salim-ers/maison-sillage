import type { NextConfig } from "next";

/* Adresses des versions précédentes du catalogue → la référence la plus proche aujourd'hui */
const PRODUITS: Record<string, string> = {
  // deuxième version : saveurs renommées
  "fraise-des-bois-madeleine-doree": "fraise-des-bois-creme-de-madeleine",
  "poire-fondante-vanille-bourbon": "poire-rotie-sable-noisette",
  "datte-medjool-creme-brulee": "datte-fondante-creme-brulee",
  "poudre-fraise-des-bois-madeleine-doree": "poudre-fraise-des-bois-creme-de-madeleine",
  "poudre-poire-fondante-vanille-bourbon": "poudre-poire-rotie-sable-noisette",
  "poudre-datte-medjool-creme-brulee": "poudre-datte-fondante-creme-brulee",
  "pistache-fleur-de-sel": "pistache-grillee-biscuit-au-beurre",
  // première version
  "latte-madeleine-vanille-patissiere": "fraise-des-bois-creme-de-madeleine",
  "pistache-douce-vanille": "pistache-grillee-biscuit-au-beurre",
  "chai-velours-fleur-oranger": "poudre-chai-doux-fleur-oranger",
  "chocolat-intense-biscuit-dore": "chocolat-noir-intense",
};
const RECETTES: Record<string, string> = {
  "latte-datte-creme-brulee": "chocolat-chaud-datte-creme-brulee",
  "iced-latte-poire-vanille": "iced-latte-poire-rotie",
  "cafe-du-large-poire": "cafe-noisette",
  "creme-brulee-datte-medjool": "creme-brulee-a-la-datte",
  "latte-poire-vanille": "latte-vanille-praline",
  "iced-latte-peche-fleur-oranger": "mocktail-petillant-peche-blanche",
  "frappe-pistache-vanille": "frappe-pistache-biscuit",
  "affogato-datte-creme-brulee": "creme-brulee-a-la-datte",
  "chai-glace-fleur-oranger": "chai-latte-fleur-oranger",
  "latte-madeleine-fraise": "latte-fraise-creme-de-madeleine",
};

const nextConfig: NextConfig = {
  images: {
    // images pré-publiées en plusieurs largeurs WebP (scripts/images/build.py) : servies telles quelles
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1920, 2560, 3840],
    imageSizes: [64, 96, 160, 256, 384, 480],
    qualities: [70, 80, 85, 90],
  },
  poweredByHeader: false,
  async headers() {
    // adresses à empreinte : une image modifiée change de nom, la mise en cache peut être définitive
    return [{ source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
  async redirects() {
    return [
      ...Object.entries(PRODUITS).map(([from, to]) => ({ source: `/produits/${from}`, destination: `/produits/${to}`, permanent: true })),
      ...Object.entries(RECETTES).map(([from, to]) => ({ source: `/recettes/${from}`, destination: `/recettes/${to}`, permanent: true })),
      { source: "/accessoires", destination: "/atelier", permanent: true },
      { source: "/coffrets", destination: "/boutique?categorie=coffret", permanent: true },
    ];
  },
};

export default nextConfig;
