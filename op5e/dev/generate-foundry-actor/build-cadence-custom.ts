// Cadence: Human Savant 12 (Thundering Resolve), Revolutionary, Captain, Shire Shire no Mi (special paramecia), CR 10. Restarted 2026-10-10.
// Chassis comes from the real pipeline (specs/cadence-spec.json). Homebrew: the four fruit powers (from Devil Fruits/Shire Shire no Mi.md) and a CR balance feature.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { refreshFromPacks } from "./refresh-from-packs.js";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const PORTRAIT = "one-piece-5e/npcs/Decibella/cadence-new.jpg";
const TOKEN = "one-piece-5e/npcs/Decibella/cadence-new-token.png";
const DC = 17; // 8 + proficiency (+4) + Charisma (+5)
const actor = JSON.parse(readFileSync(`${ACTORS}/cadence-chassis.json`, "utf-8")) as Doc;
const pack = (p: string, name: string): Doc => {
  const dir = `packs-src/${p}`;
  for (const f of readdirSync(dir)) {
    const d = JSON.parse(readFileSync(`${dir}/${f}`, "utf-8"));
    if (d.name === name) return d;
  }
  throw new Error(`${p}/${name} not found`);
};

function feat(idPath: string, name: string, img: string, description: string, o: {
  activation: { type: string; cost: number | null; condition?: string };
  actionType?: string; damage?: [string, string][]; save?: { ability: string; dc: number };
  uses?: Doc; range?: Doc; target?: Doc; duration?: Doc; requirements?: string;
}): Doc {
  return embedOwnedItem(ensureFeatureActivities({
    _id: generateId(idPath), name, type: "feat", img,
    system: {
      description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" }, requirements: o.requirements ?? "Shire Shire no Mi",
      activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" },
      duration: o.duration ?? { value: null, units: "" }, target: o.target ?? { value: null, width: null, units: "", type: "" },
      range: o.range ?? { value: 60, long: null, units: "ft" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" },
      save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "", recharge: { value: null, charged: false },
    },
    effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem) as never) as Doc;
}
const ICON = "icons/magic/sonic/projectile-sound-rings-wave.webp";
const lr3 = { value: 3, max: "3", per: "lr", recovery: "", prompt: true };
const one = { value: 1, width: null, units: "ft", type: "creature" };

// ---- 1. Shire Shire no Mi replaces the Paramecia template
const template = actor.items.find((i) => i.name?.includes("Paramecia Devil Fruit"));
if (!template) throw new Error("Cadence chassis is missing the Paramecia Devil Fruit template");
actor.items = actor.items.filter((i) => i !== template);

const fruit = feat("homebrew/cadence/shire-shire-no-mi", "Shire Shire no Mi (Command-Command Fruit)", ICON,
  "<p>A unique special paramecia. Cadence's spoken word is law: she can grant powers, compel obedience, break wills and make her commands outlast the breath that spoke them. <strong>Drawbacks:</strong> Ocean's Scorn (she cannot swim), and Armament or Conqueror's Haki can resist or break a command before obedience fully sets in.</p>",
  { activation: { type: "special", cost: null, condition: "Passive" } });
const fiat = feat("homebrew/cadence/fiat", "Command-Command: Fiat", ICON,
  "<p>Bonus action. With a single spoken word, Cadence grants one creature within 60 feet that can hear her a power it does not naturally possess. The power is adjudicated by the DM (flight, a damage resistance, a borrowed ability) and lasts until the end of her next turn unless Lingering Order extends it. Three uses per long rest.</p>",
  { activation: { type: "bonus", cost: 1 }, uses: lr3, target: one, duration: { value: 1, units: "round" } });
const imperative = feat("homebrew/cadence/absolute-imperative", "Command-Command: Absolute Imperative", ICON,
  `<p>Action. Cadence speaks one command at a creature within 60 feet that can hear her. It makes a DC ${DC} Wisdom saving throw. On a failure it obeys one short, non-suicidal order (Halt, Kneel, Flee, Drop, Approach) until the end of its next turn. Haki users can resist (see the fruit's drawbacks). Three uses per long rest. <strong>Crushing Mandate:</strong> a creature that fails the save also takes 3d8 psychic damage and is frightened of her until the end of its next turn.</p>`,
  { activation: { type: "action", cost: 1 }, actionType: "save", save: { ability: "wis", dc: DC }, damage: [["3d8", "psychic"]], uses: lr3, target: one, duration: { value: 1, units: "round" } });
const crushing = feat("homebrew/cadence/crushing-mandate", "Command-Command: Crushing Mandate", ICON,
  "<p>Passive rider on Absolute Imperative. Creatures compelled by the fruit feel despair and hopelessness as obedience closes over them: on a failed save they take 3d8 psychic damage and are frightened of Cadence until the end of their next turn (already included in Absolute Imperative).</p>",
  { activation: { type: "special", cost: null, condition: "Passive" } });
const lingering = feat("homebrew/cadence/lingering-order", "Command-Command: Lingering Order", ICON,
  "<p>Passive. Cadence's Absolute Imperative orders and Fiat grants hold until the order is carried out or she revokes them (no action), up to 1 minute. She can sustain up to two lingering effects at once; starting a third ends the oldest.</p>",
  { activation: { type: "special", cost: null, condition: "Passive" } });
actor.items.push(fruit, fiat, imperative, crushing, lingering);
for (const n of ["Devil Fruit Uses", "Devil Fruit Ability Check, Fruit-Fruit DC and Attack", "Ocean's Scorn"]) actor.items.push(embedOwnedItem(pack("feats", n) as never) as Doc);

// ---- 2. ASI feats (level 8 and 12; Cha already 20 from level 4)
for (const n of ["Unarmed Master", "Iron-Willed"]) actor.items.push(embedOwnedItem(pack("feats", n) as never) as Doc);

// ---- 3. Cleanup: one Role: Captain, one of each Haki, Conqueror's Haki she cannot control
const seen = new Set<string>();
actor.items = actor.items.filter((i) => {
  if (!i.name || !(i.name.startsWith("Role: ") || /^Color of (Observation|Armament) Novice$/.test(i.name))) return true;
  if (seen.has(i.name)) return false;
  seen.add(i.name); return true;
});
const conq = actor.items.find((i) => i.name === "Conqueror's Haki Novice");
if (conq) conq.system.description.value += "<p><em>Cadence cannot control her Conqueror's Haki: it flares on its own under strong emotion, at the DM's discretion.</em></p>";

// ---- 4. CR 10 balance: HP to the DMG band (206-220) and a labelled bespoke damage feature
const bespoke = feat("homebrew/cadence/voice-of-the-silenced", "Voice of the Silenced", "icons/magic/sonic/explosion-shock-wave-teal.webp",
  "<p>Years of swallowed words come out as thunder. <em>Balance note: bespoke CR 10 feature, not a class feature.</em> Her melee attacks, unarmed strikes included, deal an extra 2d8 thunder damage.</p>",
  { activation: { type: "special", cost: null, condition: "Passive" }, requirements: "" });
bespoke.effects = [{
  _id: generateId("effect/cadence/voice-of-the-silenced"), name: "Voice of the Silenced", img: "icons/magic/sonic/explosion-shock-wave-teal.webp", disabled: false, transfer: true,
  changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "+2d8", priority: 20 }],
  duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null,
}] as never;
actor.items.push(bespoke);

