"use client";

import { useReducedMotion } from "@/lib/useReduced";
import { useState } from "react";
import { motion } from "motion/react";

/* La page qui arrive : sous la houle de <PageTransition>, elle monte doucement pendant que la vague
   passe (data-passage sur <html>). Navigation sans houle (retour arrière) : simple fondu.
   Au tout premier chargement, aucun masquage : le contenu est visible dès le HTML serveur. */

let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [mode] = useState<"none" | "passage" | "fondu">(() => {
    if (firstLoad) {
      firstLoad = false;
      return "none";
    }
    return typeof document !== "undefined" && document.documentElement.hasAttribute("data-passage") ? "passage" : "fondu";
  });
  const play = mode !== "none" && !reduce;

  return (
    <motion.div
      initial={play ? (mode === "passage" ? { opacity: 0, y: 70 } : { opacity: 0 }) : false}
      animate={{ opacity: 1, y: 0 }}
      transition={mode === "passage" ? { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.38 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    >
      {children}
    </motion.div>
  );
}
