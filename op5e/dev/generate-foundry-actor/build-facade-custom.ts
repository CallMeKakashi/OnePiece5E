import { readFileSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { inspiredInnovationFeatures } from "../../data/src/class-features/additional/inspired-innovation.js";
import { generateId } from "../../data/helpers/id.js";
import { refreshFromPacks } from "./refresh-from-packs.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;

const actor = JSON.parse(readFileSync("../Foundry/actors-json/facade-chassis.json", "utf8")) as Doc;

actor.items.push(embedOwnedItem(inspiredInnovationFeatures[0] as never) as Doc);
actor.items.push({
  _id: generateId("homebrew/facade/homunculus-servant"),
  name: "Homunculus Servant (OHM Spider)",
  type: "feat",
  img: "one-piece-5e/npcs/Gentle Giant Pirates/homunculus.png",
  system: {
    description: { value: "<p>Facade's official Homunculus Servant is a flying spider drone and remote extension of OHM. Use the existing Homunculus Servant actor for its stat block. It follows the official servant rules and can deliver Facade's creations through Channel Creations.</p>", chat: "" },
    source: { book: "OP5e / existing Foundry actor", page: "", custom: "", license: "" },
    type: { value: "class", subtype: "" }, requirements: "Gadgeteer",
    activation: { type: "special", cost: null, condition: "Deploy or command the Homunculus Servant actor" },
    duration: { value: null, units: "" }, target: { value: null, width: null, units: "", type: "" },
    range: { value: 120, long: null, units: "ft" }, uses: { value: null, max: "", per: null, recovery: "", prompt: true },
    actionType: "", damage: { parts: [], versatile: "" }, save: { ability: "", dc: null, scaling: "spell" },
    chatFlavor: "", recharge: { value: null, charged: false }, activities: {},
  }, effects: [], flags: { op5e: { companionActorId: "U6j5VTZqIUKuKZF8", companionSlug: "homunculus-servant" } },
  folder: null, sort: 0, ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as Doc);

const hakiNovice = actor.items.find((item) => item.name === "Color of Armament Novice");
const hakiApprentice = actor.items.find((item) => item.name === "Color of Armament Apprentice");
if (!hakiNovice || !hakiApprentice) throw new Error("Facade chassis is missing Armament Haki Novice and Apprentice");
actor.items = actor.items.filter((item, index, items) =>
  items.findIndex((candidate) => candidate.name === item.name) === index,
);

actor.name = "Facade";
actor.img = "one-piece-5e/npcs/Gentle Giant Pirates/facade.png";
actor.prototypeToken = { texture: { src: "one-piece-5e/npcs/Gentle Giant Pirates/facade-token.png" } };
actor.system.details.cr = 6;
actor.system.details.biography = {
  value: `<p>Facade is an undead cyborg artificer shell animated and directed by OHM, an onboard artificial intelligence. OHM's remote extension is a flying spider Homunculus Servant that can act independently and deliver Facade's creations.</p><p><strong>Additional Power:</strong> Inspired Innovation. Facade's engineering knowledge broadens OHM's available creations.</p>`,
  public: "",
};
actor.system.attributes.hp = { value: 112, max: 112, temp: 0, tempmax: 0, formula: "10d8 + 40" };
actor.system.attributes.ac = { flat: 19, calc: "flat", formula: "" };
actor.system.traits.armorProf = { value: ["med", "hvy", "shl"], custom: "" };
actor.system.traits.weaponProf = { value: ["sim"], custom: "Flintlocks" };
actor.system.abilities.con.proficient = 1;
actor.system.abilities.int.proficient = 1;
actor.system.skills = {
  arc: { value: 1, ability: "int", bonuses: { check: "", passive: "" } },
  inv: { value: 1, ability: "int", bonuses: { check: "", passive: "" } },
  dec: { value: 1, ability: "cha", bonuses: { check: "", passive: "" } },
  prf: { value: 1, ability: "cha", bonuses: { check: "", passive: "" } },
};

const refreshed = refreshFromPacks(actor.items);
console.log(`Refreshed ${refreshed.refreshed.length} Facade items; unmatched: ${refreshed.unmatched.join(", ") || "none"}`);

writeFileSync("../Foundry/actors-json/facade.json", JSON.stringify(actor, null, 2), "utf8");
console.log(`Wrote ../Foundry/actors-json/facade.json (${actor.items.length} items, CR ${actor.system.details.cr})`);
