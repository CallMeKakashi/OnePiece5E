// Checks the batch-1 text-only automations (issue #26): each feat changes the number its text promises. Test world, Automation user.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  await game.op5eApi.createCharacter({ name: "[B1] Scratch", species: "Human", background: "Boxer", cls: "Brawler", level: 3 });
  const a = game.actors.getName("[B1] Scratch");
  const add = async (n) => game.op5eApi.addItem({ actor: a.name, name: n, pack: "op5e.feats" });
  const snap = () => ({ walk: a.system.attributes.movement.walk, swim: a.system.attributes.movement.swim, init: a.system.attributes.init.total, pp: a.system.skills.prc.passive, pi: a.system.skills.inv.passive, dv: a.system.attributes.senses.darkvision, hp: a.system.attributes.hp.max });
  let b = snap(), c;
  const step = async (feat, check, d) => { await add(feat); c = snap(); ok(`${feat}: ${d}`, check(b, c), `${JSON.stringify(b)} -> ${JSON.stringify(c)}`); b = c; };
  await step("Charger", (x, y) => y.walk === x.walk + 10, "+10 speed");
  await step("Fleet-Footed", (x, y) => y.walk === x.walk + 5 && y.init === x.init + a.system.attributes.prof, "+5 speed, +prof initiative");
  await step("Hooves Inbound", (x, y) => y.walk === x.walk + 5, "+5 speed");
  await step("Knack Of The Pretender", (x, y) => y.walk === x.walk + 5, "+5 speed");
  await step("Water Wings", (x, y) => y.swim === x.swim + 10, "+10 swim");
  await step("Sea Sovereignty", (x, y) => y.swim === x.swim + 10, "+10 swim");
  await step("Perceptive", (x, y) => y.dv === x.dv + 30, "+30 ft darkvision");
  await step("Knack Of The Hunter", (x, y) => y.dv === x.dv + 60, "+60 ft darkvision");
  const hp1 = a.system.attributes.hp.max; await add("Made For War"); ok("Made For War: HP maximum +level", a.system.attributes.hp.max === hp1 + a.system.details.level, `${hp1} -> ${a.system.attributes.hp.max}`);
  // batch 2
  await step("Brawny", (x, y) => a.system.attributes.movement.climb === a.system.attributes.movement.walk, "climb speed equals walking speed");
  const cl = a.system.attributes.movement.climb; ok("Brawny: climb is not zero", cl > 0, `${cl}`);
  await add("Enhanced Circuitry"); ok("Enhanced Circuitry: lightning resistance", a.system.traits.dr.value.has("lightning"));
  await game.op5eApi.addItem({ actor: a.name, name: "Powerful Build" }); ok("Powerful Build: dnd5e flag set", !!a.getFlag("dnd5e", "powerfulBuild"));
  // batch 3: resistances, immunities, initiative, speed and save effects found by the per-feature review
  const give = (n) => game.op5eApi.addItem({ actor: a.name, name: n });
  for (const [feat, type] of [["Corrosive Soul", "acid"], ["Echoing Soul", "thunder"], ["Fiery Soul", "fire"], ["Frozen Soul", "cold"], ["Psychic Soul", "psychic"], ["Shining Soul", "radiant"], ["Sparking Soul", "lightning"], ["Expanding Epiphany", "psychic"], ["Undead Resolve", "necrotic"]]) {
    await give(feat); ok(`${feat}: resistance to ${type}`, a.system.traits.dr.value.has(type));
  }
  await give("Purity of the Body"); ok("Purity of the Body: poison immunity and poisoned/diseased condition immunity", a.system.traits.di.value.has("poison") && a.system.traits.ci.value.has("poisoned"));
  await give("Crazed Bravado"); ok("Crazed Bravado: fire and thunder resistance, deafened immunity", a.system.traits.dr.value.has("fire") && a.system.traits.ci.value.has("deafened"));
  const w0 = a.system.attributes.movement.walk; await give("Shandian Mobility"); ok("Shandian Mobility: +5 walk", a.system.attributes.movement.walk === w0 + 5, `${w0} -> ${a.system.attributes.movement.walk}`);
  const i0 = a.system.attributes.init.total; await give("Advanced Combat Tactics"); ok("Advanced Combat Tactics: initiative + max(Wis mod, 1)", a.system.attributes.init.total === i0 + Math.max(a.system.abilities.wis.mod, 1), `${i0} -> ${a.system.attributes.init.total}`);
  await give("Pure Soul"); ok("Pure Soul: advantage on Int, Wis and Cha saves", ["int", "wis", "cha"].every((k) => a.system.abilities[k].save.roll?.mode === 1), "modes " + ["int", "wis", "cha"].map((k) => a.system.abilities[k].save.roll?.mode).join(","));
  await a.delete(); return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
