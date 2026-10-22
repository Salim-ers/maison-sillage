import { Hero } from "@/components/home/Hero";
import { Univers } from "@/components/home/Univers";
import { Sirops } from "@/components/home/Sirops";
import { Poudres } from "@/components/home/Poudres";
import { Saisons } from "@/components/home/Saisons";
import { Signatures } from "@/components/home/Signatures";
import { Usages } from "@/components/home/Usages";
import { Inspirations } from "@/components/home/Inspirations";
import { ProTeaser } from "@/components/home/ProTeaser";
import { Lettre } from "@/components/home/Lettre";
import { SillageThread } from "@/components/home/SillageThread";

export default function Accueil() {
  return (
    <>
      <Hero />
      <SillageThread>
        <Univers />
        <Sirops />
        <Poudres />
        <Saisons initial="automne" />
        <Signatures />
        <Usages />
        <Inspirations />
        <ProTeaser />
        <Lettre />
      </SillageThread>
    </>
  );
}
