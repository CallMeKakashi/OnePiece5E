// Kyle Sollen's Full Beast Form: the Sphinx stat block the Zoan Full Beast Form (mythical) action transforms him into.
// Standalone actor JSON with a fixed _id (so Kyle's transform profile can point at "Actor.<id>"; import both with ids kept).
// Mental stats are placeholders: a Full Beast keeps the user's own Int/Wis/Cha, proficiency and skill/save proficiencies.
import { writeFileSync } from "node:fs";
import { generateId } from "../../data/helpers/id.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

export const SPHINX_ID = generateId("homebrew/kyle-sollen/sphinx-beast");
const TOKEN = "one-piece-5e/npcs/kyle-sphinx-token.png", PORTRAIT = "one-piece-5e/npcs/kyle-sphinx.jpg";   // placeholders: replace the files, the paths stay

const feat = (slug: string, name: string, img: string, description: string, o: { actionType?: string; activation?: { type: string; cost: number | null; condition?: string }; damage?: [string, string][]; save?: { ability: string; dc: number }; range?: { value: number | null; units: string }; recharge?: number }): FeatureItem => ensureFeatureActivities({
  _id: generateId(`homebrew/kyle-sollen/sphinx-beast/${slug}`), name, type: "feat", img,
  system: {
    description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" }, type: { value: "monster", subtype: "" }, requirements: "",
    activation: { type: o.activation?.type ?? "", cost: o.activation?.cost ?? null, condition: o.activation?.condition ?? "" }, duration: { value: null, units: "" },
    target: { value: null, width: null, units: "", type: "" }, range: o.range ?? { value: 10, long: null, units: "ft" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" }, save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
    chatFlavor: "", recharge: { value: o.recharge ?? null, charged: !!o.recharge },
  },
  effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as FeatureItem);

const items = [
  feat("hit-points", "Hit Points", "icons/magic/life/heart-glowing-red.webp", "<p>(7 x your level) + the Sphinx's Constitution modifier (mythical zoan). Applied automatically when you transform.</p>", {}),
  feat("keen-senses", "Keen Senses", "icons/magic/perception/eye-ringed-glow-angry-large-red.webp", "<p>You have advantage on Wisdom (Perception) checks that rely on sight or smell, and darkvision out to 60 feet.</p>", {}),
  feat("multiattack", "Multiattack", "icons/skills/melee/strike-slashes-orange.webp", "<p>You make two Claw attacks.</p>", { activation: { type: "special", cost: null, condition: "Part of the Attack action" } }),
  feat("claw", "Claw", "icons/creatures/claws/claw-talons-glowing-orange.webp", "<p><em>Melee Weapon Attack:</em> +(Strength modifier + your proficiency bonus) to hit, reach 10 ft., one target. <em>Hit:</em> 2d8 + Strength modifier slashing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["2d8 + @abilities.str.mod", "slashing"]], range: { value: 10, units: "ft" } }),
  feat("wing-buffet", "Wing Buffet", "icons/magic/air/wind-tornado-wall-blue.webp", "<p>(Recharge 5-6). Instead of attacking, you beat your great wings. Each creature in a 15-foot cone makes a Strength saving throw against your Sphinx-Sphinx DC, taking 2d8 bludgeoning damage and being knocked prone on a failed save, or half damage on a success.</p>", { actionType: "save", activation: { type: "action", cost: 1 }, save: { ability: "str", dc: 19 }, damage: [["2d8", "bludgeoning"]], range: { value: null, units: "self" }, recharge: 5 }),
];

const beast = {
  _id: SPHINX_ID, name: "Sphinx (Kyle Sollen Full Beast Form)", type: "npc", img: PORTRAIT,
  system: {
    abilities: { str: { value: 20 }, dex: { value: 14 }, con: { value: 16 }, int: { value: 14 }, wis: { value: 13 }, cha: { value: 22 } },
    attributes: { prof: 5, ac: { calc: "flat", flat: 17 }, hp: { value: 108, max: 108, formula: "" }, movement: { walk: 50, fly: 60, hover: true, units: "ft" }, senses: { ranges: { darkvision: 60 }, units: "ft" } },
    details: { cr: 0, type: { value: "monstrosity" }, alignment: "", source: { book: "Blood & Brine homebrew", custom: "Kyle Sollen" }, biography: { value: "<p>The Full Beast Form of Kyle Sollen's Sphinx-Sphinx Fruit (mythical zoan): a winged lion with the face of a man. Intelligence, Wisdom, Charisma, proficiency bonus and skill/save proficiencies come from the user; the values above are placeholders.</p>", public: "" } },
    traits: { size: "lg", dr: { value: [], custom: "" }, ci: { value: [], custom: "" } },
    skills: { prc: { value: 1, ability: "wis" }, ins: { value: 1, ability: "wis" } },
  },
  prototypeToken: { name: "Sphinx", texture: { src: TOKEN }, width: 2, height: 2, actorLink: false, disposition: -1 },
  items, effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
// ---- Hybrid Form: a Medium winged form that keeps Kyle's own scores, hit points, class, feats, items and spells (transform "keep" list) and only
// changes what the beast side adds: flying speed, size, AC, natural claws, the hybrid token and the +prof attack damage.
export const HYBRID_ID = generateId("homebrew/kyle-sollen/sphinx-hybrid");
const HYBRID_TOKEN = "one-piece-5e/npcs/kyle-hybrid-token.png", HYBRID_PORTRAIT = "one-piece-5e/npcs/kyle-hybrid.jpg";
const hClaw = feat("hybrid-claw", "Claw", "icons/creatures/claws/claw-talons-glowing-orange.webp", "<p><em>Melee Weapon Attack:</em> +(Dexterity modifier + your proficiency bonus) to hit, reach 5 ft., one target. <em>Hit:</em> 1d8 + Dexterity modifier slashing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["1d8", "slashing"]], range: { value: 5, units: "ft" } });
for (const a of Object.values((hClaw.system as any).activities) as any[]) if (a.type === "attack") {
  a.attack = { ...a.attack, ability: "dex", flat: false, type: { value: "melee", classification: "weapon" } };
  a.damage = { ...a.damage, includeBase: false, parts: [{ number: 1, denomination: 8, bonus: "@abilities.dex.mod", types: ["slashing"], custom: { enabled: false, formula: "" }, scaling: { mode: "", number: null, formula: "" } }] };
}
const hStrikes = feat("hybrid-strikes", "Hybrid Strikes", "icons/skills/melee/strike-slashes-orange.webp", "<p>All of your attacks deal extra damage equal to your proficiency bonus while in Hybrid Form (Zoan Hybrid Form).</p>", {});
hStrikes.effects = [{
  _id: generateId("homebrew/kyle-sollen/sphinx-hybrid/strikes-effect"), name: "Hybrid Strikes", img: "icons/skills/melee/strike-slashes-orange.webp", disabled: false, transfer: true,
  changes: ["mwak", "rwak", "msak", "rsak"].map((t) => ({ key: `system.bonuses.${t}.damage`, mode: 2, value: "+@prof", priority: 20 })),
  duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
}] as never;
const hWings = feat("hybrid-wings", "Wings of the Sphinx", "icons/commodities/biological/wing-bird-white.webp", "<p>You have a flying speed of 40 feet and can hover, and you have advantage on saving throws against being charmed, frightened or compelled while in this form.</p>", {});
const hybrid = {
  _id: HYBRID_ID, name: "Sphinx (Kyle Sollen Hybrid Form)", type: "npc", img: HYBRID_PORTRAIT,
  system: {
    abilities: { str: { value: 8 }, dex: { value: 18 }, con: { value: 14 }, int: { value: 14 }, wis: { value: 13 }, cha: { value: 22 } },
    attributes: { prof: 5, ac: { calc: "flat", flat: 18 }, hp: { value: 245, max: 245, formula: "" }, movement: { walk: 30, fly: 40, hover: true, units: "ft" }, senses: { ranges: { darkvision: 60 }, units: "ft" } },
    details: { cr: 0, type: { value: "humanoid" }, alignment: "", source: { book: "Blood & Brine homebrew", custom: "Kyle Sollen" }, biography: { value: "<p>The Hybrid Form of Kyle Sollen's Sphinx-Sphinx Fruit: a winged man-lion. Ability scores, hit points, class features, spells and gear come from Kyle (the transform keeps them); the sheet here supplies the wings, claws, flying speed and token.</p>", public: "" } },
    traits: { size: "med", dr: { value: [], custom: "" }, ci: { value: [], custom: "" } }, skills: {},
  },
  prototypeToken: { name: "Sphinx (Hybrid)", texture: { src: HYBRID_TOKEN }, width: 1, height: 1, actorLink: false, disposition: -1 },
  items: [hClaw, hStrikes, hWings], effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
if (process.argv[1]?.endsWith("build-kyle-sollen-sphinx.ts")) {
  writeFileSync("../Foundry/actors-json/kyle-sollen-sphinx.json", JSON.stringify(beast, null, 2), "utf-8");
  writeFileSync("../Foundry/actors-json/kyle-sollen-sphinx-hybrid.json", JSON.stringify(hybrid, null, 2), "utf-8");
  console.log(`Wrote kyle-sollen-sphinx.json (id ${SPHINX_ID}) and kyle-sollen-sphinx-hybrid.json (id ${HYBRID_ID})`);
}
export default beast;
