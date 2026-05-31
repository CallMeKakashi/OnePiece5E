import { MODULE_ID } from "./constants.mjs";
import {
  applyGrantQuantitiesToItems,
  collectGrantQuantitiesFromManager,
} from "./equipment-grant-advancement-lib.mjs";

/**
 * @param {object} manager
 * @param {object} _actorUpdates
 * @param {object[]} toCreate
 */
function onPreAdvancementManagerComplete(manager, _actorUpdates, toCreate, toUpdate) {
  const quantities = collectGrantQuantitiesFromManager(manager);
  applyGrantQuantitiesToItems([toCreate, toUpdate], quantities);
}

export function registerOp5eEquipmentGrantHooks() {
  Hooks.on("dnd5e.preAdvancementManagerComplete", onPreAdvancementManagerComplete);
  console.log(`${MODULE_ID} | equipment grant quantity hooks registered`);
}