// ---- 5. Numbers
const sys = actor.system;
sys.abilities.wis.proficient = 1; sys.abilities.cha.proficient = 1; // Savant saves
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };
const PROF = new Set(["sur", "his", "per", "ins", "itm", "ath", "prf"]); // Revolutionary, Captain (Persuasion automatic), Savant
sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: PROF.has(k) ? 1 : 0, ability: ab }]));
sys.attributes.spellcasting = "cha";
sys.spells = Object.fromEntries([4, 3, 3, 0, 0, 0, 0, 0, 0].map((max, i) => [`spell${i + 1}`, { value: max, max }]));
sys.attributes.movement.swim = 0; // devil fruit user: cannot swim
sys.attributes.hp = { value: 210, max: 210, temp: 0, tempmax: 0, formula: "12d10 + 36" }; // real formula gives 112; overridden to 210 for CR 10 (DMG hp 206-220)
sys.details.cr = 10; sys.details.level = 12;
for (const i of actor.items) if (["Heavy Longcoat", "Shield"].includes(i.name ?? "")) i.system.equipped = true;
sys.details.biography.value = "<p>Cadence leads the rebellion base of the Decibella Revolutionary. Jaw-locked into silence by the kingdom, she speaks again after Rias Decibel's death and carries his Shire Shire no Mi, the Command-Command Fruit. She fights bare-handed in heavy bracers, backed by Haki she cannot yet control.</p><p><strong>Balance note (CR 10):</strong> a straight Savant 12 is well under CR 10, so hit points are overridden to 210 and Voice of the Silenced adds 2d8 thunder to melee attacks. Fruit powers and save DC 17 are as written.</p>";
actor.name = "Cadence";
actor.img = PORTRAIT;
actor.prototypeToken = { ...(actor.prototypeToken ?? {}), texture: { ...(actor.prototypeToken?.texture ?? {}), src: TOKEN } };

