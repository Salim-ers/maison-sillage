import { Hero } from "@/components/home/Hero";
import { Monde } from "@/components/home/Monde";
import { Creations } from "@/components/home/Creations";
import { Saisons } from "@/components/home/Saisons";
import { Essentiels } from "@/components/home/Essentiels";
import { Atelier } from "@/components/home/Atelier";
import { Comptoir } from "@/components/editorial/Comptoir";
import { ProTeaser } from "@/components/home/ProTeaser";
import { Histoire } from "@/components/home/Histoire";

/* L'accueil se lit comme une traversée : le large, l'univers de la Maison, les saveurs signatures,
   les quatre saisons, les Essentiels, l'Atelier, le Comptoir des Saveurs, les professionnels, l'histoire. */
export default function Accueil() {
  return (
    <>
      {/* le hero reste épinglé pendant que la section suivante vient le recouvrir */}
      <div className="relative">
        <Hero />
        <Monde />
      </div>
      <Creations />
      <Saisons />
      <Essentiels />
      <Atelier />
      <Comptoir id="comptoir" />
      <ProTeaser />
      <Histoire />
    </>
  );
}
