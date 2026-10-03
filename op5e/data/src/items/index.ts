import type { FoundryItem } from "../../schemas/common.js";
import { assignIcons } from "../../helpers/icons.js";
import { weapons } from "./weapons.js";
import { armorItems } from "./armor.js";
import { gear } from "./gear.js";
import { tools } from "./tools.js";
import { magicItems } from "./magic-items.js";
import { shipRooms } from "./ship-rooms.js";
import { shipUpgrades } from "./ship-upgrades.js";
import { provisions } from "./provisions.js";
import { applySpecialGear } from "./special-gear.js";
import { originGear } from "./origin-gear.js";

export const items: FoundryItem[] = assignIcons([
  ...weapons,
  ...armorItems,
  ...gear,
  ...tools,
  ...applySpecialGear(magicItems),
  ...shipRooms,
  ...shipUpgrades,
  ...provisions,
  ...originGear,
]);

export default items;
