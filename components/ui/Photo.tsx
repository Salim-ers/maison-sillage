import Image from "next/image";
import type { Photo as PhotoData } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * Photographie optimisée (next/image : AVIF/WebP, tailles responsives,
 * aperçu flou). Le conteneur fixe le format (ex. `aspect-[4/5]`) pour
 * éviter tout décalage de mise en page. La nuit, un voile bleuté discret
 * accorde la photographie à l'ambiance.
 */
export function Photo({
  photo,
  sizes,
  className,
  imgClassName,
  preload = false,
  quality = 80,
  night = true,
  position,
}: {
  photo: PhotoData;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  quality?: number;
  night?: boolean;
  position?: string;
}) {
  // le conteneur est positionné (requis par `fill`), sauf s'il l'est déjà par className
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className ?? "");
  return (
    <div className={cn(!positioned && "relative", "overflow-hidden bg-tint", night && "photo-nuit", className)}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        quality={quality}
        preload={preload}
        placeholder="blur"
        blurDataURL={photo.blurDataURL}
        className={cn("object-cover", imgClassName)}
        style={{ objectPosition: position ?? photo.position ?? "50% 50%" }}
      />
    </div>
  );
}
