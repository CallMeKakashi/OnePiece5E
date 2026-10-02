import { readFileSync, writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const CHASSIS_PATH = "../Foundry/actors-json/rhum-chassis.json";
const OUT_PATH = "../Foundry/actors-json/rhum.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

function homebrewFeat(idPath: string, name: string, img: string, description: string, options: {
  actionType?: string;
  activation: { type: string; cost: number | null; condition?: string };
  damage?: [string, string][];
  save?: { ability: string; dc: number | null };
  attack?: { ability: string; bonus: string };
  uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
}): FeatureItem {
  const item: FeatureItem = {
    _id: generateId(idPath),
    name, type: "feat", img,
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e (Logia Type, Chapter 6) + homebrew fruit-specific attacks", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "",
      activation: { type: options.activation.type, cost: options.activation.cost, condition: options.activation.condition ?? "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: 60, long: null, units: "ft" },
      uses: options.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: options.actionType ?? "",
      damage: { parts: options.damage ?? [], versatile: "" },
      save: options.save ? { ability: options.save.ability, dc: options.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
  return ensureFeatureActivities(item);
}

// --- Ink-Ink Fruit (Logia), built from the real Sourcebook Logia Type rules
// (Sourcebook/Chapter 6 Devil Fruits/Logia Type) rather than invented from
// scratch. At level 15 he has: base Elemental Domain, Improved Elemental
// Domain tier 1 (5th, 10-min duration), tier 2 (10th, passive immunity to
// unimbued B/P/S + active-effects cap = prof bonus), and tier 3 (15th,
// reaction to gain resistance to one imbued damage source). Fruit Uses at
// level 15 = 8 (from the class table). Fruit DC = 8 + prof + CHA mod
// = 8 + 5 + 5 = 18.
const elementalDomain = homebrewFeat(
  "homebrew/rhum/elemental-domain",
  "Ink-Ink Fruit: Elemental Domain",
  "icons/consumables/potions/vial-ornet-silver-black.webp",
  `<p><em>Logia — Ink-Ink Fruit. Fruit Uses: 8 (regain all on long rest). Fruit DC 18.</em></p>
<p>Rhum has domain over ink. As an action, he can produce and manipulate a near-infinite quantity of ink.</p>
<p><strong>Passive immunity (Improved Elemental Domain, 10th tier).</strong> Rhum is passively immune to unimbued bludgeoning, piercing, and slashing damage at all times, even unconscious — this ignores Ocean's Scorn only when it applies. He can have a number of active devil fruit effects equal to his proficiency bonus (5).</p>
<p><strong>Ink Form (bonus action, 2/long rest, 10 minutes).</strong> Rhum transforms his body into flowing ink. For the duration: he is immune to poison damage; he cannot be grappled or restrained unless the source has Armament Haki or is an insulating material; he has advantage on Dexterity checks and saving throws; he can move through spaces as narrow as 1 inch wide without squeezing.</p>
<p><strong>Resist the Blow (reaction, 15th tier, costs 1 Fruit Use).</strong> When Rhum takes damage from a Haki-imbued or otherwise elemental-bypassing source, he can expend a Fruit Use to gain resistance to that instance of damage.</p>`,
  {
    activation: { type: "bonus", cost: 1 },
    uses: { value: 8, max: "8", per: "lr", recovery: "", prompt: true },
  },
);

const inkBlast = homebrewFeat(
  "homebrew/rhum/ink-blast",
  "Ink Blast",
  "icons/magic/water/orb-water-bubbles.webp",
  "<p>Action. Rhum hurls a concentrated blast of hardened ink at a target within 60 feet. Ranged Weapon Attack, +10 to hit. Hit: 9d10 + 35 poison damage as the ink corrodes and stains everything it touches.</p>",
  {
    actionType: "rwak",
    activation: { type: "action", cost: 1 },
    damage: [["9d10 + 35", "poison"]],
    attack: { ability: "cha", bonus: "10" },
  },
);

const inkLash = homebrewFeat(
  "homebrew/rhum/ink-lash",
  "Ink Lash",
  "icons/magic/water/projectile-arrow-water-ice-blue.webp",
  "<p>Bonus action. A whip-like tendril of ink lashes out at a target within 15 feet. Melee Weapon Attack, +10 to hit. Hit: 5d10 + 25 poison damage, and the target must succeed on a DC 18 Constitution saving throw or be blinded until the end of its next turn as ink covers its eyes.</p>",
  {
    actionType: "mwak",
    activation: { type: "bonus", cost: 1 },
    damage: [["5d10 + 25", "poison"]],
    save: { ability: "con", dc: 18 },
    attack: { ability: "cha", bonus: "10" },
  },
);

// --- Legendary actions / resistance ---
const legendaryHeader = homebrewFeat(
  "homebrew/rhum/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Rhum can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);
const legendaryResistance = homebrewFeat(
  "homebrew/rhum/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Rhum fails a saving throw, he can choose to succeed instead.</p>",
  { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true } },
);
const legendaryMove = homebrewFeat(
  "homebrew/rhum/legendary-move",
  "Move (Legendary Action)",
  "icons/skills/movement/feet-winged-boots-blue.webp",
  "<p>Costs 1 legendary action. Rhum moves up to his speed without provoking opportunity attacks.</p>",
  { activation: { type: "legendary", cost: 1 } },
);
const legendaryLash = homebrewFeat(
  "homebrew/rhum/legendary-lash",
  "Ink Lash (Legendary Action)",
  "icons/magic/water/projectile-arrow-water-ice-blue.webp",
  "<p>Costs 1 legendary action. Rhum makes one Ink Lash attack.</p>",
  { activation: { type: "legendary", cost: 1 } },
);

chassis.items.push(elementalDomain, inkBlast, inkLash, legendaryHeader, legendaryResistance, legendaryMove, legendaryLash);
chassis.system.resources = {
  legact: { value: 2, max: 2 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- Fix known build-actor.ts gaps: weaponProf/armorProf/saves + equip ---
chassis.system.attributes.prof = 5; // Savant 15
chassis.system.traits.armorProf = { value: ["lgt", "med", "hvy", "shl"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
chassis.system.abilities.wis.proficient = 1;
chassis.system.abilities.cha.proficient = 1;
for (const it of chassis.items as { name: string; type: string; system: Record<string, unknown> }[]) {
  if (it.type === "equipment" && (it.name === "Heavy Longcoat" || it.name === "Shield")) it.system.equipped = true;
}

// --- Mandatory CR-balance pass (SKILL.md step 4) ---
// Real numbers before this pass: HP 139 (15d10+45), AC 18 once equipped
// (14 longcoat + DEX 2 + shield 2 — already at target with no stat changes
// needed), attack bonus +10 (prof 5 + CHA 5, already above the ~+9 CR-12
// target), no in-kit DPR at all before the hand-authored fruit attacks
// above (Ink Blast + Ink Lash together ~= 84.5 + 52.5 = 137 dpr, in the
// CR-12 band). Fruit DC 18 also lands at the CR-12 target. HP is the one
// number below the DMG CR-12 defensive band (~161-175); raising CON further
// is reasonable here (unlike the Brawler NPCs, a level-15 chassis has more
// hit dice to work with), so bumping it in the spec instead of overriding.
chassis.system.details.cr = 12;

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
