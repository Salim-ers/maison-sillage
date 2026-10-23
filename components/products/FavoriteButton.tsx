"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Favori conservé dans le navigateur. Variante icône : pastille ronde, cœur centré au pixel près. */
export function FavoriteButton({ slug, name, className, withLabel = false }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const { isFavorite, toggleFavorite, ready } = useStore();
  const on = ready && isFavorite(slug);
  const reduce = useReducedMotion();
  const heart = (
    <motion.span
      key={String(on)}
      className="block leading-none"
      initial={reduce ? false : { scale: on ? 0.55 : 1 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
    >
      <Heart className={cn("block h-[18px] w-[18px]", on ? "fill-espresso text-espresso" : "text-espresso")} strokeWidth={1.4} aria-hidden />
    </motion.span>
  );
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `Retirer ${name} des favoris` : `Ajouter ${name} aux favoris`}
      className={cn(
        withLabel
          ? "inline-flex items-center gap-2 text-sm"
          : "grid h-10 w-10 place-items-center rounded-full bg-creme/95 shadow-[0_4px_14px_-6px_rgba(20,12,6,.35)] transition-colors hover:bg-creme",
        className,
      )}
    >
      {withLabel ? (
        <>
          <span className="grid h-5 w-5 place-items-center">{heart}</span>
          <span className="underline-offset-4 hover:underline">{on ? "Dans vos favoris" : "Ajouter aux favoris"}</span>
        </>
      ) : (
        heart
      )}
    </button>
  );
}
