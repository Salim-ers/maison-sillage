"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X, Heart, Search } from "lucide-react";
import { mainNav, footerNav } from "@/data/navigation";
import { useDialog } from "@/lib/useDialog";
import { useStore } from "@/lib/store";
import { Emblem } from "@/components/ui/Logo";
import { EASE, HOULE } from "@/components/animations";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useDialog<HTMLDivElement>(open, onClose);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { setSearchOpen, favorites, ready } = useStore();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-page text-ink xl:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.7, ease: HOULE }}
        >
          <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <button type="button" onClick={onClose} className="-ml-2 grid h-11 w-11 place-items-center rounded-full" aria-label="Fermer le menu" data-autofocus>
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <div className="w-10">
              <span className="sauf-nuit block">
                <Emblem sizes="44px" />
              </span>
              <span className="si-nuit">
                <Emblem tone="sombre" sizes="44px" />
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setSearchOpen(true);
              }}
              className="-mr-2 grid h-11 w-11 place-items-center rounded-full"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>

          <nav aria-label="Menu principal" className="shell mt-4 flex-1">
            <ul>
              {[{ href: "/", label: "Accueil" }, ...mainNav].map((l, i) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <motion.li
                    key={l.href}
                    initial={reduce ? false : { opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.16 + i * 0.045 }}
                    className="border-b border-line"
                  >
                    <Link href={l.href} className="group flex items-baseline justify-between py-3.5" aria-current={active ? "page" : undefined}>
                      <span className={`font-serif text-[2.1rem] leading-none transition-transform duration-500 group-active:translate-x-1 ${active ? "italic text-accent-ink" : ""}`}>{l.label}</span>
                      <span className="font-serif text-sm italic text-muted">{String(i + 1).padStart(2, "0")}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <motion.div
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ink-2"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link href="/favoris" className="flex items-center gap-2">
                <Heart className="h-4 w-4" strokeWidth={1.4} /> Favoris{ready && favorites.length ? ` (${favorites.length})` : ""}
              </Link>
              {[footerNav.maison[2], footerNav.maison[4], footerNav.aide[3]].map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </motion.div>
          </nav>
          <p className="shell py-8 font-serif text-lg italic text-accent-ink">L&apos;empreinte d&apos;une saveur.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
