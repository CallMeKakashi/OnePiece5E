import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

type WCat = "simpleM" | "simpleR" | "martialM" | "martialR";

function wpn(
  id: string, name: string, cat: WCat, price: number,
  dmg: [string, string][], weight: number,
  props: Record<string, boolean>,
  opts: { base?: string; ver?: string; range?: [number, number]; desc?: string } = {},
): FoundryItem {
  return {
    _id: generateId(`items/weapons/${id}`),
    name,
    type: "weapon",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: opts.desc ?? "", chat: "" },
      source: SRC,
      quantity: 1,
      weight: { value: weight, units: "lb" },
      price: { value: price, denomination: "gp" },
      rarity: "common",
      equipped: false,
      identified: true,
      activation: { type: "action", cost: 1 },
      range: opts.range
        ? { value: opts.range[0], long: opts.range[1], units: "ft" }
        : { value: null, long: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      uses: { value: null, max: "", per: null, recovery: "" },
      damage: { parts: dmg, versatile: opts.ver ?? "" },
      actionType: cat.endsWith("R") ? "rwak" : "mwak",
      ability: "",
      attackBonus: "",
      chatFlavor: "",
      proficient: null,
      properties: props,
      type: { value: cat, baseItem: opts.base ?? "" },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

const ADP_PS = `<p><strong>Adaptable (P, S).</strong> The wielder can choose to deal piercing or slashing damage.</p>`;
const ADP_BP = `<p><strong>Adaptable (B, P).</strong> The wielder can choose to deal bludgeoning or piercing damage.</p>`;
const STRONG_DESC = `<p><strong>Strong.</strong> Use your choice of Strength or Dexterity modifier for attack and damage rolls. You must use the same modifier for both rolls.</p>`;

function reload(n: number): string {
  return `<p><strong>Reload ${n}.</strong> Can fire ${n} time${n > 1 ? "s" : ""} before requiring reloading. Reloading takes an action or one of your attack actions with multiattack.</p>`;
}

export const weapons: FoundryItem[] = [
  // ═══════════════════════════════════════════
  //  Simple Melee Weapons
  // ═══════════════════════════════════════════
  wpn("club", "Club", "simpleM", 500,
    [["1d4", "bludgeoning"]], 2,
    { lgt: true }, { base: "club" }),

  wpn("dagger", "Dagger", "simpleM", 20000,
    [["1d4", "piercing"]], 1,
    { fin: true, lgt: true, thr: true },
    { base: "dagger", range: [20, 60], desc: ADP_PS }),

  wpn("greatclub", "Greatclub", "simpleM", 1000,
    [["1d8", "bludgeoning"]], 10,
    { two: true }, { base: "greatclub" }),

  wpn("handaxe", "Handaxe", "simpleM", 50000,
    [["1d6", "slashing"]], 2,
    { lgt: true, thr: true },
    { base: "handaxe", range: [20, 60] }),

  wpn("javelin", "Javelin", "simpleM", 2500,
    [["1d6", "piercing"]], 2,
    { thr: true }, { base: "javelin", range: [30, 120] }),

  wpn("light-hammer", "Light Hammer", "simpleM", 20000,
    [["1d4", "bludgeoning"]], 2,
    { lgt: true, thr: true },
    { base: "lighthammer", range: [20, 60] }),

  wpn("mace", "Mace", "simpleM", 50000,
    [["1d6", "bludgeoning"]], 4,
    { ver: true },
    { base: "mace", ver: "1d8", desc: ADP_BP }),

  wpn("quarterstaff", "Quarterstaff", "simpleM", 1000,
    [["1d6", "bludgeoning"]], 4,
    { ver: true },
    { base: "quarterstaff", ver: "1d8" }),

  wpn("spear", "Spear", "simpleM", 10000,
    [["1d6", "piercing"]], 3,
    { thr: true, ver: true },
    { base: "spear", range: [20, 60], ver: "1d8", desc: ADP_PS }),

  wpn("sickle", "Sickle", "simpleM", 10000,
    [["1d4", "slashing"]], 2,
    { lgt: true },
    { desc: "<p>A curved farming blade, light and easy to wield in close quarters.</p>" }),

  wpn("unarmed-strike", "Unarmed Strike", "simpleM", 0,
    [["1d4", "bludgeoning"]], 0,
    { lgt: true }),

  wpn("brawler-unarmed-strike", "Brawler Unarmed Strike", "simpleM", 0,
    [["@scale.brawler.brawling-die + @mod", "bludgeoning"]], 0,
    { lgt: true },
    { desc: `<p>Your Brawling training replaces the normal damage of your unarmed strikes. The damage die scales with your brawler level, as shown in the Brawling column of the Brawler table.</p>` }),

  // ═══════════════════════════════════════════
  //  Simple Ranged Weapons
  // ═══════════════════════════════════════════
  wpn("musket", "Musket", "simpleR", 500000,
    [["1d10", "piercing"]], 7,
    { amm: true, hvy: true, two: true },
    { range: [30, 120],
      desc: `<p>A simple, muzzle-loaded rifle typically made out of steel or brass that fires small lead balls. Its flared muzzle makes for relatively short range, but it can be deadly in close-quarters combat.</p>${reload(1)}` }),

  wpn("crossbow-light", "Crossbow, Light", "simpleR", 250000,
    [["1d8", "piercing"]], 5,
    { amm: true, lod: true, two: true },
    { base: "lightcrossbow", range: [80, 320] }),

  wpn("dart", "Dart", "simpleR", 25,
    [["1d4", "piercing"]], 0.25,
    { fin: true, thr: true },
    { base: "dart", range: [20, 60] }),

  wpn("flintlock", "Flintlock", "simpleR", 500000,
    [["1d6", "piercing"]], 1,
    { amm: true, lgt: true },
    { range: [30, 120],
      desc: `<p>The most common gun found on the seas. A single shot pistol with short effective range. Rain and weather severely affect reliability.</p>${reload(1)}` }),

  wpn("shortbow", "Shortbow", "simpleR", 250000,
    [["1d6", "piercing"]], 2,
    { amm: true, two: true },
    { base: "shortbow", range: [80, 320], desc: STRONG_DESC }),

  wpn("sling", "Sling", "simpleR", 1000,
    [["1d4", "bludgeoning"]], 0,
    { amm: true },
    { base: "sling", range: [30, 120] }),

  // ═══════════════════════════════════════════
  //  Martial Melee Weapons
  // ═══════════════════════════════════════════
  wpn("battleaxe", "Battleaxe", "martialM", 100000,
    [["1d8", "slashing"]], 4,
    { ver: true },
    { base: "battleaxe", ver: "1d10" }),

  wpn("cutlass", "Cutlass", "martialM", 150000,
    [["1d8", "slashing"]], 3,
    { fin: true },
    { desc: `<p>Typically featuring a basket hilt and a curved, single-edged blade, these swords trade some of the lightness of a scimitar for more stopping power. A pirate favorite.</p>${ADP_PS}` }),

  wpn("flail", "Flail", "martialM", 100000,
    [["1d8", "bludgeoning"]], 2,
    {}, { base: "flail", desc: ADP_BP }),

  wpn("glaive", "Glaive", "martialM", 200000,
    [["1d10", "slashing"]], 6,
    { hvy: true, rch: true, two: true },
    { base: "glaive", desc: ADP_PS }),

  wpn("greataxe", "Greataxe", "martialM", 300000,
    [["1d12", "slashing"]], 7,
    { hvy: true, two: true },
    { base: "greataxe" }),

  wpn("greatsword", "Greatsword", "martialM", 500000,
    [["2d6", "slashing"]], 6,
    { hvy: true, two: true },
    { base: "greatsword", desc: ADP_PS }),

  wpn("halberd", "Halberd", "martialM", 200000,
    [["1d10", "slashing"]], 6,
    { hvy: true, rch: true, two: true },
    { base: "halberd", desc: ADP_PS }),

  wpn("katana", "Katana", "martialM", 250000,
    [["2d4", "slashing"]], 3,
    { fin: true },
    { desc: `<p>Originating from Wano, katana are popular weapons among swordsmen and marine officers. Less bulky than double-edged longswords but also less durable. The slender blade makes it possible to wield them with speed over power.</p>${ADP_PS}` }),

  wpn("lance", "Lance", "martialM", 100000,
    [["1d12", "piercing"]], 6,
    { rch: true, spc: true },
    { base: "lance",
      desc: `<p><strong>Special.</strong> You have disadvantage when you use a lance to attack a target within 5 feet of you. A lance requires two hands to wield when you aren't mounted.</p>` }),

  wpn("longsword", "Longsword", "martialM", 150000,
    [["1d8", "slashing"]], 3,
    { ver: true },
    { base: "longsword", ver: "1d10", desc: ADP_PS }),

  wpn("manacles", "Manacles", "martialM", 20000,
    [], 6,
    { spc: true },
    { desc: `<p>A set of metal shackles meant to keep a Small or Medium creature from using their hands.</p><p>After a successful hit against a creature with hands within 5 ft, the attack deals no damage. While in manacles, the target:</p><ul><li>Cannot benefit from shields</li><li>Cannot use creations that require somatic components</li><li>Has disadvantage on all weapon attacks made using their hands</li></ul><p>Escaping requires a DC 20 Dexterity (Sleight of Hand) check. Breaking them requires a DC 20 Strength (Athletics) check. Each set comes with one key. Without the key, a creature proficient with thieves' tools can pick the lock with a DC 15 Dexterity check. Manacles have 20 HP and AC 19.</p>` }),

  wpn("maul", "Maul", "martialM", 100000,
    [["2d6", "bludgeoning"]], 10,
    { hvy: true, two: true },
    { base: "maul" }),

  wpn("odachi", "Odachi", "martialM", 400000,
    [["3d4", "slashing"]], 4,
    { hvy: true, two: true },
    { desc: `<p>Like katana, these two-handed blades originate from Wano. With long and slender blades, they sacrifice weight and stopping power for agility and flexibility.</p>${ADP_PS}` }),

  wpn("pike", "Pike", "martialM", 50000,
    [["1d10", "piercing"]], 18,
    { hvy: true, rch: true, two: true },
    { base: "pike" }),

  wpn("rapier", "Rapier", "martialM", 250000,
    [["1d8", "piercing"]], 2,
    { fin: true },
    { base: "rapier", desc: ADP_PS }),

  wpn("scimitar", "Scimitar", "martialM", 250000,
    [["1d6", "slashing"]], 3,
    { fin: true, lgt: true },
    { base: "scimitar", desc: ADP_PS }),

  wpn("shortsword", "Shortsword", "martialM", 100000,
    [["1d6", "piercing"]], 2,
    { fin: true, lgt: true },
    { base: "shortsword", desc: ADP_PS }),

  wpn("trident", "Trident", "martialM", 50000,
    [["1d6", "piercing"]], 4,
    { thr: true, ver: true },
    { base: "trident", range: [20, 60], ver: "1d8" }),

  wpn("war-pick", "War Pick", "martialM", 50000,
    [["1d8", "piercing"]], 2,
    { ver: true },
    { base: "warpick", ver: "1d10", desc: ADP_BP }),

  wpn("warhammer", "Warhammer", "martialM", 150000,
    [["1d8", "bludgeoning"]], 2,
    { ver: true },
    { base: "warhammer", ver: "1d10" }),

  wpn("whip", "Whip", "martialM", 20000,
    [["1d4", "slashing"]], 3,
    { fin: true, rch: true },
    { base: "whip" }),

  // ═══════════════════════════════════════════
  //  Martial Ranged Weapons
  // ═══════════════════════════════════════════
  wpn("blowgun", "Blowgun", "martialR", 100000,
    [["1d4", "piercing"]], 1,
    { amm: true, lod: true },
    { base: "blowgun", range: [25, 100] }),

  wpn("crossbow-hand", "Crossbow, Hand", "martialR", 750000,
    [["1d6", "piercing"]], 3,
    { amm: true, lgt: true, lod: true },
    { base: "handcrossbow", range: [30, 120] }),

  wpn("crossbow-heavy", "Crossbow, Heavy", "martialR", 500000,
    [["1d10", "piercing"]], 18,
    { amm: true, hvy: true, lod: true, two: true },
    { base: "heavycrossbow", range: [100, 400] }),

  wpn("longbow", "Longbow", "martialR", 500000,
    [["1d8", "piercing"]], 2,
    { amm: true, hvy: true, two: true },
    { base: "longbow", range: [150, 600], desc: STRONG_DESC }),

  wpn("rifle", "Rifle", "martialR", 800000,
    [["1d12", "piercing"]], 10,
    { amm: true, hvy: true, two: true },
    { range: [120, 480],
      desc: `<p>Outfitted with a percussion cap rather than a flintlock mechanism, making them more reliable. The revolving chamber allows repeating shots before reloading. Typically used by marine soldiers.</p>${reload(4)}` }),

  wpn("net", "Net", "martialR", 10000,
    [], 3,
    { spc: true, thr: true },
    { base: "net", range: [5, 15],
      desc: `<p>A Large or smaller creature hit by a net is restrained until freed. Has no effect on formless creatures or creatures that are Huge or larger.</p><p>A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within reach on a success. Dealing 5 damage to the net (AC 10) also frees the creature.</p><p><strong>Special.</strong> Attacks with this weapon don't have disadvantage within close range.</p>` }),

  wpn("pistol", "Pistol", "martialR", 750000,
    [["1d8", "piercing"]], 4,
    { amm: true, lgt: true },
    { range: [60, 240],
      desc: `<p>Uses a percussion cap with an extended chamber for ammunition, making it more versatile than flintlocks but much more expensive. The typical sidearm of most marine soldiers.</p>${reload(4)}` }),

  wpn("revolver", "Revolver", "martialR", 1250000,
    [["1d10", "piercing"]], 3,
    { amm: true },
    { range: [80, 320],
      desc: `<p>The most modern weapon design. A repeating handgun with a revolving chamber, very useful for firing multiple rounds in quick succession. Features rifled barrels and double action operation.</p>${reload(6)}` }),

  wpn("shotgun", "Shotgun", "martialR", 800000,
    [["2d4", "piercing"]], 3,
    { amm: true, hvy: true, two: true, spc: true },
    { range: [20, 60],
      desc: `<p>Known for causing vast damage in close proximity. Fires several bullets in the form of shells that blast holes in any surface.</p><p><strong>Special.</strong> Attacks with this weapon don't have disadvantage within close range. Ranged attacks against creatures within the short range deal an extra 1d4 piercing damage.</p>${reload(2)}` }),
];

export default weapons;
