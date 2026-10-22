import { Hero } from "@/components/home/Hero";
import { Monde } from "@/components/home/Monde";
import { Creations } from "@/components/home/Creations";
import { Saisons } from "@/components/home/Saisons";
import { Histoire } from "@/components/home/Histoire";
import { Usages } from "@/components/home/Usages";
import { Signatures } from "@/components/home/Signatures";
import { Poudres } from "@/components/home/Poudres";
import { ProTeaser } from "@/components/home/ProTeaser";

/* L'accueil se lit comme une traversée : le large, la Maison, les créations,
   les saisons, l'histoire, les usages, la boutique, la poudre, les professionnels. */
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
      <Histoire />
      <Usages />
      <Signatures />
      <Poudres />
      <ProTeaser />
    </>
  );
}
