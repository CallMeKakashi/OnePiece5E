// Mikey / Morrow: one actor. Goru's spiked family dog (Mikey) and the cold, obedient form Laziel's experiments left him in (Morrow, a 1 minute transformation).
// Monster-style stat block (no class build), CR 1, Medium beast. Same pattern as build-kanto.ts. Standalone JSON built through the op5e activity helpers.
import { writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const IMG = "one-piece-5e/npcs/Driftroot Isle/mikey-new.jpg";
const TOKEN = "one-piece-5e/npcs/Driftroot Isle/mikey-new-token.png";
const MORROW_IMG = "one-piece-5e/npcs/Driftroot Isle/morrow-new.jpg";
type O = { actionType?: string; activation: { type: string; cost: number | null; condition?: string }; damage?: [string, string][]; save?: { ability: string; dc: number };
  range?: { value: number | null; units: string }; duration?: { value: number | null; units: string }; uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean } };
const feat = (slug: string, name: string, img: string, description: string, o: O): FeatureItem => ensureFeatureActivities({
  _id: generateId(`homebrew/mikey/${slug}`), name, type: "feat", img,
  system: {
    description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "monster", subtype: "" }, requirements: "",
    activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" }, duration: o.duration ?? { value: null, units: "" },
    target: { value: null, width: null, units: "", type: "" }, range: o.range ?? { value: 5, long: null, units: "ft" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" }, save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
    chatFlavor: "", recharge: { value: null, charged: false },
  },
  effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem);
const passive = { type: "special", cost: null, condition: "Passive" };

// ---- Mikey (always on)
const keen = feat("keen-hearing-and-smell", "Keen Hearing and Smell", "icons/creatures/mammals/wolf-howl-moon-gray.webp", "<p>Mikey has advantage on Wisdom (Perception) checks that rely on hearing or smell.</p>", { activation: passive });
const loyal = feat("loyal-companion", "Loyal Companion", "icons/magic/life/heart-cross-strong-flame-green.webp", "<p>Mikey has advantage on saving throws while within 30 feet of a bonded ally (Goru or Nyx).</p>", { activation: passive });
const bite = feat("bite", "Bite", "icons/creatures/abilities/fangs-teeth-bite.webp", "<p><em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 2d6 + 2 piercing damage. This is Mikey's only attack; in Morrow form use Morrow Bite and Morrow Claw instead.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["2d6 + 2", "piercing"]] });

// ---- Transformation: a real dnd5e transform onto the Morrow actor (own sheet, Large, own token). Both actors are imported with ids kept.
export const MORROW_ID = generateId("homebrew/mikey/morrow-actor");
const MORROW_TOKEN = "one-piece-5e/npcs/Driftroot Isle/morrow-new-token.png";
const morrow = feat("transformation-morrow", "Transformation: Morrow", MORROW_IMG, "<p>Bonus action. Mikey becomes <strong>Morrow</strong> for 1 minute (once per short or long rest): larger, stronger, emotionless, obedient, spiked. His sheet and token change to the Morrow actor (Large, AC 14, HP 60). Use Revert Original Form on the sheet to end it early; at 0 hit points he drops back to Mikey.</p>", { actionType: "util", activation: { type: "bonus", cost: 1 }, range: { value: null, units: "self" }, duration: { value: 1, units: "minute" }, uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true } });
{
  const id = generateId("homebrew/mikey/morrow-transform");
  const [orig] = Object.values((morrow.system as any).activities) as any[];
  (morrow.system as any).activities = { [id]: {
    ...structuredClone(orig), _id: id, type: "transform", name: "Transform into Morrow", sort: 0,
    activation: { type: "bonus", value: 1, condition: "", override: false },
    consumption: { targets: [{ type: "itemUses", target: "", value: "1", scaling: { mode: "", formula: "" } }], scaling: { allowed: false, max: "" }, spellSlot: false },
    duration: { concentration: false, value: "1", units: "minute", special: "", override: true },
    profiles: [{ _id: generateId("homebrew/mikey/morrow-profile"), name: "Morrow", uuid: `Actor.${MORROW_ID}`, cr: "", level: { min: null, max: null }, movement: [], sizes: [], types: [], count: null }],
    transform: { customize: true, identifier: "", mode: "cr", preset: "" },
    settings: { keep: ["bio"], merge: [], effects: [], other: [], preset: null, spellLists: [], tempFormula: "", transformTokens: true, minimumAC: "" },
  } };
}

// ---- Mikey
const mikeyItems = [keen, loyal, bite, morrow];
const mikey = {
  name: "Mikey", type: "npc", img: IMG,
  system: {
    abilities: { str: { value: 14, proficient: 0 }, dex: { value: 16, proficient: 0 }, con: { value: 14, proficient: 0 }, int: { value: 6, proficient: 0 }, wis: { value: 12, proficient: 0 }, cha: { value: 10, proficient: 0 } },
    attributes: { prof: 2, ac: { calc: "flat", flat: 13 }, hp: { value: 32, max: 32, temp: 0, tempmax: 0, formula: "5d10 + 5" }, movement: { walk: 40, units: "ft" }, senses: { ranges: { darkvision: 60 }, units: "ft" } },
    details: { cr: 1, type: { value: "beast", subtype: "dog" }, alignment: "unaligned", source: { book: "Blood & Brine homebrew", custom: "Mikey" },
      biography: { value: "<p>Mikey was the Valencruz boys' dog. When he fell gravely ill, their father had him 'fixed' in the Silk Court (Laziel's experiments) and he came back emotionless and obedient. Nyx renamed him <strong>Morrow</strong>. Mikey is the dog; Transformation: Morrow turns him into the Morrow actor (Large, CR 3, spiked). Hired escort Jack keeps him on a spiked leash.</p><p><strong>Balance note (CR 1):</strong> HP 32, AC 13 as on the live sheet (below the DMG CR 1 HP band 71-85 on purpose: a pet, not a boss).</p>", public: "" } },
    traits: { size: "med", languages: { value: [], custom: "" } },
    skills: { prc: { value: 1, ability: "wis" } },
  },
  prototypeToken: { name: "Mikey", texture: { src: TOKEN }, width: 1, height: 1, actorLink: true, disposition: 0 },
  items: mikeyItems, effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
writeFileSync("../Foundry/actors-json/mikey.json", JSON.stringify(mikey, null, 2), "utf-8");

// ---- Morrow (CR 3, Large): STR 18 DEX 16 CON 16, prof +2; attacks +6
const mClaw = feat("morrow-claw", "Morrow Claw", "icons/creatures/claws/claw-talons-glowing-orange.webp", "<p><em>Melee Weapon Attack:</em> +6 to hit, reach 5 ft., one target. <em>Hit:</em> 1d8 + 4 slashing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["1d8 + 4", "slashing"]] });
const mBite = feat("morrow-bite", "Morrow Bite", "icons/creatures/abilities/mouth-teeth-long-red.webp", "<p><em>Melee Weapon Attack:</em> +6 to hit, reach 5 ft., one target. <em>Hit:</em> 2d6 + 4 piercing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["2d6 + 4", "piercing"]] });
const rend = feat("rend", "Rend", "icons/skills/wounds/blood-cells-vessel-red.webp", "<p>If both Morrow Claw attacks hit the same target in one turn, that target takes an extra 2d6 slashing damage.</p>", { actionType: "other", activation: { type: "special", cost: null, condition: "Both claws hit the same target" }, damage: [["2d6", "slashing"]] });
const frenzy = feat("feral-frenzy", "Feral Frenzy", "icons/skills/melee/strike-slashes-orange.webp", "<p>Multiattack. Morrow makes two claw attacks and one bite attack each turn.</p>", { activation: { type: "action", cost: 1 } });
const hide = feat("spiked-hide", "Spiked Hide", "icons/commodities/biological/spikes-white.webp", "<p>A creature that hits Morrow with a melee attack takes 1d4 piercing damage.</p>", { actionType: "other", activation: { type: "special", cost: null, condition: "Hit by a melee attack" }, damage: [["1d4", "piercing"]] });
const morrowActor = {
  _id: MORROW_ID, name: "Morrow (Mikey transformed)", type: "npc", img: MORROW_IMG,
  system: {
    abilities: { str: { value: 18, proficient: 0 }, dex: { value: 16, proficient: 0 }, con: { value: 16, proficient: 0 }, int: { value: 6, proficient: 0 }, wis: { value: 12, proficient: 0 }, cha: { value: 6, proficient: 0 } },
    attributes: { prof: 2, ac: { calc: "flat", flat: 14 }, hp: { value: 60, max: 60, temp: 0, tempmax: 0, formula: "8d10 + 16" }, movement: { walk: 40, units: "ft" }, senses: { ranges: { darkvision: 60 }, units: "ft" } },
    details: { cr: 3, type: { value: "beast", subtype: "dog, transformed" }, alignment: "unaligned", source: { book: "Blood & Brine homebrew", custom: "Morrow" },
      biography: { value: "<p>Transform target for Mikey (Transformation: Morrow). Larger, stronger and spiked; emotionless and obedient.</p>", public: "" } },
    traits: { size: "lg", languages: { value: [], custom: "" } },
    skills: { prc: { value: 1, ability: "wis" } },
  },
  prototypeToken: { name: "Morrow", texture: { src: MORROW_TOKEN }, width: 2, height: 2, actorLink: false, disposition: 0 },
  items: [frenzy, mClaw, mBite, rend, hide], effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
writeFileSync("../Foundry/actors-json/morrow.json", JSON.stringify(morrowActor, null, 2), "utf-8");
console.log(`Wrote mikey.json (${mikeyItems.length} items) and morrow.json (${morrowActor.items.length} items)`);
