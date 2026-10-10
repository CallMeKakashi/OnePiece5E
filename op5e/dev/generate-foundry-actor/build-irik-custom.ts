// Irik "Two-Tide" Fen: Human Rogue 8 (Fencer), Navigator, level 8, CR 4, eater of the Dabu Dabu no Mi. Built 2026-10-10.
// Compendium only: the fruit item, Test Subject (the Clone summon, his Double), Mirror Image, Misty Step, Bait and Switch.
import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons } from "./refresh-from-packs.js";
import { ensureItemActivities } from "../../data/helpers/activities.js";
import creations from "../../data/src/creations/index.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const chassis = JSON.parse(readFileSync(`${ACTORS}/irik-chassis.json`, "utf-8"));
const pack = (p: string, id: string): Doc => JSON.parse(readFileSync(`packs-src/${p}/${id}.json`, "utf-8"));

const seen = new Set<string>();
const items: Doc[] = (chassis.items as Doc[]).filter((i) => {
  if (["No Devil Fruit (yet)", "Cartographer's Tools"].includes(i.name ?? "")) return false;
  if (i.name === "Role: Navigator") { if (seen.has(i.name)) return false; seen.add(i.name); }
  return true;
});

items.push(embedOwnedItem(pack("devil-fruits", "acad70ae42193a24") as never) as Doc); // Dabu Dabu no Mi (compendium)
items.push(embedOwnedItem(pack("class-features", "861b442b9a358587") as never) as Doc); // Test Subject: the Clone summon is his Double
items.push(embedOwnedItem(pack("class-features", "861731b9e8e48da3") as never) as Doc); // Bait and Switch: Crosswire

const creation = (name: string) => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  const doc = ensureItemActivities({ ...structuredClone(c), system: { ...structuredClone(c.system), preparation: { mode: "always", prepared: true } } } as never) as Doc;
  return embedOwnedItem(doc as never) as Doc;
};
for (const n of ["Mirror Image", "Misty Step"]) items.push(creation(n)); // Double Up / Flip

// his Test Subject is the Clone only
for (const a of Object.values(items.find((i) => i.name === "Test Subject")!.system.activities ?? {}) as any[]) if (a.profiles) a.profiles = a.profiles.filter((p: any) => p.name === "Clone");
const auto = refreshFromPacks(items);
console.log(`automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
console.log(`summon actors written: ${standaloneSummons(items, ACTORS, "irik").join(", ")}`);

// ---- Devil Fruit Uses (Sourcebook Ch. 6: +1 use every odd level = floor((8+1)/2) = 4, Paramecia +1 = 5; long rest). Double Up, Flip and Crosswire spend one.
const dfu = embedOwnedItem(pack("feats", "f1b6a1ceb52e6d43") as never) as Doc;
dfu.system.uses = { spent: 0, max: "5", recovery: [{ period: "lr", type: "recoverAll" }] };
dfu.system.description.value += "<p>Irik (level 8): 4 uses from level + 1 for Paramecia = 5. Test Subject (Devil Fruit Lineage): his Double spends these same uses, and Irik gains an extra use while his Test Subject is not incapacitated. Regain all on a long rest.</p>";
items.push(dfu);
const spend = (n: string, text: string) => {
  const it = items.find((i) => i.name === n)!;
  it.system.uses = { spent: 0, max: "", recovery: [] };
  it.system.description.value = `<p>${text}</p>` + it.system.description.value;
  for (const a of Object.values(it.system.activities ?? {}) as any[]) a.consumption = { ...(a.consumption ?? {}), targets: [{ type: "itemUses", target: dfu._id, value: "1", scaling: {} }] };
  return it;
};
spend("Mirror Image", "<strong>Double Up (Dabu Dabu no Mi).</strong> Conjure a duplicate of himself out of thin air. Spends one Devil Fruit use.");
spend("Misty Step", "<strong>Flip (Dabu Dabu no Mi).</strong> Instantly swap places with the double at any time. Spends one Devil Fruit use.");
const bs = spend("Bait and Switch", "<strong>Crosswire (Dabu Dabu no Mi).</strong> Swap the double's position with any creature he can see; Irik stays put unless he uses Flip. Spends one Devil Fruit use.");
for (const a of Object.values(bs.system.activities ?? {}) as any[]) { a.damage = { ...(a.damage ?? {}), parts: [] }; a.description = { ...(a.description ?? {}), chatFlavor: "Swap the double's position with a creature you can see." }; }

for (const i of items) {
  if (["Leather Armor", "Rapier", "Shortbow"].includes(i.name ?? "") && i.system) i.system.equipped = true;
  if (i.type === "tool") i.system.proficient = ["Thieves' Tools", "Navigator's Tools"].includes(i.name ?? "") ? 1 : 0;
}

const sys = chassis.system;
const abil = { str: 10, dex: 20, con: 15, int: 14, wis: 13, cha: 8 }; // base 10/14/14/13/12/8 -> +2 Dex at Rogue 4 and 8; Human trait +1 Con, Int, Wis (set directly, not double counted)
for (const [k, v] of Object.entries(abil)) sys.abilities[k].value = v;
sys.abilities.dex.proficient = 1; sys.abilities.int.proficient = 1; // Rogue saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const VALUES: Record<string, number> = { ste: 2, acr: 2, prc: 2, dec: 2, inv: 1, sur: 1, nat: 1 }; // Rogue skills with expertise (Stealth, Acrobatics, then Perception, Deception), Navigator background and role
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: VALUES[k] ?? 0, ability: ab }]));
sys.attributes.spellcasting = "int"; // Mirror Image and Misty Step are item-granted
// CR 4 (damage output is below CR 5). Straight Rogue 8 (Con 15, +2 x 8 = +16) gives 8d8+16 = 52 avg; HP 123 is a kept override (CR 4 DMG band is 100-115).
sys.attributes.hp = { value: 123, max: 123, temp: 0, tempmax: 0, formula: "8d8 + 16" };
sys.details.cr = 4; sys.details.level = 8;
chassis.items = items;
chassis.name = "Irik Fen";
chassis.img = "one-piece-5e/npcs/Sharkfin Pirates/irik-new.jpg";
chassis.prototypeToken = { ...(chassis.prototypeToken ?? {}), texture: { ...(chassis.prototypeToken?.texture ?? {}), src: "one-piece-5e/npcs/Sharkfin Pirates/irik-new-token.png" } };
sys.details.biography.value = "<p>Irik \"Two-Tide\" Fen, former navigator of the Sharkfin Pirates, now in the service of another pirate after the party killed his captain. Eater of the Dabu Dabu no Mi: his Double fights beside him and he swaps places with it at will.</p><p><strong>Balance note (CR 4):</strong> his damage is below CR 5, so he is rated CR 4; hit points are kept at the 123 override (the real formula is 8d8 + 16, Con 15).</p><p>Human trait: +1 Con, Int, Wis (Con 15, Int 14, Wis 13).</p>";

writeFileSync(`${ACTORS}/irik.json`, JSON.stringify(chassis, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/irik.json (${items.length} items)`);
