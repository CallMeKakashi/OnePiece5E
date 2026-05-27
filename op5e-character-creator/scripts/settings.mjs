export const MODULE_ID = "op5e-character-creator";

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
  DRAFTS: "drafts"
};

export function registerSettings() {
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

