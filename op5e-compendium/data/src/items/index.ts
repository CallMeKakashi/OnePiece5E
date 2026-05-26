import type { FoundryItem } from "../../schemas/common.js";
import { weapons } from "./weapons.js";
import { armorItems } from "./armor.js";
import { gear } from "./gear.js";
import { tools } from "./tools.js";
import { magicItems } from "./magic-items.js";

export const items: FoundryItem[] = [
  ...weapons,
  ...armorItems,
  ...gear,
  ...tools,
  ...magicItems,
];

export default items;
