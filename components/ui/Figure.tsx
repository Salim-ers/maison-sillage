import Image from "next/image";
import type { SceneConfig } from "@/components/visuals/Scene";
import { Scene } from "@/components/visuals/Scene";
import { aspectClass } from "@/components/visuals/aspect";
import { MaskReveal } from "@/components/animations";
import { cn } from "@/lib/utils";

/**
 * Emplacement visuel. Accepte une photographie (`photo`) dès qu'elle existe ;
 * à défaut, affiche la scène illustrée correspondante.
 */
export function Figure({
  scene,
  photo,
  className,
  caption,
  reveal = "bottom",
  parallax = false,
  priority = false,
  sizes = "100vw",
  fill = false,
}: {
  scene: SceneConfig;
  photo?: { src: string; alt: string };
  className?: string;
  caption?: string;
  reveal?: "bottom" | "left" | "right" | "top" | false;
  parallax?: boolean;
  priority?: boolean;
  sizes?: string;
  /** remplit le parent au lieu d'imposer un ratio */
  fill?: boolean;
}) {
  const media = photo ? (
    <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
  ) : (
    <Scene config={scene} parallax={parallax} priority={priority} className="absolute inset-0 h-full w-full" />
  );
  const box = <div className={cn("relative overflow-hidden bg-lin", fill ? "h-full w-full" : aspectClass[scene.aspect])}>{media}</div>;
  return (
    <figure className={cn(fill && "h-full", className)}>
      {reveal ? (
        <MaskReveal from={reveal} className={fill ? "h-full" : undefined}>
          {box}
        </MaskReveal>
      ) : (
        box
      )}
      {caption && <figcaption className="mt-3 font-serif text-[0.95rem] italic text-espresso/75">{caption}</figcaption>}
    </figure>
  );
}
