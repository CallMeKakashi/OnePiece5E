import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem, newOwnedId } from "./compendium-resolver.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { DAE_MODES } from "../../data/schemas/common.js";
import type { FeatureItem } from "../../data/schemas/feature.js";
import { amazonianBond, minorHaki } from "../../data/src/racial-features/human.js";
import creations from "../../data/src/creations/index.js";

type CompendiumDocLike = { name?: string; system: Record<string, unknown> } & Record<string, unknown>;

const CHASSIS_PATH = "../Foundry/actors-json/zenzara-chassis.json";
const OUT_PATH = "../Foundry/actors-json/zenzara.json";

const chassis = JSON.parse(readFileSync(CHASSIS_PATH, "utf-8"));

// --- 1. Real racial-features Kuja items (Amazonian Bond, Minor Haki) ---
const kujaItems = [
  embedOwnedItem(amazonianBond as never),
  embedOwnedItem(minorHaki as never),
];

// --- 2. Homebrew items via the same legacy-shape -> ensureFeatureActivities pipeline ---
function stripDae(effect: Record<string, unknown>) {
  const flags = effect.flags as Record<string, unknown> | undefined;
  if (flags) delete flags.dae;
  return effect;
}

function makeEffect(idPath: string, name: string, img: string, changes: { key: string; mode: number; value: string }[]) {
  return stripDae({
    _id: generateId(`effect/${idPath}`),
    name,
    img,
    changes: changes.map((c) => ({ ...c, priority: 20 })),
    disabled: false,
    duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null },
    origin: null,
    transfer: true,
    flags: {},
    statuses: [],
    tint: null,
  });
}

