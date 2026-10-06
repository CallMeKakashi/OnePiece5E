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
  await a.delete(); return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
