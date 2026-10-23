"use client";

/* Chargeur next/image : les images sont publiées à l'avance en plusieurs largeurs WebP
   (scripts/images/build.py → …/nom.empreinte.w640.webp). Le chargeur renvoie la plus petite
   largeur publiée qui couvre la demande, sans dépasser la source : rien n'est calculé à la volée,
   tout est servi comme un fichier statique, mis en cache sans limite (adresse à empreinte). */

// mêmes valeurs que WIDTHS dans scripts/images/build.py et images.deviceSizes + imageSizes (next.config.ts)
const WIDTHS = [64, 96, 160, 256, 384, 480, 640, 960, 1280, 1920, 2560, 3840];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = /^(.*)\.w(\d+)\.webp$/.exec(src);
  if (!m) return src;
  const native = Number(m[2]);
  const w = WIDTHS.find((x) => x >= width && x < native) ?? native;
  return `${m[1]}.w${w}.webp`;
}
