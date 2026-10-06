import type { Spec } from "../../helpers/spec.js";

// Flat bonuses that the text states without a condition, found by scripts/audit-text-only.mjs. The conditional parts of each feature stay as text.
export const simpleBonusSpecs: Record<string, Spec> = {
  "feats/Mobile": { activities: [], extraEffects: [{ name: "Mobile", transfer: true, changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "10" }] }] },
  "feats/Savage Attacker": { activities: [], extraEffects: [{ name: "Savage Attacker", transfer: true, changes: [
    { key: "system.bonuses.mwak.damage", mode: 2, value: "+1" }, { key: "system.bonuses.rwak.damage", mode: 2, value: "+1" },
  ] }] },
  // Wrestling: unarmed damage dice one step larger (the same flag Unarmed Master and Spirit Adept use, see automation/unarmed.ts)
  "class-features/Fighting Style: Wrestling": { activities: [], extraEffects: [{ name: "Wrestling", transfer: true, changes: [{ key: "flags.op5e.unarmedDieStep", mode: 2, value: "1" }] }] },
};

// Batch 1 of the text-only features (issue #26; Alert, Observant and Tough are already handled natively by dnd5e): unconditional speed, initiative, passive score, darkvision and hit point bonuses stated in the feat text.
const eff = (name: string, ...changes: { key: string; mode: number; value: string }[]): Spec => ({ activities: [], extraEffects: [{ name, transfer: true, changes }] });
const speed = (kind: string, n: number) => ({ key: `system.attributes.movement.${kind}`, mode: 2, value: String(n) });
export const batch1Specs: Record<string, Spec> = {
  "feats/Charger": eff("Charger", speed("walk", 10)),
  "feats/Fleet-Footed": eff("Fleet-Footed", speed("walk", 5), { key: "system.attributes.init.bonus", mode: 2, value: "+@prof" }),
  "feats/Hooves Inbound": eff("Hooves Inbound", speed("walk", 5), { key: "flags.dnd5e.powerfulBuild", mode: 5, value: "1" }),   // also "one size bigger" for carrying
  "feats/Knack Of The Pretender": eff("Knack Of The Pretender", speed("walk", 5), { key: "system.skills.acr.bonuses.check", mode: 2, value: "+1d4" }, { key: "system.skills.dec.bonuses.check", mode: 2, value: "+1d4" }),
  "feats/Water Wings": eff("Water Wings", speed("swim", 10)),
  "feats/Sea Sovereignty": eff("Sea Sovereignty", speed("swim", 10)),
  "feats/Perceptive": eff("Perceptive", { key: "system.attributes.senses.darkvision", mode: 2, value: "30" }),
  "feats/Knack Of The Hunter": eff("Knack Of The Hunter", { key: "system.attributes.senses.darkvision", mode: 2, value: "60" }),
  "feats/Made For War": eff("Made For War", { key: "system.attributes.hp.bonuses.overall", mode: 2, value: "+@details.level" }),
};

// Batch 2 (issue #26): climbing speed equal to walking speed, lightning resistance and Powerful Build. Free Diver and Dark Wing Hunter are conditional (existing swim speed, heavy armor) and stay text.
const climbEqualsWalk = (name: string): Spec => eff(name, { key: "system.attributes.movement.climb", mode: 4, value: "@attributes.movement.walk" });
export const batch2Specs: Record<string, Spec> = {
  "feats/Brawny": climbEqualsWalk("Brawny"),
  "feats/Gliding Skin": climbEqualsWalk("Gliding Skin"),
  "feats/Intuitive Primate": climbEqualsWalk("Intuitive Primate"),
  "feats/Razor Claws": climbEqualsWalk("Razor Claws"),
  "feats/Renegade Rodent": climbEqualsWalk("Renegade Rodent"),
  "feats/Buck-Toothed": eff("Buck-Toothed", { key: "system.attributes.movement.swim", mode: 4, value: "@attributes.movement.walk" }),
  "feats/Enhanced Circuitry": eff("Enhanced Circuitry", { key: "system.traits.dr.value", mode: 2, value: "lightning" }),
  "racial-features/Powerful Build": eff("Powerful Build", { key: "flags.dnd5e.powerfulBuild", mode: 5, value: "1" }),
};

