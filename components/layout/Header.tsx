"use client";

import { useReducedMotion } from "@/lib/useReduced";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Search, ShoppingBag, Menu } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo, Emblem } from "@/components/ui/Logo";
import { EASE } from "@/components/animations";
import { AmbianceControl } from "@/components/ambiance/AmbianceControl";
import { MobileMenu } from "./MobileMenu";
import { AddedNotice } from "@/components/cart/AddedNotice";

const LEFT = mainNav.slice(0, 4);
const RIGHT = mainNav.slice(4);

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className="lien-revele whitespace-nowrap font-serif text-[1.02rem] leading-none tracking-[0.01em] opacity-90 transition-opacity hover:opacity-100 2xl:text-[1.08rem]">
      {label}
    </Link>
  );
}

/**
 * En-tête : transparent sur la photographie d'accueil (texte clair, logo
 * complet), il se transforme au défilement en bandeau compact et opaque
 * (emblème, couleurs de l'ambiance).
 */
export function Header() {
  const pathname = usePathname();
  const { count, ready, favorites, setDrawerOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const overPhoto = isHome && !scrolled;
  // pas de « display » ici : chaque bouton choisit le sien (grid, ou hidden sm:grid), sans conflit de classes
  const iconBtn = cn("h-11 w-11 place-items-center rounded-full transition duration-300", overPhoto ? "hover:bg-creme/10" : "hover:bg-ink/5");

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-paper focus:px-4 focus:py-2">
        Aller au contenu
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,backdrop-filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
          overPhoto ? "bg-transparent text-creme" : "bg-[var(--a-header)] text-ink shadow-[0_1px_0_var(--a-line)] backdrop-blur-xl",
        )}
      >
        <div className="shell relative flex h-[var(--header-h)] items-center justify-between">
          <button
            type="button"
            className={cn("-ml-2 grid xl:hidden", iconBtn)}
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>

          <nav aria-label="Navigation principale, première partie" className="hidden flex-1 items-center gap-5 xl:flex 2xl:gap-8">
            {LEFT.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </nav>

          {/* logo : complet sur la photographie d'accueil, emblème ensuite */}
          <Link
            href="/"
            aria-label="Maison Sillage, accueil"
            className="absolute left-1/2 top-0 flex h-[var(--header-h)] w-[92px] -translate-x-1/2 items-center justify-center sm:w-[112px] xl:w-[140px]"
          >
            <motion.div
              className="absolute inset-x-0 top-0 pt-2.5"
              initial={isHome && !reduce ? { opacity: 0, y: -14, scale: 0.96 } : false}
              animate={overPhoto ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -24, scale: 0.86 }}
              transition={{ duration: overPhoto ? 1.1 : 0.6, ease: EASE, delay: overPhoto && isHome ? 0.2 : 0 }}
              style={{ pointerEvents: overPhoto ? "auto" : "none", transformOrigin: "top center" }}
            >
              <Logo tone="sombre" preload sizes="(min-width:1280px) 140px, 112px" className="drop-shadow-[0_2px_14px_rgba(20,10,4,.45)]" />
            </motion.div>
            <motion.div
              className="w-[40px] xl:w-[44px]"
              initial={false}
              animate={overPhoto ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              aria-hidden
            >
              <span className="sauf-nuit block">
                <Emblem sizes="44px" />
              </span>
              <span className="si-nuit">
                <Emblem tone="sombre" sizes="44px" />
              </span>
            </motion.div>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-5 2xl:gap-8">
            <nav aria-label="Navigation principale, seconde partie" className="hidden items-center gap-5 xl:flex 2xl:gap-8">
              {RIGHT.map((l) => (
                <NavLink key={l.href} {...l} />
              ))}
            </nav>
            <span className={cn("hidden h-5 w-px xl:block", overPhoto ? "bg-creme/30" : "bg-line")} aria-hidden />
            <div className="-mr-2 flex items-center gap-0.5">
              <AmbianceControl tone={overPhoto ? "photo" : "page"} />
              <button type="button" onClick={() => setSearchOpen(true)} className={cn("hidden sm:grid", iconBtn)} aria-label="Rechercher">
                <Search className="h-[19px] w-[19px]" strokeWidth={1.4} />
              </button>
              <Link
                href="/favoris"
                className={cn("relative hidden sm:grid", iconBtn)}
                aria-label={`Favoris${ready && favorites.length ? ` (${favorites.length})` : ""}`}
              >
                <Heart className="h-[19px] w-[19px]" strokeWidth={1.4} />
                {ready && favorites.length > 0 && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />}
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className={cn("relative grid", iconBtn)}
                  data-cart-target
                  aria-label={`Panier, ${ready ? count : 0} article${count > 1 ? "s" : ""}`}
                >
                  <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.4} />
                  <AnimatePresence>
                    {ready && count > 0 && (
                      <motion.span
                        key={count}
                        initial={reduce ? false : { scale: 0.3, opacity: 0, y: -6 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 520, damping: 20 }}
                        className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold tabular-nums text-[#1a120b]"
                      >
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <AddedNotice />
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