const refreshed = refreshFromPacks(actor.items);
// ---- 6. dnd5e 5.x item uses: recovery period per each feature's description (sr = short/long rest pool, lr = long rest)
const RECOVERY: Record<string, "sr" | "lr"> = {
  "Channel Conviction: Thundering Resolve": "sr", "Rallying Presence": "lr", "Color of Observation Novice": "sr", "Color of Armament Novice": "sr",
  "Conqueror's Haki Novice": "lr", "Command-Command: Fiat": "lr", "Command-Command: Absolute Imperative": "lr", "Devil Fruit Uses": "lr",
};
for (const i of actor.items) {
  const period = RECOVERY[i.name ?? ""]; if (!period) continue;
  i.system.uses = { spent: 0, max: String(i.system.uses.max), recovery: [{ period, type: "recoverAll" }] };
}
const act = (item: string, name: string) => Object.values(actor.items.find((i) => i.name === item)!.system.activities as Record<string, any>).find((a) => a.name === name)!;
act("Command-Command: Absolute Imperative", "Command-Command: Absolute Imperative").save.dc.formula = "8 + @prof + @abilities.cha.mod"; // = 17 at prof +4, Cha +5
const rev = act("Channel Conviction: Thundering Resolve", "Reverberating Smite"); // Ardent Smite damage (2d8, +1d8 per slot above 1st, max 6d8) + savant level
rev.damage.parts[0].custom.formula = "2d8 + @classes.savant.levels"; rev.description.chatFlavor = "Ardent Smite damage (2d8, +1d8 per creation slot level above 1st, max 6d8) + savant level. Failure: also pulled up to 10 ft to an empty square within 5 ft of you.";
act("Channel Conviction: Thundering Resolve", "Echoing Rebuke").description.chatFlavor = "Resistance to the triggering damage. On a failed save the attacker takes thunder damage equal to the damage it dealt (before your resistance); roll that amount manually.";
const mace = actor.items.find((i) => i.name === "Mace")!;
mace.system.range = { value: 5, long: null, units: "ft" };
Object.assign(act("Mace", "Mace").range, { value: 5, units: "ft" });
console.log(`Refreshed ${refreshed.refreshed.length} Cadence items; unmatched: ${refreshed.unmatched.join(", ") || "none"}`);
writeFileSync(`${ACTORS}/cadence.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/cadence.json (${actor.items.length} items)`);
