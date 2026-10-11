// Malphas's two Thunderbird forms (Tori Tori no Mi, Model: Raicho, mythical zoan): Hybrid Form and the Full Beast.
// Standalone actors with fixed ids so Malphas's transform profiles can point at "Actor.<id>" (import all four with ids kept).
// Hybrids keep Malphas's own scores, hp, class, feats, items and spells; the Full Beast replaces his stats but keeps Int/Wis/Cha, proficiency and proficiencies.
import { writeFileSync } from "node:fs";
import { generateId } from "../../data/helpers/id.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

export const BEAST_ID = generateId("homebrew/malphas/thunderbird-beast");
export const HYBRID_ID = generateId("homebrew/malphas/thunderbird-hybrid");
const ART = "one-piece-5e/npcs/Lunarfolds/";
export const DC = 17;   // 8 + proficiency 4 + Dexterity 5 (Malphas, level 12)

const feat = (scope: string, slug: string, name: string, img: string, description: string, o: { actionType?: string; activation?: { type: string; cost: number | null; condition?: string }; damage?: [string, string][]; save?: { ability: string; dc: number }; range?: { value: number | null; units: string }; recharge?: number } = {}): FeatureItem => ensureFeatureActivities({
  _id: generateId(`homebrew/malphas/${scope}/${slug}`), name, type: "feat", img,
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

const TALON = "icons/creatures/claws/claw-talons-glowing-orange.webp", BOLT = "icons/magic/lightning/bolt-strike-blue.webp", WING = "icons/commodities/biological/wing-bird-white.webp";
const bonusEffect = (scope: string, name: string, img: string, value: string) => ({
  _id: generateId(`homebrew/malphas/${scope}/effect/${name}`), name, img, disabled: false, transfer: true,
  changes: ["mwak", "rwak", "msak", "rsak"].map((t) => ({ key: `system.bonuses.${t}.damage`, mode: 2, value, priority: 20 })),
  duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
});
const dexClaw = (scope: string, reach: number, text: string) => {
  const c = feat(scope, "claw", "Talons", TALON, text, { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["1d8", "slashing"]], range: { value: reach, units: "ft" } });
  for (const a of Object.values((c.system as any).activities) as any[]) if (a.type === "attack") {
    a.attack = { ...a.attack, ability: "dex", flat: false, type: { value: "melee", classification: "weapon" } };
    a.damage = { ...a.damage, includeBase: false, parts: [{ number: 1, denomination: 8, bonus: "@abilities.dex.mod", types: ["slashing"], custom: { enabled: false, formula: "" }, scaling: { mode: "", number: null, formula: "" } }] };
  }
  return c;
};

// ---- Full Beast: a Huge Thunderbird (mythical zoan: hp = 7 x level + Con modifier, applied by the transform)
const beastItems = [
  feat("beast", "hit-points", "Hit Points", "icons/magic/life/heart-glowing-red.webp", "<p>(7 x your level) + the Thunderbird's Constitution modifier (mythical zoan). Applied automatically when you transform.</p>"),
  feat("beast", "keen-sight", "Keen Sight", "icons/magic/perception/eye-ringed-glow-angry-large-red.webp", "<p>You have advantage on Wisdom (Perception) checks that rely on sight, and darkvision out to 60 feet.</p>"),
  feat("beast", "storm-body", "Storm Body", BOLT, "<p>You are resistant to lightning and thunder damage.</p>"),
  feat("beast", "multiattack", "Multiattack", "icons/skills/melee/strike-slashes-orange.webp", "<p>You make two Talon attacks, or one Talon and one Beak attack.</p>", { activation: { type: "special", cost: null, condition: "Part of the Attack action" } }),
  feat("beast", "talon", "Talon", TALON, "<p><em>Melee Weapon Attack:</em> +(Strength modifier + your proficiency bonus) to hit, reach 10 ft., one target. <em>Hit:</em> 2d8 + Strength modifier slashing damage plus 1d8 lightning damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["2d8 + @abilities.str.mod", "slashing"], ["1d8", "lightning"]], range: { value: 10, units: "ft" } }),
  feat("beast", "beak", "Beak", "icons/creatures/abilities/beak-hooked-red.webp", "<p><em>Melee Weapon Attack:</em> +(Strength modifier + your proficiency bonus) to hit, reach 10 ft., one target. <em>Hit:</em> 2d10 + Strength modifier piercing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["2d10 + @abilities.str.mod", "piercing"]], range: { value: 10, units: "ft" } }),
  feat("beast", "thunder-gust", "Thunder Gust", WING, `<p>(Recharge 5-6). You beat your great wings and a storm front rolls out. Each creature in a 30-foot cone makes a DC ${DC} Constitution saving throw, taking 6d8 lightning damage and being knocked prone on a failed save, or half damage and not prone on a success.</p>`, { actionType: "save", activation: { type: "action", cost: 1 }, save: { ability: "con", dc: DC }, damage: [["6d8", "lightning"]], range: { value: null, units: "self" }, recharge: 5 }),
  feat("beast", "stormborne", "Stormborne Flight", WING, "<p>You have a flying speed of 120 feet and can hover. You are not slowed by storms or knocked out of the air by wind.</p>"),
];
const beast = {
  _id: BEAST_ID, name: "Thunderbird (Malphas Full Beast Form)", type: "npc", img: `${ART}thunderbird-beast-new.jpg`,
  system: {
    abilities: { str: { value: 22 }, dex: { value: 18 }, con: { value: 18 }, int: { value: 10 }, wis: { value: 16 }, cha: { value: 10 } },
    attributes: { prof: 4, ac: { calc: "flat", flat: 18 }, hp: { value: 88, max: 88, formula: "" }, movement: { walk: 40, fly: 120, hover: true, units: "ft" }, senses: { ranges: { darkvision: 60 }, units: "ft" } },
    details: { cr: 0, type: { value: "monstrosity" }, alignment: "", source: { book: "Blood & Brine homebrew", custom: "Malphas" }, biography: { value: "<p>The Full Beast Form of Malphas's Tori Tori no Mi, Model: Raicho (mythical zoan): a Huge thunderbird wrapped in a living storm. Intelligence, Wisdom, Charisma, proficiency bonus and skill/save proficiencies come from Malphas; those values here are placeholders.</p>", public: "" } },
    traits: { size: "huge", dr: { value: ["lightning", "thunder"], custom: "" }, ci: { value: [], custom: "" } },
    skills: { prc: { value: 1, ability: "wis" } },
  },
  prototypeToken: { name: "Thunderbird", texture: { src: `${ART}thunderbird-beast-new-token.png` }, width: 3, height: 3, actorLink: false, disposition: -1 },
  items: beastItems, effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};

// ---- Hybrid forms: Medium winged man-bird that keeps Malphas's own scores, hp, class, feats, items and spells
const hybrid = {
  _id: HYBRID_ID, name: "Thunderbird (Malphas Hybrid Form)", type: "npc", img: `${ART}malphas-hybrid-new.jpg`,
  system: {
    abilities: { str: { value: 12 }, dex: { value: 20 }, con: { value: 15 }, int: { value: 12 }, wis: { value: 18 }, cha: { value: 10 } },
    attributes: { prof: 4, ac: { calc: "flat", flat: 19 }, hp: { value: 215, max: 215, formula: "" }, movement: { walk: 40, fly: 80, hover: true, units: "ft" }, senses: { ranges: { darkvision: 60 }, units: "ft" } },
    details: { cr: 0, type: { value: "humanoid" }, alignment: "", source: { book: "Blood & Brine homebrew", custom: "Malphas" }, biography: { value: "<p>The Hybrid Form of Malphas's Tori Tori no Mi, Model: Raicho (mythical zoan): a winged man-bird crackling with lightning. Ability scores, hit points, class features, spells and gear come from Malphas (the transform keeps them); this sheet supplies wings, talons, flying speed and token.</p>", public: "" } },
    traits: { size: "med", dr: { value: ["lightning"], custom: "" }, ci: { value: [], custom: "" } }, skills: {},
  },
  prototypeToken: { name: "Thunderbird (Hybrid)", texture: { src: `${ART}malphas-hybrid-new-token.png` }, width: 1, height: 1, actorLink: false, disposition: -1 },
  items: [
    dexClaw("hybrid", 5, "<p><em>Melee Weapon Attack:</em> +(Dexterity modifier + your proficiency bonus) to hit, reach 5 ft., one target. <em>Hit:</em> 1d8 + Dexterity modifier slashing damage.</p>"),
    feat("hybrid", "strikes", "Hybrid Strikes", "icons/skills/melee/strike-slashes-orange.webp", "<p>All of your attacks deal extra damage equal to your proficiency bonus while in Hybrid Form (Zoan Hybrid Form).</p>"),
    feat("hybrid", "wings", "Thunderbird Wings", WING, "<p>You have a flying speed of 80 feet and can hover, and you have resistance to lightning damage while in this form.</p>"),
  ] as FeatureItem[],
  effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
(hybrid.items[1].effects as any) = [bonusEffect("hybrid", "Hybrid Strikes", "icons/skills/melee/strike-slashes-orange.webp", "+@prof")];

if (process.argv[1]?.endsWith("build-malphas-forms.ts")) {
  writeFileSync("../Foundry/actors-json/malphas-thunderbird-beast.json", JSON.stringify(beast, null, 2), "utf-8");
  writeFileSync("../Foundry/actors-json/malphas-thunderbird-hybrid.json", JSON.stringify(hybrid, null, 2), "utf-8");
  console.log(`Wrote beast (${BEAST_ID}) and hybrid (${HYBRID_ID})`);
}
