import { readFileSync, writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const IN_PATH = "../Foundry/actors-json/obsidian-first-mode.json";
const OUT_PATH = "../Foundry/actors-json/obsidian-overheated.json";

const actor = JSON.parse(readFileSync(IN_PATH, "utf-8"));

function homebrewFeat(idPath: string, name: string, img: string, description: string, itype: "feat" | "weapon", options: {
  actionType?: string;
  activation: { type: string; cost: number | null; condition?: string };
  damage?: [string, string][];
  save?: { ability: string; dc: number | null };
  attack?: { ability: string; bonus: string };
  uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
  target?: { value: number | null; units: string; type: string };
}): FeatureItem {
  const item: FeatureItem = {
    _id: generateId(idPath),
    name, type: itype, img,
    system: {
      description: { value: description, chat: "" },
      source: { book: "Blood & Brine homebrew — Conjure-Conjure Fruit (custom Paramecia, no Sourcebook equivalent)", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "",
      activation: { type: options.activation.type, cost: options.activation.cost, condition: options.activation.condition ?? "" },
      duration: { value: null, units: "" },
      target: options.target ?? { value: null, width: null, units: "", type: "" },
      range: { value: 15, long: null, units: "ft" },
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

// --- 1. Identity ---
actor.name = "Obsidian (Overheated)";
if (actor.prototypeToken) {
  actor.prototypeToken.name = "Obsidian (Overheated)";
  actor.prototypeToken.width = 3;
  actor.prototypeToken.height = 3;
}
actor.system.details.biography.value =
  "<p><em>Second Mode. GM note: swap to this actor/token when Obsidian transforms (automatically below half HP, or voluntarily as an action from First Mode). Carry over current HP as a percentage of max when swapping.</em></p><p>The armor expands outward alongside his body — additional plates unfold and lock into place across his torso, shoulders, arms, and legs, transforming him into something resembling a walking armored war machine. His right arm undergoes the most significant transformation: the greatsword merges directly into it, becoming an integrated weapon rather than something he carries. The glowing channels throughout his armor become far brighter and hotter, and the armor begins to radiate tremendous heat, venting steam from its seams and joints as internal machinery struggles to contain the rising temperature. This is when his Devil Fruit — the Conjure-Conjure Fruit — first manifests.</p>";

// --- 2. Size and defensive scaling — pushed to a CR 21-22 equivalent per
// explicit direction (above First Mode's CR 20). ---
actor.system.traits.size = "huge";
actor.system.attributes.hp.value = 340;
actor.system.attributes.hp.max = 340;
actor.system.attributes.hp.formula = "First Mode 20d10+120, armor-expansion overheat surge beyond the real class formula";
actor.system.attributes.ac.flat = 21;
actor.system.attributes.movement.walk = 40;

// --- 3. Remove First Mode's Greatsword + its legendary copy — replaced by
// the merged blade-arm and the fruit's conjured weapons below. ---
actor.items = actor.items.filter((i: { name: string }) =>
  i.name !== "Greatsword" && i.name !== "Greatsword Strike (Legendary Action)",
);

// --- 4. Merged Blade-Arm (replaces the carried Greatsword — now part of his
// body, can't be disarmed). Damage bumped further for the CR 21-22 target:
// real First Mode Greatsword alone was 5d10+33 (~242 dpr across 4 attacks);
// Second Mode's own attack is bumped again to push total round damage
// (blade-arm + Conjure Weapons below) into the higher CR 21-22 band. ---
const bladeArm = homebrewFeat(
  "homebrew/obsidian/blade-arm",
  "Merged Blade-Arm",
  "icons/weapons/swords/greatsword-crossguard-flanged-purple.webp",
  "<p>Obsidian's greatsword is now fused directly into his right arm — an extension of his body, not a weapon he carries, and cannot be disarmed or knocked away. Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 6d10 + 36 slashing damage.</p>",
  "weapon",
  { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["6d10 + 36", "slashing"]], attack: { ability: "str", bonus: "14" } },
);

// --- 5. Conjure-Conjure Fruit (Paramecia, custom — first manifests in
// Second Mode per explicit design). Personal multi-weapon attacks + a
// separate area/battlefield-control option, per your confirmed scope. ---
const fruitHeader = homebrewFeat(
  "homebrew/obsidian/conjure-conjure-fruit",
  "Devil Fruit: Conjure-Conjure Fruit",
  "icons/weapons/polearms/halberd-crescent-glowing.webp",
  "<p><em>Paramecia — Conjure-Conjure Fruit. Only manifests once Obsidian enters his Overheated (Second) form.</em></p><p>Obsidian can conjure Haki-infused bladed weapons — blades, halberds, lances, spears, and similar — out of thin air, from any surface within range, in any quantity, at any time. The weapons are solid and real for as long as he wills them to exist, then dissolve.</p>",
  "feat",
  { activation: { type: "", cost: null } },
);
const conjureWeapons = homebrewFeat(
  "homebrew/obsidian/conjure-weapons",
  "Conjure Weapons",
  "icons/weapons/polearms/halberd-crescent-glowing.webp",
  "<p>Action. Obsidian conjures up to three Haki-infused weapons (blades, halberds, lances, or spears) from the air or ground within 30 feet of himself, each immediately making one attack against a target within its reach. Melee Weapon Attack: +14 to hit, reach 10 ft. (halberd/lance/spear length), one target each. Hit: 3d10 + 20 piercing or slashing damage (Obsidian's choice per weapon).</p>",
  "weapon",
  { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["3d10 + 20", "slashing"]], attack: { ability: "str", bonus: "14" } },
);
const fieldOfBlades = homebrewFeat(
  "homebrew/obsidian/field-of-blades",
  "Field of Blades",
  "icons/weapons/polearms/halberd-engraved-black.webp",
  "<p>Action, once per short or long rest. Obsidian conjures a field of Haki-infused blades erupting from the ground in a 20-foot radius centered on a point he can see within 60 feet. Each creature in the area must make a DC 21 Dexterity saving throw, taking 8d10 piercing damage on a failed save, or half as much on a successful one. The conjured blades remain jutting from the ground for 1 minute, turning the area into difficult terrain.</p>",
  "feat",
  { actionType: "save", activation: { type: "action", cost: 1 }, save: { ability: "dex", dc: 21 }, damage: [["8d10", "piercing"]], uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true }, target: { value: null, units: "ft", type: "radius" } },
);

// --- 6. Heat/steam mechanic ---
const overheatingPlating = homebrewFeat(
  "homebrew/obsidian/overheating-plating",
  "Overheating Plating",
  "icons/magic/fire/flame-burning-embers-yellow.webp",
  "<p>Passive. The armor radiates tremendous heat. Whenever a creature hits Obsidian with a melee attack while within 5 feet of him, that creature takes 2d10 fire damage from the superheated plating.</p>",
  "feat",
  { activation: { type: "", cost: null } },
);
const steamVent = homebrewFeat(
  "homebrew/obsidian/steam-vent",
  "Steam Vent",
  "icons/magic/fire/orb-fireball-puzzle.webp",
  "<p>Reaction, which he can take when hit by an attack, once per turn. Obsidian vents a burst of superheated steam in a 15-foot radius centered on himself. Each creature in the area other than Obsidian must make a DC 21 Constitution saving throw, taking 4d10 fire damage and becoming blinded until the end of its next turn on a failed save, or taking half damage and not blinded on a success.</p>",
  "feat",
  { actionType: "save", activation: { type: "reaction", cost: 1, condition: "When hit by an attack, once per turn" }, save: { ability: "con", dc: 21 }, damage: [["4d10", "fire"]], target: { value: 15, units: "ft", type: "radius" } },
);

actor.items.push(bladeArm, fruitHeader, conjureWeapons, fieldOfBlades, overheatingPlating, steamVent);

// --- 7. Update legendary actions to match the new kit; bump resources for
// the higher CR-21/22 target (per your call on Second Mode's threat level). ---
actor.items = actor.items.filter((i: { name: string }) => i.name !== "Greatsword Strike (Legendary Action)");
const legendaryBladeArm = homebrewFeat(
  "homebrew/obsidian/legendary-blade-arm",
  "Blade-Arm Strike (Legendary Action)",
  "icons/weapons/swords/greatsword-crossguard-flanged-purple.webp",
  "<p>Costs 1 legendary action. Obsidian makes one Merged Blade-Arm attack.</p>",
  "weapon",
  { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [["6d10 + 36", "slashing"]], attack: { ability: "str", bonus: "14" } },
);
actor.items.push(legendaryBladeArm);
actor.system.resources = {
  legact: { value: 3, max: 3 },
  legres: { value: 3, max: 3 },
  lair: { value: false, initiative: null },
};

writeFileSync(OUT_PATH, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${actor.items.length} items total)`);
