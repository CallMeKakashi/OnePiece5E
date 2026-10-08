// Kanto: the arc's final boss. An oni whose body Fenrir (a devil fruit user lost to the will of his fruit, now an astral dragon) has taken over and turned into a young
// multichromatic dragon with rainbow glass scales. Monster-style stat block (no class build), CR 14, legendary resistance and legendary actions.
// His only obsession is the set of rings (Rings of Aegir) one of the players carries. Standalone JSON, built through the same activity helpers as every op5e item.
import { writeFileSync } from "node:fs";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const DC = 18;
const IMG = "icons/creatures/reptiles/dragon-horned-blue.webp";   // placeholder, replace with your art
type O = { actionType?: string; activation: { type: string; cost: number | null; condition?: string }; damage?: [string, string][]; save?: { ability: string; dc: number };
  range?: { value: number | null; units: string }; target?: { value: number | null; width?: number | null; units: string; type: string }; uses?: { value: number | null; max: string; per: string | null; recovery: string; prompt: boolean }; recharge?: number };
const feat = (slug: string, name: string, img: string, description: string, o: O): FeatureItem => ensureFeatureActivities({
  _id: generateId(`homebrew/kanto/${slug}`), name, type: "feat", img,
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

// ---- Actions
const multiattack = feat("multiattack", "Multiattack", "icons/skills/melee/strike-slashes-orange.webp", "<p>Kanto makes three attacks: one with his bite and two with his claws.</p>", { activation: { type: "action", cost: 1 } });
const bite = feat("bite", "Bite", "icons/creatures/abilities/mouth-teeth-long-red.webp", "<p><em>Melee Weapon Attack:</em> +10 to hit, reach 10 ft., one target. <em>Hit:</em> 4d12 + 5 piercing damage. The glass teeth flash a different colour each bite.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["4d12 + 5", "piercing"]], range: { value: 10, units: "ft" } });
const claw = feat("claw", "Claw", "icons/creatures/claws/claw-talons-glowing-orange.webp", "<p><em>Melee Weapon Attack:</em> +10 to hit, reach 5 ft., one target. <em>Hit:</em> 3d10 + 5 slashing damage.</p>", { actionType: "mwak", activation: { type: "action", cost: 1 }, damage: [["3d10 + 5", "slashing"]], range: { value: 5, units: "ft" } });
// Prismatic Breath: one item, five activities (fire, cold, lightning, acid, poison); the DM rolls a d6 (reroll 6) or picks the glass colour that lights up
const ELEMENTS = [["Fire", "fire", "icons/creatures/abilities/dragon-fire-breath-orange.webp"], ["Cold", "cold", "icons/creatures/abilities/dragon-ice-breath-blue.webp"], ["Lightning", "lightning", "icons/magic/lightning/bolt-strike-blue.webp"], ["Acid", "acid", "icons/magic/acid/projectile-smoke-glowing.webp"], ["Poison", "poison", "icons/creatures/abilities/dragon-breath-purple.webp"]] as const;
const breathParts = ELEMENTS.map(([label, type, img]) => feat(`breath-${type}`, `Prismatic Breath (${label})`, img, "", { actionType: "save", activation: { type: "action", cost: 1 }, save: { ability: "dex", dc: DC }, damage: [["16d8", type]], range: { value: null, units: "self" }, target: { value: 60, width: null, units: "ft", type: "cone" }, recharge: 5 }));
const breath = breathParts[0];
breath.name = "Prismatic Breath";
breath.system.description = { value: `<p>(Recharge 5-6). Kanto exhales a 60-foot cone of rainbow light. Roll a d6, rerolling a 6 (1 fire, 2 cold, 3 lightning, 4 acid, 5 poison), or use the colour of the scales that glow brightest. Each creature in the cone makes a DC ${DC} Dexterity saving throw, taking 16d8 damage of that type on a failed save, or half as much on a success. The matching activity below is the one to use.</p>`, chat: "" };
{
  const acts: Record<string, any> = {};
  breathParts.forEach((p, i) => { const [orig] = Object.values((p.system as any).activities) as any[]; const id = generateId(`homebrew/kanto/breath-activity-${i}`); acts[id] = { ...orig, _id: id, name: `Prismatic Breath (${ELEMENTS[i][0]})` }; });
  (breath.system as any).activities = acts;
}
const shards = feat("glass-shard-burst", "Glass Shard Burst", "icons/commodities/materials/glass-cube.webp", `<p>Reaction, when Kanto is hit by a melee attack. Glass scales shatter outward: the attacker makes a DC ${DC} Dexterity saving throw, taking 4d8 slashing damage on a failed save, or half as much on a success.</p>`,
  { actionType: "save", activation: { type: "reaction", cost: 1, condition: "Kanto is hit by a melee attack" }, save: { ability: "dex", dc: DC }, damage: [["4d8", "slashing"]], range: { value: 5, units: "ft" } });

// ---- Possession and the rings
const marked = feat("marked-prey", "Marked Prey", "icons/magic/control/silhouette-hold-change-green.webp", "<p>Kanto's only will is to take back the rings. Any creature wearing a Ring of Aegir is his <em>Marked Prey</em>. Kanto has advantage on attack rolls against his Marked Prey, always knows where it is, and must choose it as the target of his attacks and Prismatic Breath whenever it is within reach or the cone.</p>", { activation: { type: "special", cost: null, condition: "Passive" } });
const pull = feat("ring-call", "Ring Call", "icons/magic/control/hypnosis-mesmerism-swirl.webp", `<p>Bonus action, once per round. Kanto calls to the rings. His Marked Prey within 60 feet makes a DC ${DC} Strength saving throw or is pulled in a straight line up to 30 feet toward him and ends adjacent to him if there is room.</p>`,
  { actionType: "save", activation: { type: "bonus", cost: 1 }, save: { ability: "str", dc: DC }, range: { value: 60, units: "ft" } });
const astral = feat("astral-step", "Astral Step", "icons/magic/movement/trail-streak-impact-blue.webp", "<p>Bonus action. Fenrir's astral dragon bends space: Kanto teleports up to 30 feet to an unoccupied space he can see. He can do this three times per long rest.</p>",
  { actionType: "util", activation: { type: "bonus", cost: 1 }, range: { value: 30, units: "ft" }, uses: { value: 3, max: "3", per: "lr", recovery: "", prompt: true } });
const will = feat("fenrirs-will", "Fenrir's Will", "icons/magic/unholy/silhouette-evil-horned-giant.webp", "<p>Kanto's body is a vessel and his own mind is gone. Fenrir, lost to the will of the Devil Fruit, rides it as an astral dragon. Kanto is immune to being charmed or frightened. He has advantage on saving throws against being stunned or paralyzed, and he speaks only in Fenrir's voice, always about the rings.</p>", { activation: { type: "special", cost: null, condition: "Passive" } });
const glass = feat("rainbow-glass-scales", "Rainbow Glass Scales", "icons/commodities/gems/gem-faceted-diamond-blue.webp", "<p>Kanto's body is grown over with rainbow, glassy scales. He has resistance to fire, cold, lightning, acid and poison damage, and vulnerability to thunder damage (the glass resonates and cracks). When he takes thunder damage, his next Prismatic Breath recharges automatically.</p>", { activation: { type: "special", cost: null, condition: "Passive" } });

// ---- Legendary kit
const legRes = feat("legendary-resistance", "Legendary Resistance (3/Day)", "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp", "<p>If Kanto fails a saving throw, he can choose to succeed instead.</p>", { activation: { type: "special", cost: null, condition: "Reaction to a failed save" }, uses: { value: 3, max: "3", per: "day", recovery: "", prompt: true } });
const legHeader = feat("legendary-actions", "Legendary Actions", "icons/skills/melee/strike-slashes-orange.webp", "<p>Kanto can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn. He regains spent legendary actions at the start of his turn.</p><ul><li><strong>Claw</strong> (1 action): one claw attack.</li><li><strong>Astral Step</strong> (1 action): uses Astral Step (it still counts against his 3 per long rest).</li><li><strong>Shard Spray</strong> (2 actions): shards fly from the scales; each creature within 10 feet makes a DC 18 Dexterity saving throw, taking 3d8 slashing damage on a failed save, or half as much on a success.</li></ul>", { activation: { type: "special", cost: null, condition: "Legendary action economy" } });
const legClaw = feat("legendary-claw", "Claw (Legendary Action)", "icons/creatures/claws/claw-talons-glowing-orange.webp", "<p>Costs 1 legendary action. One claw attack.</p>", { actionType: "mwak", activation: { type: "legendary", cost: 1 }, damage: [["3d10 + 5", "slashing"]], range: { value: 5, units: "ft" } });
const legSpray = feat("legendary-shard-spray", "Shard Spray (Legendary Action)", "icons/commodities/materials/glass-cube.webp", `<p>Costs 2 legendary actions. Each creature within 10 feet of Kanto makes a DC ${DC} Dexterity saving throw, taking 3d8 slashing damage on a failed save, or half as much on a success.</p>`,
  { actionType: "save", activation: { type: "legendary", cost: 2 }, save: { ability: "dex", dc: DC }, damage: [["3d8", "slashing"]], range: { value: null, units: "self" }, target: { value: 10, width: null, units: "ft", type: "radius" } });

const items = [multiattack, bite, claw, breath, shards, marked, pull, astral, will, glass, legRes, legHeader, legClaw, legSpray];
const actor = {
  name: "Kanto (Fenrir)", type: "npc", img: IMG,
  system: {
    abilities: { str: { value: 21, proficient: 0 }, dex: { value: 14, proficient: 1 }, con: { value: 21, proficient: 1 }, int: { value: 14, proficient: 0 }, wis: { value: 13, proficient: 1 }, cha: { value: 20, proficient: 1 } },
    attributes: { prof: 5, ac: { calc: "flat", flat: 18 }, hp: { value: 273, max: 273, temp: 0, tempmax: 0, formula: "22d12 + 130" }, movement: { walk: 40, fly: 80, hover: true, units: "ft" },
      senses: { ranges: { darkvision: 120, blindsight: 30 }, units: "ft" } },
    details: { cr: 14, type: { value: "dragon", subtype: "multichromatic, possessed oni" }, alignment: "chaotic evil", source: { book: "Blood & Brine homebrew", custom: "Kanto" },
      biography: { value: "<p>Kanto was an oni. Over time he was possessed by Fenrir, a Devil Fruit user who lost to the will of the fruit and is now only an astral dragon. Kanto's body is completely Fenrir's now, a vessel grown over with rainbow, glassy scales, a young multichromatic dragon. Fenrir's one obsession is the set of rings (the Rings of Aegir) that one of the players carries.</p><p><strong>Balance note (CR 14):</strong> HP 273, AC 18, DC 18, about 65-70 damage a round to one target with his legendary claw, and 72 damage to everything in the cone with Prismatic Breath, aimed at the CR 14 band for a level 10 party with extras. Lair actions are left to the arena.</p>", public: "" } },
    traits: { size: "lg", dr: { value: ["fire", "cold", "lightning", "acid", "poison"], custom: "" }, dv: { value: ["thunder"], custom: "" }, ci: { value: ["charmed", "frightened"], custom: "" }, languages: { value: ["common"], custom: "Understands but speaks only in Fenrir's voice" } },
    skills: { prc: { value: 1, ability: "wis" }, ste: { value: 1, ability: "dex" } },
    resources: { legact: { value: 3, max: 3 }, legres: { value: 3, max: 3 }, lair: { value: false, initiative: null } },
  },
  prototypeToken: { name: "Kanto", texture: { src: IMG }, width: 2, height: 2, actorLink: false, disposition: -1 },
  items, effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
};
writeFileSync("../Foundry/actors-json/kanto.json", JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote kanto.json (${items.length} items)`);
