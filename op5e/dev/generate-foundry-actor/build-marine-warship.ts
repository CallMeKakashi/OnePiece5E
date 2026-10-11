// Marine Warship: Galleon hull from the ships pack + a mixed broadside from the ship-weapons pack. Built 2026-10-11.
// Replaces the legacy sheet (a Galleon copy with speed 0 and non-pack cannons, plus three Explosive Cannon feats).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { generateId } from "../../data/helpers/id.js";

type Doc = { _id: string; name: string; type: string; system: Record<string, any> } & Record<string, any>;
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const ship = pack("ships", "Galleon");
const gun = (name: string, quantity: number): Doc => {
  const w = structuredClone(pack("ship-weapons", name));
  w._id = generateId(`homebrew/marine-warship/${name}`); w.system.quantity = quantity; return w;
};
const guns = [gun("Swivel Gun", 4), gun("18-pounder", 4), gun("36-pounder", 2)];
const actor = { ...structuredClone(ship), name: "Marine Warship", items: guns, effects: [], flags: {}, folder: null, sort: 0, ownership: { default: 0 } } as Doc;
delete (actor as any)._id;
actor.system.details.biography.value = "<p>A Marine ship of the line: Galleon hull (AC 17, 1200 HP, damage threshold 30, 4.5 mph, 60 crew and 90 passengers) with a mixed broadside of four Swivel Guns, four 18-pounders and two 36-pounders.</p><p><strong>Build note:</strong> rebuilt from the Galleon in the ships pack; the legacy 12- and 64-pounders and Explosive Cannon feats were dropped.</p>";
actor.img = "one-piece-5e/npcs/Ships/marine-warship-new.jpg";
actor.prototypeToken = { name: "Marine Warship", texture: { src: "one-piece-5e/npcs/Ships/marine-warship-new-token.png" }, width: 6, height: 6, actorLink: false, disposition: -1 } as never;
writeFileSync("../Foundry/actors-json/marine-warship.json", JSON.stringify(actor, null, 2), "utf-8");
console.log(`Wrote marine-warship.json (${guns.length} weapons)`);
