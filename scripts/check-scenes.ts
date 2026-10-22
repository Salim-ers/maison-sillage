// Vérifie qu'aucune composition visuelle n'est déclarée deux fois
import { allSceneKeys, recipeScenes } from "../data/media";
import { recipes } from "../data/recipes";
const keys = [...allSceneKeys(), ...recipes.flatMap((r) => Object.values(recipeScenes(r)).map((s) => s.key))];
const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
console.log(`${keys.length} compositions, ${new Set(keys).size} uniques`, dup.length ? `DOUBLONS: ${dup.join(", ")}` : "— aucun doublon");
