import { MODULE_ID } from "./constants.mjs";
export { MODULE_ID } from "./constants.mjs";

/**
 * World-side draft storage.
 *
 * Shape:
 * {
 *   [draftId]: {
 *     id, ownerUserId, createdAt, updatedAt,
 *     actorKind: "pc"|"npc",
 *     step,
 *     data: { ...wizard fields... },
 *     touched: { [path]: true }   // wizard-owned changes (for Reset eligibility)
 *   }
 * }
 */
export const SETTINGS = {
  DRAFTS: "drafts",
  SHOW_CREATOR: "showCharacterCreator"
};

export function registerSettings() {
  // Worlds that are not One Piece games (for example Drathmir) can turn the Actors sidebar "Create OPC" button off and use Foundry's own creator.
  game.settings.register(MODULE_ID, SETTINGS.SHOW_CREATOR, {
    name: "op5e.settings.showCharacterCreator.name",
    hint: "op5e.settings.showCharacterCreator.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      document.querySelectorAll(".op5e-cc-launch").forEach((b) => b.remove());
      ui.actors?.render?.();
    }
  });

  game.settings.register(MODULE_ID, SETTINGS.DRAFTS, {
    name: "OP5e Character Creator Drafts",
    hint: "World-side storage for in-progress character creator drafts.",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
}

export function getAllDrafts() {
  return foundry.utils.duplicate(game.settings.get(MODULE_ID, SETTINGS.DRAFTS) ?? {});
}

export async function setAllDrafts(drafts) {
  return game.settings.set(MODULE_ID, SETTINGS.DRAFTS, drafts ?? {});
}

