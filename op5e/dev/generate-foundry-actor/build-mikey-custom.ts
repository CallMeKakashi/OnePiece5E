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

// ---- Transformation
const morrow = feat("transformation-morrow", "Transformation: Morrow", MORROW_IMG, "<p>Bonus action. Mikey becomes <strong>Morrow</strong> for 1 minute (once per short or long rest): emotionless, obedient, spiked. While Morrow he can use Morrow Claw, Morrow Bite, Rend, Feral Frenzy and Spiked Hide, and cannot use Bite or Loyal Companion. He can end it early as a bonus action. Track the form by hand; the sheet does not change.</p>", { actionType: "util", activation: { type: "bonus", cost: 1 }, range: { value: null, units: "self" }, duration: { value: 1, units: "minute" }, uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true } });

// ---- Morrow only
const mClaw = feat("morrow-claw", "Morrow Claw", "icons/creatures/claws/claw-talons-glowing-orange.webp", "<p>Morrow form only. <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 1d8 + 2 slashing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["1d8 + 2", "slashing"]] });
const mBite = feat("morrow-bite", "Morrow Bite", "icons/creatures/abilities/mouth-teeth-long-red.webp", "<p>Morrow form only. <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 2d6 + 2 piercing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["2d6 + 2", "piercing"]] });
const rend = feat("rend", "Rend (Morrow Only)", "icons/skills/wounds/blood-cells-vessel-red.webp", "<p>If both Morrow Claw attacks hit the same target in one turn, that target takes an extra 2d6 slashing damage.</p>", { actionType: "other", activation: { type: "special", cost: null, condition: "Both claws hit the same target" }, damage: [["2d6", "slashing"]] });
const frenzy = feat("feral-frenzy", "Feral Frenzy (Morrow Only)", "icons/skills/melee/strike-slashes-orange.webp", "<p>Morrow makes two claw attacks and one bite attack each turn (Multiattack).</p>", { activation: { type: "action", cost: 1 } });
const hide = feat("spiked-hide", "Spiked Hide (Morrow Only)", "icons/commodities/biological/spikes-white.webp", "<p>A creature that hits Morrow with a melee attack takes 1d4 piercing damage.</p>", { actionType: "other", activation: { type: "special", cost: null, condition: "Hit by a melee attack" }, damage: [["1d4", "piercing"]] });

const items = [keen, loyal, bite, morrow, frenzy, mClaw, mBite, rend, hide];
const actor = {
  name: "Mikey", type: "npc", img: IMG,
  system: {
    abilities: { str: { value: 14, proficient: 0 }, dex: { value: 16, proficient: 0 }, con: { value: 14, proficient: 0 }, int: { value: 6, proficient: 0 }, wis: { value: 12, proficient: 0 }, cha: { value: 10, proficient: 0 } },
    attributes: { prof: 2, ac: { calc: "flat", flat: 13 }, hp: { value: 32, max: 32, temp: 0, tempmax: 0, formula: "5d10 + 5" }, movement: { walk: 40, units: "ft" },
      senses: { ranges: { darkvision: 60 }, units: "ft" } },
    details: { cr: 1, type: { value: "beast", subtype: "dog; transformed: Morrow" }, alignment: "unaligned", source: { book: "Blood & Brine homebrew", custom: "Mikey" },
      biography: { value: "<p>Mikey was the Valencruz boys' dog. When he fell gravely ill, their father had him 'fixed' in the Silk Court (Laziel's experiments) and he came back emotionless and obedient. Nyx renamed him <strong>Morrow</strong>. One actor, one token: Mikey is the dog, Morrow is the 1 minute transformation (Transformation: Morrow). Hired escort Jack keeps him on a spiked leash.</p><p><strong>Balance note (CR 1):</strong> HP 32, AC 13 as on the live sheet (below the DMG CR 1 HP band 71-85 on purpose: a pet, not a boss). Morrow deals about 24 a round with Feral Frenzy and Rend.</p>", public: "" } },
    traits: { size: "med", languages: { value: [], custom: "" } },
    skills: { prc: { value: 1, ability: "wis" } },
  },
  prototypeToken: { name: "Mikey", texture: { src: TOKEN }, width: 1, height: 1, actorLink: false, disposition: 0 },
  items, effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
writeFileSync("../Foundry/actors-json/mikey.json", JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote mikey.json (${items.length} items)`);
