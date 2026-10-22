"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import type { Photo } from "@/data/images";
import { useAmbiance } from "@/lib/ambiance";
import { cn } from "@/lib/utils";

type Layer = { photo: Photo; mobile?: Photo; shown: boolean; ssr: boolean };
const keyOf = (p: Photo, m?: Photo) => p.src + (m ? `|${m.src}` : "");

/** Photographie à direction artistique : une source verticale sous 768 px, la source large au-delà.
 *  Le navigateur ne télécharge que celle qui correspond à l'écran. */
function ArtDirected({ desktop, mobile, sizes, mobileSizes, quality, eager, alt, onLoad, className }: {
  desktop: Photo;
  mobile: Photo;
  sizes: string;
  mobileSizes: string;
  quality: number;
  eager: boolean;
  alt: string;
  onLoad: () => void;
  className?: string;
}) {
  const common = { alt, fill: true, quality };
  const d = getImageProps({ ...common, src: desktop.src, sizes }).props;
  const { style, ...m } = getImageProps({ ...common, src: mobile.src, sizes: mobileSizes }).props;
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={d.srcSet} sizes={d.sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        {...m}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        onLoad={onLoad}
        className={cn("object-cover", className)}
        style={{ ...style, objectPosition: "var(--focus, 50% 50%)" }}
      />
    </picture>
  );
}

/**
 * Photographie qui suit l'ambiance : à chaque changement, la nouvelle
 * image se superpose et apparaît en fondu (≈ 1,1 s) une fois chargée ;
 * pendant une View Transition, elle s'affiche immédiatement (le
 * dévoilement est assuré par la transition elle-même).
 */
export function AmbientImage({
  photo,
  mobile,
  sizes,
  mobileSizes = "100vw",
  preload = false,
  quality = 80,
  className,
  imgClassName,
  layerClassName,
}: {
  photo: Photo;
  /** source verticale dédiée aux téléphones (direction artistique) */
  mobile?: Photo;
  sizes: string;
  mobileSizes?: string;
  preload?: boolean;
  quality?: number;
  className?: string;
  imgClassName?: string;
  /** classe ajoutée au tout premier calque (rendu serveur), ex. animation d'entrée */
  layerClassName?: string;
}) {
  const { transitioning } = useAmbiance();
  const [layers, setLayers] = useState<Layer[]>([{ photo, mobile, shown: true, ssr: true }]);
  const key = keyOf(photo, mobile);
  const top = layers[layers.length - 1];

  // nouvelle photographie : calque ajouté pendant le rendu même (et non dans un effet),
  // pour qu'il figure dans l'instantané pris par la View Transition
  if (keyOf(top.photo, top.mobile) !== key) {
    const instant = transitioning === "cinema";
    const already = layers.find((l) => l.shown && keyOf(l.photo, l.mobile) === key);
    const below = layers.filter((l) => l.shown).slice(-1);
    setLayers(already ? [already] : [...below, { photo, mobile, shown: instant, ssr: false }]);
  }

  // une fois la dernière image visible, on retire les calques précédents
  useEffect(() => {
    const last = layers[layers.length - 1];
    if (layers.length < 2 || !last.shown) return;
    const t = window.setTimeout(() => setLayers((ls) => ls.slice(-1)), 1250);
    return () => window.clearTimeout(t);
  }, [layers]);

  const reveal = (k: string) => setLayers((ls) => ls.map((l) => (keyOf(l.photo, l.mobile) === k ? { ...l, shown: true } : l)));

  return (
    <div className={cn("absolute inset-0", className)}>
      {layers.map((l) => {
        const k = keyOf(l.photo, l.mobile);
        const current = l === layers[layers.length - 1];
        const alt = current ? l.photo.alt : "";
        return (
          <div key={k} className={cn("amb-layer absolute inset-0", l.ssr && "hero-ssr", l.ssr && layerClassName)} style={{ opacity: l.shown ? 1 : 0 }} aria-hidden={current ? undefined : true}>
            {l.mobile ? (
              <ArtDirected
                desktop={l.photo}
                mobile={l.mobile}
                sizes={sizes}
                mobileSizes={mobileSizes}
                quality={quality}
                eager={preload && l.ssr}
                alt={alt}
                onLoad={() => reveal(k)}
                className={imgClassName}
              />
            ) : (
              <Image
                src={l.photo.src}
                alt={alt}
                fill
                sizes={sizes}
                quality={quality}
                preload={preload && l.ssr}
                placeholder={l.ssr ? "blur" : "empty"}
                blurDataURL={l.photo.blurDataURL}
                onLoad={() => reveal(k)}
                className={cn("object-cover", imgClassName)}
                style={{ objectPosition: l.photo.position ?? "50% 50%" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
