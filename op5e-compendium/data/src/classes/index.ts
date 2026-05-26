import type { ClassItem } from "../../schemas/class.js";
import { fighter } from "./fighter.js";
import { rogue } from "./rogue.js";
import { barbarian } from "./barbarian.js";
import { bard } from "./bard.js";
import { brawler } from "./brawler.js";
import { marksman } from "./marksman.js";
import { gadgeteer } from "./gadgeteer.js";
import { medic } from "./medic.js";
import { savant } from "./savant.js";

export const items: ClassItem[] = [
  fighter,
  rogue,
  barbarian,
  bard,
  brawler,
  marksman,
  gadgeteer,
  medic,
  savant,
];
export default items;