// Batch 3 (issue #26): the unconditional parts found by the per-feature review (reports/text-only/output-*.json): damage resistances, condition immunities,
// speed, initiative and save effects. Riders in the same texts (triggers, once per turn, choices) stay text. Expertise-if-proficient entries are left out until their keys are verified.
const resist = (name: string, ...types: string[]): Spec => eff(name, ...types.map((t) => ({ key: "system.traits.dr.value", mode: 2, value: t })));
export const batch3Specs: Record<string, Spec> = {
  "class-features/Expanding Epiphany": resist("Expanding Epiphany", "psychic"),
  "feats/Undead Resolve": resist("Undead Resolve", "necrotic"),
  "class-features/Corrosive Soul": resist("Corrosive Soul", "acid"),
  "class-features/Echoing Soul": resist("Echoing Soul", "thunder"),
  "class-features/Fiery Soul": resist("Fiery Soul", "fire"),
  "class-features/Frozen Soul": resist("Frozen Soul", "cold"),
  "class-features/Psychic Soul": resist("Psychic Soul", "psychic"),
  "class-features/Scornful Soul": resist("Scornful Soul", "necrotic"),
  "class-features/Shining Soul": resist("Shining Soul", "radiant"),
  "class-features/Sparking Soul": resist("Sparking Soul", "lightning"),
  "class-features/Crazed Bravado": eff("Crazed Bravado", { key: "system.traits.dr.value", mode: 2, value: "fire" }, { key: "system.traits.dr.value", mode: 2, value: "thunder" }, { key: "system.traits.ci.value", mode: 2, value: "deafened" }),
  "class-features/Miasmic Soul": eff("Miasmic Soul", { key: "system.traits.dr.value", mode: 2, value: "poison" }, { key: "system.traits.ci.value", mode: 2, value: "poisoned" }),
  "class-features/Purity of the Body": eff("Purity of the Body", { key: "system.traits.di.value", mode: 2, value: "poison" }, { key: "system.traits.ci.value", mode: 2, value: "poisoned" }, { key: "system.traits.ci.value", mode: 2, value: "diseased" }),
  "class-features/Physician's Mercy": eff("Physician's Mercy", { key: "system.abilities.con.proficient", mode: 4, value: "1" }, { key: "system.traits.dr.value", mode: 2, value: "necrotic" }),
  "feats/Shandian Mobility": eff("Shandian Mobility", speed("walk", 5)),
  "class-features/Voracious Velocity": eff("Voracious Velocity", speed("walk", 10), { key: "system.attributes.movement.climb", mode: 4, value: "@attributes.movement.walk" }),
  "feats/Ursa Major": eff("Ursa Major", { key: "system.attributes.movement.climb", mode: 4, value: "@attributes.movement.walk" }, { key: "system.attributes.movement.swim", mode: 4, value: "@attributes.movement.walk" }, { key: "flags.dnd5e.powerfulBuild", mode: 5, value: "1" }),
  "class-features/Advanced Combat Tactics": eff("Advanced Combat Tactics", { key: "system.attributes.init.bonus", mode: 2, value: "+max(@abilities.wis.mod, 1)" }),
  "feats/Eyes Open": eff("Eyes Open", { key: "system.attributes.init.bonus", mode: 2, value: "+@prof" }, { key: "system.skills.prc.bonuses.passive", mode: 2, value: "+@prof" }),
  "racial-features/Pure Soul": eff("Pure Soul", ...["int", "wis", "cha"].map((a) => ({ key: `system.abilities.${a}.save.roll.mode`, mode: 4, value: "1" }))),
};
