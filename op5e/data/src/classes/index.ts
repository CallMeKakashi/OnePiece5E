import type { ClassItem } from "../../schemas/class.js";
import { classStartingEquipmentGrantQuantities } from "./class-equipment-grants.js";
import { fighter } from "./fighter.js";
import { rogue } from "./rogue.js";
import { barbarian } from "./barbarian.js";
import { bard } from "./bard.js";
import { brawler } from "./brawler.js";
import { marksman } from "./marksman.js";
import { gadgeteer } from "./gadgeteer.js";
import { medic } from "./medic.js";
import { savant } from "./savant.js";

function withEquipmentFlags(cls: ClassItem): ClassItem {
  const grantQuantities = classStartingEquipmentGrantQuantities(cls.system.identifier);
  if (!Object.keys(grantQuantities).length) return cls;
  return {
    ...cls,
    flags: {
      ...cls.flags,
      op5e: { ...(cls.flags?.op5e as Record<string, unknown> | undefined), grantQuantities },
    },
  };
}

const rawItems: ClassItem[] = [
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

export const items: ClassItem[] = rawItems.map(withEquipmentFlags);
export default items;
