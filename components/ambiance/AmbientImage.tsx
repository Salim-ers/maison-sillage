"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/data/images";
import { useAmbiance } from "@/lib/ambiance";
import { cn } from "@/lib/utils";

type Layer = { photo: Photo; shown: boolean; ssr: boolean };

/**
 * Photographie qui suit l'ambiance : à chaque changement, la nouvelle
 * image se superpose et apparaît en fondu (≈ 1,1 s) une fois chargée ;
 * pendant une View Transition, elle s'affiche immédiatement (le
 * dévoilement est assuré par la transition elle-même).
 */
export function AmbientImage({
  photo,
  sizes,
  preload = false,
  quality = 80,
  className,
  imgClassName,
  layerClassName,
}: {
  photo: Photo;
  sizes: string;
  preload?: boolean;
  quality?: number;
  className?: string;
  imgClassName?: string;
  /** classe ajoutée au tout premier calque (rendu serveur), ex. animation d'entrée */
  layerClassName?: string;
}) {
  const { transitioning } = useAmbiance();
  const [layers, setLayers] = useState<Layer[]>([{ photo, shown: true, ssr: true }]);

  // nouvelle photographie : calque ajouté pendant le rendu même (et non dans un effet),
  // pour qu'il figure dans l'instantané pris par la View Transition
  if (layers[layers.length - 1].photo.src !== photo.src) {
    const instant = transitioning === "cinema";
    const already = layers.find((l) => l.shown && l.photo.src === photo.src);
    const below = layers.filter((l) => l.shown).slice(-1);
    setLayers(already ? [already] : [...below, { photo, shown: instant, ssr: false }]);
  }

  // une fois la dernière image visible, on retire les calques précédents
  useEffect(() => {
    const last = layers[layers.length - 1];
    if (layers.length < 2 || !last.shown) return;
    const t = window.setTimeout(() => setLayers((ls) => ls.slice(-1)), 1250);
    return () => window.clearTimeout(t);
  }, [layers]);

  const reveal = (src: string) => setLayers((ls) => ls.map((l) => (l.photo.src === src ? { ...l, shown: true } : l)));

  return (
    <div className={cn("absolute inset-0", className)}>
      {layers.map((l) => (
        <div key={l.photo.src} className={cn("amb-layer absolute inset-0", l.ssr && "hero-ssr", l.ssr && layerClassName)} style={{ opacity: l.shown ? 1 : 0 }}>
          <Image
            src={l.photo.src}
            alt={l === layers[layers.length - 1] ? l.photo.alt : ""}
            aria-hidden={l === layers[layers.length - 1] ? undefined : true}
            fill
            sizes={sizes}
            quality={quality}
            preload={preload && l.ssr}
            placeholder={l.ssr ? "blur" : "empty"}
            blurDataURL={l.photo.blurDataURL}
            onLoad={() => reveal(l.photo.src)}
            className={cn("object-cover", imgClassName)}
            style={{ objectPosition: l.photo.position ?? "50% 50%" }}
          />
        </div>
      ))}
    </div>
  );
}
