import type { RaceItem } from "../../schemas/race.js";
import { assignIcons } from "../../helpers/icons.js";

import { human } from "./human.js";
import { fishman } from "./fishman.js";
import { mink } from "./mink.js";
import { giant } from "./giant.js";
import { skyIslander } from "./sky-islander.js";
import { dwarves } from "./dwarves.js";
import { merfolk } from "./merfolk.js";
import { lunarian } from "./lunarian.js";
import { augmented } from "./augmented.js";

export const items: RaceItem[] = assignIcons([
  human,
  fishman,
  mink,
  giant,
  skyIslander,
  dwarves,
  merfolk,
  lunarian,
  augmented,
]);
export default items;
