// SeaBeast Hermit Crab (Bessy Jr.): Gargantuan CR 5 sea beast, fully custom (no sea king stat block exists in the compendium or sourcebook). Built 2026-10-11.
import { writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const DC = 16;
const IMG = "one-piece-5e/npcs/Sea Beasts/hermit-crab-new.jpg";
const TOKEN = "one-piece-5e/npcs/Sea Beasts/hermit-crab-new-token.png";
type O = { actionType?: string; activation: { type: string; cost: number | null; condition?: string }; damage?: [string, string][]; save?: { ability: string; dc: number };
  range?: { value: number | null; units: string }; target?: { value: number | null; width?: number | null; units: string; type: string }; uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean }; recharge?: number };
const feat = (slug: string, name: string, img: string, description: string, o: O): FeatureItem => ensureFeatureActivities({
  _id: generateId(`homebrew/hermit-crab/${slug}`), name, type: "feat", img,
  system: {
    description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "monster", subtype: "" }, requirements: "",
    activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" }, duration: { value: null, units: "" },
    target: o.target ?? { value: null, width: null, units: "", type: "" }, range: o.range ?? { value: 10, long: null, units: "ft" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" }, save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
    chatFlavor: "", recharge: { value: o.recharge ?? null, charged: !!o.recharge },
  },
  effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem);

const multiattack = feat("multiattack", "Multiattack", "icons/skills/melee/strike-slashes-orange.webp", "<p>The hermit crab makes two attacks: one with its pincer and one with its claw.</p>", { activation: { type: "action", cost: 1 } });
const pincer = feat("pincer", "Pincer", "icons/creatures/claws/pincer-crab-brown.webp", `<p><em>Melee Weapon Attack:</em> +8 to hit, reach 10 ft., one target. <em>Hit:</em> 3d10 + 5 bludgeoning damage. The target is grappled (escape DC ${DC}). Until this grapple ends, the target is restrained and the crab can't use its pincer on another target.</p>`,
  { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["3d10 + 5", "bludgeoning"]], range: { value: 10, units: "ft" } });
const claw = feat("claw", "Claw", "icons/creatures/claws/claw-talons-glowing-orange.webp", `<p><em>Melee Weapon Attack:</em> +8 to hit, reach 10 ft., one target. <em>Hit:</em> 2d8 + 5 bludgeoning damage. If the target is a creature, it makes a DC ${DC} Strength saving throw or is knocked prone.</p>`,
  { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["2d8 + 5", "bludgeoning"]], range: { value: 10, units: "ft" } });
const crush = feat("crush", "Crush", "icons/magic/control/silhouette-grow-shrink-tan.webp", `<p>Against a creature it has grappled, the crab crushes: the target makes a DC ${DC} Strength saving throw, taking 4d8 + 5 bludgeoning damage on a failed save, or half as much on a success. A Medium or smaller creature that fails is pulled against the crab's body and has disadvantage on checks to escape the grapple until the start of its next turn.</p>`,
  { actionType: "save", activation: { type: "bonus", cost: 1, condition: "A creature is grappled by its pincer" }, save: { ability: "str", dc: DC }, damage: [["4d8 + 5", "bludgeoning"]], range: { value: 10, units: "ft" } });
const retreat = feat("shell-retreat", "Shell Retreat", "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp", "<p>Bonus action. The crab pulls its limbs into its salvaged shell. Until the start of its next turn its AC is 19, its speed is 0, and it can't make attacks.</p>",
  { activation: { type: "bonus", cost: 1 }, range: { value: null, units: "self" } });
const salvaged = feat("salvaged-shell", "Salvaged Shell", "icons/environment/wilderness/cave-entrance-rocky.webp", "<p>The crab wears an oversized salvaged shell (a circus big top, wreck hull or reef detritus). It has resistance to bludgeoning, piercing and slashing damage from nonmagical attacks while the shell is intact, and Medium or smaller creatures can shelter inside it with total cover.</p>", { activation: { type: "special", cost: null } });
const amphibious = feat("amphibious", "Amphibious", "icons/magic/water/wave-water-blue.webp", "<p>The crab can breathe air and water, and can hold its breath for 30 minutes.</p>", { activation: { type: "special", cost: null } });

const items = [multiattack, pincer, claw, crush, retreat, salvaged, amphibious];
const actor = {
  name: "SeaBeast - Hermit Crab", type: "npc", img: IMG,
  system: {
    abilities: { str: { value: 21, proficient: 1 }, dex: { value: 9, proficient: 0 }, con: { value: 17, proficient: 1 }, int: { value: 2, proficient: 0 }, wis: { value: 10, proficient: 0 }, cha: { value: 7, proficient: 0 } },
    attributes: { prof: 3, ac: { calc: "flat", flat: 17 }, hp: { value: 160, max: 160, temp: 0, tempmax: 0, formula: "17d20 - 17" }, movement: { walk: 30, swim: 50, units: "ft" },
      senses: { ranges: { darkvision: 60, blindsight: 30 }, units: "ft" } },
    details: { cr: 5, type: { value: "beast", subtype: "sea beast" }, alignment: "unaligned", source: { book: "Blood & Brine homebrew", custom: "SeaBeast - Hermit Crab" },
      biography: { value: "<p>Bessy Jr.: an infant sea beast hermit crab, raised as the pet and living vessel of Bessy Sr. (Bubbles D. Clown), rescued by Midori.</p><p><strong>Balance note (CR 5):</strong> HP is the legacy 160 (the DMG CR 5 band is 131-145). Built by hand: neither the compendium nor the sourcebook has a sea king stat block. The legacy sheet was a Giant Crocodile copy.</p>" } },
    traits: { size: "grg", dr: { value: [], custom: "" }, languages: { value: [], custom: "" } },
    skills: { ste: { value: 0, ability: "dex" } },
  },
  prototypeToken: { name: "SeaBeast - Hermit Crab", texture: { src: TOKEN }, width: 4, height: 4, actorLink: false, disposition: 0 },
  items, effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
writeFileSync("../Foundry/actors-json/hermit-crab.json", JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote hermit-crab.json (${items.length} items)`);
