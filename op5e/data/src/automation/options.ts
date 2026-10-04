import { generateId } from "../../helpers/id.js";
import type { Spec } from "../../helpers/spec.js";
import type { FeatureItem } from "../../schemas/feature.js";

// Option lists that used to exist only as text inside their parent feature, split into separate option features
// (Marksman Deft Explorer: Canny / Roving / Tireless; Brawler Spirit: Flurry of Blows / Patient Defense / Deft Escape).
// The features are registered in class-features/index.ts (optionFeatures); the specs in automation/index.ts (optionSpecs).
// Marksman picks them with ItemChoice at 1/6/10 (classes/marksman.ts); Brawler is granted all three at 2 (classes/brawler.ts).

function option(idPath: string, name: string, requirements: string, description: string): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements,
      activation: { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

const DE = "feature/marksman/deft-explorer";
export const canny = option(`${DE}/canny`, "Canny", "Marksman 1",
  `<p>Choose two of your skill proficiencies. You gain expertise with the chosen skills.</p><p>In addition, thanks to your extensive wandering, you can no longer get lost by natural means.</p>`);
export const roving = option(`${DE}/roving`, "Roving", "Marksman 1",
  `<p>Your walking speed increases by 10, and you gain a climbing speed and a swimming speed equal to your walking speed.</p>`);
export const tireless = option(`${DE}/tireless`, "Tireless", "Marksman 1",
  `<p>As a bonus action, you can give yourself a number of temporary hit points equal to 1d10 + your level. You can use this ability a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest.</p><p>In addition, whenever you finish a short rest, your exhaustion level, if any, is decreased by 1.</p>`);

const SP = "feature/brawler/spirit";
export const flurryOfBlows = option(`${SP}/flurry-of-blows`, "Flurry of Blows", "Brawler 2",
  `<p>Immediately after you take the Attack action on your turn, you can spend 1 spirit point to make two unarmed strikes as a bonus action.</p>`);
export const patientDefense = option(`${SP}/patient-defense`, "Patient Defense", "Brawler 2",
  `<p>You can spend 1 spirit point to take the Dodge action as a bonus action on your turn.</p>`);
export const deftEscape = option(`${SP}/deft-escape`, "Deft Escape", "Brawler 2",
  `<p>While you are grappled, you can spend 1 spirit point to attempt to escape a grapple or restraints as a bonus action.</p>`);

export const deftExplorerOptions = [canny, roving, tireless];
export const spiritOptions = [flurryOfBlows, patientDefense, deftEscape];
export const optionFeatures: FeatureItem[] = [...deftExplorerOptions, ...spiritOptions];

const SPIRIT_NOTE = "Costs 1 spirit point: reduce the Spirit feature's uses by 1 (the cost is not linked automatically).";

export const optionSpecs: Record<string, Spec> = {
  "class-features/Roving": {
    activities: [],
    extraEffects: [{
      name: "Roving", transfer: true,
      changes: [
        { key: "system.attributes.movement.walk", mode: 2, value: "10" },
        { key: "system.attributes.movement.climb", mode: 4, value: "@attributes.movement.walk" },
        { key: "system.attributes.movement.swim", mode: 4, value: "@attributes.movement.walk" },
      ],
    }],
  },
  "class-features/Tireless": {
    uses: { max: "@prof", per: "sr" },
    activities: [{
      name: "Tireless", type: "heal", activation: "bonus", consumeUse: true,
      healing: { formula: "1d10 + @classes.marksman.levels", type: "temp" },
      note: "Whenever you finish a short rest, your exhaustion level, if any, is decreased by 1.",
    }],
  },
  "class-features/Flurry of Blows": {
    activities: [{ name: "Flurry of Blows", type: "utility", activation: "bonus", note: `Immediately after you take the Attack action: make two unarmed strikes. ${SPIRIT_NOTE}` }],
  },
  "class-features/Patient Defense": {
    activities: [{
      name: "Patient Defense", type: "utility", activation: "bonus", duration: { value: 1, units: "round" },
      effects: [{ name: "Dodging", statuses: ["dodging"], rounds: 1 }], note: SPIRIT_NOTE,
    }],
  },
  "class-features/Deft Escape": {
    activities: [{ name: "Deft Escape", type: "utility", activation: "bonus", note: `While grappled: attempt to escape a grapple or restraints. ${SPIRIT_NOTE}` }],
  },
};
