import type { Light, SeasonId } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────
   Ambiance : valeurs par défaut, calcul automatique et script inline.
   Le script s'exécute dans <head> avant le premier rendu : il pose
   data-season / data-light sur <html> pour que les couleurs soient
   justes dès la première image, sans flash.
   `autoAmbiance` et le script inline appliquent la même règle :
   toute modification de l'une doit être reportée dans l'autre.
   ────────────────────────────────────────────────────────────── */

export interface Ambiance {
  season: SeasonId;
  light: Light;
}

export const AMBIANCE_KEY = "maison-sillage:ambiance:v1";
export const DEFAULT_AMBIANCE: Ambiance = { season: "ete", light: "coucher" };
export const SEASON_IDS: SeasonId[] = ["printemps", "ete", "automne", "hiver"];
export const LIGHT_IDS: Light[] = ["jour", "coucher", "nuit"];

const SUNSET: Record<SeasonId, number> = { printemps: 20, ete: 21, automne: 18.5, hiver: 17 };
const SUNRISE: Record<SeasonId, number> = { printemps: 7, ete: 6, automne: 7.5, hiver: 8.3 };

/** Saison selon le mois, lumière selon l'heure locale (horaires moyens en France) */
export function autoAmbiance(now = new Date()): Ambiance {
  const m = now.getMonth();
  const season: SeasonId = m >= 2 && m <= 4 ? "printemps" : m >= 5 && m <= 7 ? "ete" : m >= 8 && m <= 10 ? "automne" : "hiver";
  const h = now.getHours() + now.getMinutes() / 60;
  const ss = SUNSET[season];
  const sr = SUNRISE[season];
  const light: Light = h >= sr + 0.5 && h < ss - 1.25 ? "jour" : (h >= ss - 1.25 && h < ss + 0.75) || (h >= sr - 0.75 && h < sr + 0.5) ? "coucher" : "nuit";
  return { season, light };
}

export const AMBIANCE_SCRIPT = `(function(){try{var d=document.documentElement,s=null;try{s=JSON.parse(localStorage.getItem("${AMBIANCE_KEY}")||"null")}catch(e){}
var S=["printemps","ete","automne","hiver"],L=["jour","coucher","nuit"],season="${DEFAULT_AMBIANCE.season}",light="${DEFAULT_AMBIANCE.light}",auto=false;
if(s&&S.indexOf(s.season)>-1&&L.indexOf(s.light)>-1){season=s.season;light=s.light;auto=!!s.auto}
if(auto){var n=new Date(),m=n.getMonth();season=m>=2&&m<=4?"printemps":m>=5&&m<=7?"ete":m>=8&&m<=10?"automne":"hiver";
var h=n.getHours()+n.getMinutes()/60,ss=${JSON.stringify(SUNSET)}[season],sr=${JSON.stringify(SUNRISE)}[season];
light=h>=sr+.5&&h<ss-1.25?"jour":(h>=ss-1.25&&h<ss+.75)||(h>=sr-.75&&h<sr+.5)?"coucher":"nuit"}
d.setAttribute("data-season",season);d.setAttribute("data-light",light);d.setAttribute("data-auto",auto?"1":"0");
if(season!=="${DEFAULT_AMBIANCE.season}"||light!=="${DEFAULT_AMBIANCE.light}")d.setAttribute("data-amb-custom","1")}catch(e){}})();`;

/** Écran d'ouverture : affiché à chaque chargement du document, en version courte après la première visite
 *  de la session ; jamais en mouvement réduit. Posé avant le premier rendu (aucun flash de la page dessous). */
export const INTRO_SCRIPT = `(function(){var d=document.documentElement;try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-intro","off");return}
d.setAttribute("data-intro","on");var k="maison-sillage:ouverture";if(sessionStorage.getItem(k))d.setAttribute("data-intro-court","");sessionStorage.setItem(k,"1")}catch(e){d.setAttribute("data-intro","on")}})();`;
