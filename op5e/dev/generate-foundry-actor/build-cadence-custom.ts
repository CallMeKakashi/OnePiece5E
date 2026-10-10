import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import { refreshFromPacks } from "./refresh-from-packs.js";

type Doc = Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const IMG = "icons/svg/aura.svg";
const PORTRAIT = "one-piece-5e/npcs/Decibella/Cadence-.png";
const TOKEN = "one-piece-5e/npcs/Decibella/cadence-token.png";

function command(id: string, name: string, description: string, activation: string, saveAbility = "", damage = ""): Doc {
  const item = {
    _id: generateId(`homebrew/cadence/${id}`),
    name,
    type: "feat",
    img: IMG,
    system: {
      description: { value: `<p>${description}</p>`, chat: "" },
      source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: "Command-Command Fruit",
      activation: { type: activation, cost: 1, condition: "" },
      duration: { value: 1, units: "round" },
      target: { value: 1, width: null, units: "ft", type: "creature" },
      range: { value: 60, long: null, units: "ft" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: saveAbility ? "save" : "",
      damage: { parts: damage ? [[damage, "psychic"]] : [], versatile: "" },
      save: { ability: saveAbility, dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  };
  return embedOwnedItem(ensureFeatureActivities(item as never) as never) as Doc;
}

const path = `${ACTORS}/cadence-chassis.json`;
const actor = JSON.parse(readFileSync(path, "utf-8")) as Doc;
const fruit = actor.items.find((item: Doc) => item.name?.includes("Paramecia Devil Fruit"));
if (!fruit) throw new Error("Cadence chassis is missing the Paramecia Devil Fruit template");
fruit.name = "Command-Command Fruit";
fruit.system.description = {
  value: "<p>Cadence wields the Command-Command Fruit. A single word from her can grant an ally a temporary power or force an enemy to obey.</p>",
  chat: "",
};

const empower = command(
  "power-word-empower",
  "Power Word: Empower",
  "As a bonus action, speak one word to an ally within 60 feet. Choose one command: <strong>Strike</strong> — the ally's next weapon or unarmed hit before the end of your next turn deals an extra 3d8 psychic damage; <strong>Guard</strong> — the ally gains 3d8 temporary hit points; or <strong>Move</strong> — the ally moves up to half its speed without provoking opportunity attacks. The command grants a temporary ability, not a permanent feature.",
  "bonus",
);
const obey = command(
  "power-word-obey",
  "Power Word: Obey",
  "As an action, speak one word to a creature within 60 feet that can hear you. The target makes a Wisdom saving throw against Cadence's command save DC. On a failure, it must immediately follow a short, non-suicidal command such as Halt, Kneel, Flee, Drop, or Approach, using its reaction if needed; the effect lasts until the end of Cadence's next turn. On a success, the target is immune to this command until the next dawn.",
  "action",
  "wis",
);

actor.items.push(empower, obey);
const seenHaki = new Set<string>();
actor.items = actor.items.filter((item: Doc) => {
  if (!/^Color of (Observation|Armament) Novice$/.test(item.name)) return true;
  if (seenHaki.has(item.name)) return false;
  seenHaki.add(item.name);
  return true;
});
const seenRoles = new Set<string>();
actor.items = actor.items.filter((item: Doc) => {
  if (!item.name?.startsWith("Role: ")) return true;
  if (seenRoles.has(item.name)) return false;
  seenRoles.add(item.name);
  return true;
});
actor.system.abilities.con.value = 18;
actor.system.abilities.dex.value = 15;
actor.system.abilities.wis.value = 15;
actor.system.attributes.hp = { ...actor.system.attributes.hp, value: 255, max: 255, formula: "15d8 + 180" };
actor.system.details.cr = 12;
for (const item of actor.items) if (["Heavy Longcoat", "Shield"].includes(item.name)) item.system.equipped = true;
actor.system.details.biography.value = "<p>Cadence is the leader of the Silenced rebellion in Decibella. She is a human Savant (Mindful Insight), Folk Hero, and Captain who wields the Command-Command Fruit.</p><p>CR balance note: the class chassis is raised to the CR 12 defensive band with a labelled HP override; Power Word: Empower and Power Word: Obey are bespoke fruit abilities.</p>";
actor.name = "Cadence";
actor.img = PORTRAIT;
actor.prototypeToken = {
  ...(actor.prototypeToken ?? {}),
  texture: { ...(actor.prototypeToken?.texture ?? {}), src: TOKEN },
};

const refreshed = refreshFromPacks(actor.items);
console.log(`Refreshed ${refreshed.refreshed.length} Cadence items; unmatched: ${refreshed.unmatched.join(", ") || "none"}`);

writeFileSync(`${ACTORS}/cadence.json`, JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote ${ACTORS}/cadence.json (${actor.items.length} items)`);
