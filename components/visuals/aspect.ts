/* Partagé serveur / client : classes de ratio des emplacements visuels */
export const aspectClass: Record<"16:9" | "21:9" | "4:5" | "3:4" | "1:1" | "9:16" | "3:2", string> = {
  "16:9": "aspect-[16/9]",
  "21:9": "aspect-[21/9]",
  "4:5": "aspect-[4/5]",
  "3:4": "aspect-[3/4]",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
  "3:2": "aspect-[3/2]",
};
