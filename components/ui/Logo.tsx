import Image from "next/image";
import { photo } from "@/data/images";
import { cn } from "@/lib/utils";

/* Le logo officiel, détouré sans aucune retouche de dessin.
   Proportions d'origine : 1124 × 1203 (logo) · 582 × 691 (emblème).
   « clair » : couleurs d'origine, pour fonds clairs ; « sombre » : même tracé
   en ivoire et or, pour photographies et fonds sombres. */

export function Logo({ tone = "clair", className, preload = false, sizes = "180px" }: { tone?: "clair" | "sombre"; className?: string; preload?: boolean; sizes?: string }) {
  return (
    <Image
      src={photo(tone === "clair" ? "brand-logo-light" : "brand-logo-dark").src}
      alt="Maison Sillage — L'empreinte d'une saveur"
      width={photo("brand-logo-light").width}
      height={photo("brand-logo-light").height}
      preload={preload}
      sizes={sizes}
      quality={90}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}

export function Emblem({ tone = "clair", className, sizes = "64px", alt = "" }: { tone?: "clair" | "sombre"; className?: string; sizes?: string; alt?: string }) {
  return (
    <Image
      src={photo(tone === "clair" ? "brand-emblem-light" : "brand-emblem-dark").src}
      alt={alt}
      width={photo("brand-emblem-light").width}
      height={photo("brand-emblem-light").height}
      sizes={sizes}
      quality={90}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}
