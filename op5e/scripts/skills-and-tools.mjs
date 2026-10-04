import { MODULE_ID } from "./constants.mjs";

// Appendix B, Suggested Rulings, "Skills and Tools": "You can use a tool check in place of a skill check ... If a creature has both
// proficiency in a skill and a tool, it can make the tool check with advantage. This also functions with Expertise."
//
// What dnd5e 5.1.10 exposes (verified in systems/dnd5e/dnd5e.mjs, Actor5e#rollSkillTool):
//  - actor.rollToolCheck({ tool, ability?, skill?, ... }) builds the roll. A tool check is NOT tied to a skill by default: the roll
//    dialog only lets the player pick the ability. If the caller passes config.skill and the actor is proficient in both that skill and
//    the tool, dnd5e itself adds one advantage source ("doubleProf"); nothing else pairs a tool with a skill.
//  - Hooks fired before the dialog: dnd5e.preRollToolV2(config, dialog, message) (plus preRollAbilityCheckV2 / preRollD20TestV2 / preRollV2).
//    config.subject is the actor, config.tool the tool id, config.advantage / config.disadvantage the booleans the dialog starts from.
//  - Proficiency: actor.system.tools[id].value and actor.system.skills[id].value are 0 / 0.5 / 1 (proficient) / 2 (expertise).
//
// Because dnd5e does not say which skill a tool check replaces, the pairing is by ability: the check gets advantage when the actor is
// proficient (or has expertise) in the tool AND in at least one skill that uses the same ability the check is rolled with. A caller that
// passes config.skill pairs with exactly that skill (dnd5e's own rule already covers it). The ability is read when the dialog opens; if the
// player changes the ability in the dialog the advantage stays as it was. Disadvantage from other sources still cancels it, as normal.
// With the setting off the module adds nothing (dnd5e's own doubleProf for callers that pass a skill cannot be switched off from here).

export const SETTING = "toolSkillAdvantage";

/** true when the actor has the tool and a paired skill at proficiency or better */
export function toolSkillPaired(actor, config) {
  const tool = actor?.system?.tools?.[config.tool];
  if (!tool || !(tool.value >= 1)) return false;
  if (config.skill) return (actor.system.skills?.[config.skill]?.value ?? 0) >= 1;
  const ability = config.ability ?? tool.ability ?? CONFIG.DND5E.tools?.[config.tool]?.ability;
  return Object.values(actor.system.skills ?? {}).some((s) => s.value >= 1 && (!ability || s.ability === ability));
}

export function initSkillsAndTools() {
  game.settings.register(MODULE_ID, SETTING, {
    name: "Skills and Tools: advantage on tool checks",
    hint: "A creature proficient in a tool and in a skill that uses the same ability makes the tool check with advantage; Expertise counts (Appendix B, Skills and Tools).",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  Hooks.on("dnd5e.preRollToolV2", (config) => {
    if (!game.settings.get(MODULE_ID, SETTING)) return;
    if (!config?.tool || !toolSkillPaired(config.subject, config)) return;
    config.advantage = true;
  });
}