function homebrewFeat(idPath: string, name: string, img: string, description: string, options: {
  actionType?: string;
  activation: { type: string; cost: number | null; condition?: string };
  damage?: [string, string][];
  save?: { ability: string; dc: number | null };
  uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean };
  effects?: ReturnType<typeof makeEffect>[];
}): FeatureItem {
  const item: FeatureItem = {
    _id: generateId(idPath),
    name,
    type: "feat",
    img,
    system: {
      description: { value: description, chat: "" },
      source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "",
      activation: { type: options.activation.type, cost: options.activation.cost, condition: options.activation.condition ?? "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: 5, long: null, units: "ft" },
      uses: options.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: options.actionType ?? "",
      damage: { parts: options.damage ?? [], versatile: "" },
      save: options.save ? { ability: options.save.ability, dc: options.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: options.effects ?? [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null, coreVersion: "13",
      systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
  return ensureFeatureActivities(item);
}

// Healing Tattoo Ink is TWO distinct activities on one item: applying the
// tattoo costs an action; triggering an already-applied tattoo is a free
// action (no action cost — dnd5e "special" activation), not the same step.
const applyTattoo = homebrewFeat(
  "homebrew/zenzara/healing-tattoo-ink-apply",
  "Healing Tattoo Ink: Apply Tattoo",
  "icons/magic/life/heart-cross-strong-flame-purple-orange.webp",
  "<p>As an action, apply or throw/splash enchanted ink onto a creature within 30 feet, marking it with a healing tattoo that lasts until used. Out of combat, with ink remaining, tattoos can be applied freely (ritual, no use limit) to allies up to full health; in combat, each application costs an action.</p>",
  {
    actionType: "util",
    activation: { type: "action", cost: 1 },
  },
);
const triggerTattoo = homebrewFeat(
  "homebrew/zenzara/healing-tattoo-ink-trigger",
  "Healing Tattoo Ink: Trigger Tattoo",
  "icons/magic/life/heart-cross-strong-flame-purple-orange.webp",
  "<p>As a free action (no action cost), once per short rest, cause one applied tattoo to burn away into smoke, healing that creature for 1d8 + your spellcasting ability modifier hit points.</p>",
  {
    actionType: "heal",
    activation: { type: "special", cost: null, condition: "Once per short rest; requires a previously applied tattoo" },
    damage: [["1d8 + @abilities.cha.mod", "healing"]],
    uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true },
  },
);
function soleActivity(item: FeatureItem, newId: string, activityName: string) {
  const activities = (item.system as { activities?: Record<string, unknown> }).activities ?? {};
  const [orig] = Object.values(activities) as Record<string, unknown>[];
  return { [newId]: { ...orig, _id: newId, name: activityName } };
}

const applyActivityId = generateId("homebrew/zenzara/healing-tattoo-ink/apply-activity");
const triggerActivityId = generateId("homebrew/zenzara/healing-tattoo-ink/trigger-activity");

const healingTattooInk: FeatureItem = {
  ...applyTattoo,
  _id: generateId("homebrew/zenzara/healing-tattoo-ink"),
  name: "Healing Tattoo Ink",
  system: {
    ...applyTattoo.system,
    description: {
      value:
        "<p>You carry a reservoir of enchanted tattoo ink. <strong>Apply Tattoo</strong> (action): apply or throw/splash the ink onto a creature within 30 feet, marking it with a healing tattoo that lasts until used. Out of combat, with ink remaining, tattoos can be applied freely to allies up to full health; in combat, each application costs an action. <strong>Trigger Tattoo</strong> (free action, no action cost, once per short rest): cause one applied tattoo to burn away into smoke, healing that creature for 1d8 + your spellcasting ability modifier hit points.</p>",
      chat: "",
    },
    activities: {
      ...soleActivity(applyTattoo, applyActivityId, "Apply Tattoo"),
      ...soleActivity(triggerTattoo, triggerActivityId, "Trigger Tattoo"),
    },
  },
} as FeatureItem;

const serpentBite = homebrewFeat(
  "homebrew/zenzara/serpent-bite",
  "Serpent Bite",
  "icons/creatures/reptiles/snake-fangs-bite-green.webp",
  "<p>As your action, direct up to three bonded venomous snakes to each make a Serpent Bite attack (melee reach 5 ft. or ranged 10 ft.). Melee or Ranged Weapon Attack: +8 to hit, one target. Hit: 1d6 + 4 piercing damage plus 2d8 poison damage, and the target must succeed on a DC 15 Constitution saving throw or become poisoned for 1 minute. A creature already poisoned by this effect that fails a second such saving throw before the poison ends instead becomes petrified for 24 hours.</p>",
  {
    actionType: "mwak",
    activation: { type: "action", cost: 1 },
    damage: [["1d6 + 4", "piercing"], ["2d8", "poison"]],
  },
);

const petrifyingGlassEye = homebrewFeat(
  "homebrew/zenzara/petrifying-glass-eye",
  "Petrifying Glass Eye",
  "icons/magic/perception/eye-ringed-glow-angry-large-red.webp",
  "<p><em>Additional Power — homebrew, formalizing this NPC's Chapter 7 power slot.</em></p><p>No action cost — at the start of each of her turns, any creature within 30 feet that can see the eye and that she chooses to lock eyes with must succeed on a DC 16 Constitution saving throw or be restrained as its flesh begins to harden. A restrained creature must repeat the saving throw at the end of its next turn if still within line of sight and eye contact is maintained; on a success the effect ends, but on a failure the creature is petrified until freed by greater restoration or similar magic. A creature that starts its turn averting its eyes from Zenzara has advantage on the saving throw.</p>",
  {
    actionType: "save",
    activation: { type: "special", cost: null, condition: "Start of Zenzara's turn, no action required" },
    save: { ability: "con", dc: 16 },
  },
);

// --- Legendary actions / resistance ---
const legendaryActionsHeader = homebrewFeat(
  "homebrew/zenzara/legendary-actions-header",
  "Legendary Actions",
  "icons/skills/melee/strike-slashes-orange.webp",
  "<p>Zenzara can take 2 legendary actions, choosing from the options below. Only one legendary action can be used at a time, and only at the end of another creature's turn. She regains spent legendary actions at the start of her turn.</p>",
  { activation: { type: "special", cost: null, condition: "Legendary action economy, see description" } },
);

const legendaryResistance = homebrewFeat(
  "homebrew/zenzara/legendary-resistance",
  "Legendary Resistance (1/Day)",
  "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
  "<p>If Zenzara fails a saving throw, she can choose to succeed instead.</p>",
  {
    activation: { type: "special", cost: null, condition: "Reaction to a failed save" },
    uses: { value: 1, max: "1", per: "day", recovery: "", prompt: true },
  },
);

const serpentBiteLegendary = homebrewFeat(
  "homebrew/zenzara/serpent-bite-legendary",
  "Serpent Bite (Legendary Action)",
  "icons/creatures/reptiles/snake-fangs-bite-green.webp",
  "<p>Costs 1 legendary action. Zenzara directs one bonded snake to make a single Serpent Bite attack (melee reach 5 ft. or ranged 10 ft.) — the same attack as her action-economy Serpent Bite, usable on another creature's turn.</p><p>Melee or Ranged Weapon Attack: +8 to hit, one target. Hit: 1d6 + 4 piercing damage plus 2d8 poison damage, DC 15 Constitution save or poisoned (as Serpent Bite).</p>",
  {
    actionType: "mwak",
    activation: { type: "legendary", cost: 1 },
    damage: [["1d6 + 4", "piercing"], ["2d8", "poison"]],
  },
);

const customItems = [
  healingTattooInk, serpentBite, petrifyingGlassEye,
  legendaryActionsHeader, legendaryResistance, serpentBiteLegendary,
];

// --- 3. Merge ---
chassis.items = [...chassis.items, ...kujaItems, ...customItems];
chassis.system.resources = {
  legact: { value: 2, max: 2 },
  legres: { value: 1, max: 1 },
  lair: { value: false, initiative: null },
};

// --- 4. Fix build-actor.ts's known gaps: it hardcodes traits.weaponProf/armorProf
// to empty and never applies saving-throw proficiency or spellcasting slots.
// Values below come from the real op5e Medic class source
// (data/src/classes/medic.ts), not guessed: armor lgt/med/shl, weapons "sim"
// (simple — includes the Medic-specific sidearm list per its hint text),
// saves int/wis, spellcasting "wis", full-caster progression.
chassis.system.traits.armorProf = { value: ["lgt", "med", "shl"], custom: "" };
chassis.system.traits.weaponProf = { value: ["sim"], custom: "" };
chassis.system.abilities.int.proficient = 1;
chassis.system.abilities.wis.proficient = 1;
chassis.system.attributes.spellcasting = "wis";
// Full-caster slot table (PHB) at class level 14 — Medic's "creations" use the
// same slot progression as 5e spellcasting per data/src/classes/medic.ts
// (`spellcasting: { progression: "full", ability: "wis" }`).
const FULL_CASTER_L14_SLOTS = [4, 3, 3, 3, 2, 1, 1, 1, 0];
chassis.system.spells = Object.fromEntries(
  FULL_CASTER_L14_SLOTS.map((max, i) => [`spell${i + 1}`, { value: max, max }]),
);

// --- 5. Creation (spell) list ---
function findCreation(name: string): CompendiumDocLike {
  const doc = (creations as CompendiumDocLike[]).find((c) => c.name === name);
  if (!doc) throw new Error(`Creation not found: ${name}`);
  return doc;
}

function embedCreation(name: string, opts: { alwaysPrepared?: boolean; note?: string } = {}) {
  let doc = structuredClone(findCreation(name));
  if (opts.alwaysPrepared) {
    (doc.system as Record<string, unknown>).preparation = { mode: "always", prepared: true };
  } else {
    (doc.system as Record<string, unknown>).preparation = { mode: "prepared", prepared: true };
  }
  if (opts.note) {
    const desc = (doc.system as { description: { value: string } }).description;
    desc.value = `<p><em>${opts.note}</em></p>` + desc.value;
  }
  // compendium-resolver's embedOwnedItem only builds activities for
  // feat/class/weapon types — spells fall through untouched. Build them
  // explicitly before embedding, or every spell ships with zero Use buttons.
  doc = ensureItemActivities(doc as never) as typeof doc;
  return embedOwnedItem(doc as never);
}

// Chemist Creations — always prepared, don't count against her prepared list
// (per Chemist.md: 2nd/3rd/5th/7th/9th Medic level). "Vitriolic Sphere" isn't
// implemented anywhere in the op5e compendium yet — flagged, not invented.
const chemistCreationNames = [
  "Bane", "Caustic Brew", "Alter Self", "Acid Arrow",
  "Fireball", "Stinking Cloud", "Wall of Fire", "Cloudkill", "Contagion",
];
const chemistCreationItems = chemistCreationNames.map((n) =>
  embedCreation(n, { alwaysPrepared: true, note: "Chemist Creation — always prepared." }),
);

// Freely prepared creations (WIS mod + half Medic level, min 1 — she has
// WIS 10 / +0 mod, so 7 at level 14). Picked to fit a poison/petrification/
// doctor theme: healing, restoration, and — thematically perfect — an
// actual "Petrify" creation.
const preparedCreationNames = [
  "Cure Wounds", "Healing Word", "Hold Person",
  "Lesser Restoration", "Greater Restoration", "Petrify", "Heal",
];
const preparedCreationItems = preparedCreationNames.map((n) => embedCreation(n));

// Tricks (cantrips) — Medic table grants several by level 14; picked to fit
// the same theme.
const trickNames = ["Venom Bolt", "Poisonous Puff", "Guidance", "Stabilize", "Acid Spray"];
const trickItems = trickNames.map((n) => embedCreation(n));

chassis.items = [
  ...chassis.items,
  ...chemistCreationItems, ...preparedCreationItems, ...trickItems,
];
console.log(`Vitriolic Sphere (Chemist 7th-level creation) is NOT in the op5e compendium — flagged, not added.`);

writeFileSync(OUT_PATH, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${OUT_PATH} (${chassis.items.length} items total)`);
