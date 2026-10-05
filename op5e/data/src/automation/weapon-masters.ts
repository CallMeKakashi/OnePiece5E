import type { Spec } from "../../helpers/spec.js";

// Weapon-family feats: a transfer effect adds to the flags the weapons of that family read (see FAMILY in data/src/items/weapons.ts):
// +1 to attack rolls with the family, and for some feats the damage die one size larger. Reach, range and the special manoeuvres stay as text.
const fam = (family: string, name: string, die: boolean): Spec => ({
  activities: [],
  extraEffects: [{ name, transfer: true, changes: [
    { key: `flags.op5e.wAtk.${family}`, mode: 2, value: "1" },
    ...(die ? [{ key: `flags.op5e.wDie.${family}`, mode: 2, value: "1" }] : []),
  ] }],
});

// The weapons of each family need an attack activity that adds the family's flag (dnd5e drops the legacy attackBonus field). Shotgun has its own spec.
const WEAPONS: [family: string, name: string, kind: "melee" | "ranged"][] = [
  ["hammer", "Club", "melee"], ["hammer", "Greatclub", "melee"], ["hammer", "Mace", "melee"], ["hammer", "Warhammer", "melee"], ["hammer", "Light Hammer", "melee"], ["hammer", "Maul", "melee"],
  ["sword", "Longsword", "melee"], ["sword", "Greatsword", "melee"], ["rifle", "Musket", "ranged"], ["rifle", "Rifle", "ranged"],
  ["spear", "Spear", "melee"], ["spear", "Javelin", "melee"], ["spear", "Pike", "melee"], ["spear", "Trident", "melee"], ["spear", "Glaive", "melee"],
  ["lance", "Lance", "melee"], ["whip", "Whip", "melee"], ["blowgun", "Blowgun", "ranged"], ["flail", "Flail", "melee"],
  ["handgun", "Flintlock", "ranged"], ["handgun", "Pistol", "ranged"], ["handgun", "Revolver", "ranged"], ["sling", "Sling", "ranged"],
];
const weaponSpecs: Record<string, Spec> = Object.fromEntries(WEAPONS.map(([family, name, kind]) =>
  [`items/${name}`, { activities: [{ name, type: "attack" as const, activation: "action" as const, attack: { type: kind, bonus: `@flags.op5e.wAtk.${family}` }, includeBase: true }] }]));

export const weaponMasterSpecs: Record<string, Spec> = {
  ...weaponSpecs,
  "feats/Hammer Mastery": fam("hammer", "Hammer Mastery", false),
  "feats/Lance Master": fam("lance", "Lance Master", false),
  "feats/Longsword Master": fam("sword", "Longsword Master", false),
  "feats/Rifle Master": fam("rifle", "Rifle Master", false),
  "feats/Spear Mastery": fam("spear", "Spear Mastery", true),
  "feats/Whip Master": fam("whip", "Whip Master", true),
  "feats/Blowgun Expert": fam("blowgun", "Blowgun Expert", true),
  "feats/Flail Mastery": fam("flail", "Flail Mastery", false),
  "feats/Handgun Master": fam("handgun", "Handgun Master", true),
  "feats/Shotgun Master": fam("shotgun", "Shotgun Master", false),
  "feats/Sling Master": fam("sling", "Sling Master", true),
};
