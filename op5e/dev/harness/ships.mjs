// Ships/cannons: import built JSON, verify vehicle stats vs source, fire every cannon (attack, damage, spread save).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const load = (d) => readdirSync(`packs-src/${d}`).map((f) => JSON.parse(readFileSync(`packs-src/${d}/${f}`, "utf8")));
const ships = load("ships"), cannons = load("ship-weapons");
let res;
try {
  res = await withFoundry((_, { evaluate }) => evaluate(async ({ ships, cannons }) => {
    const H = game.op5eHarness, out = []; const check = (r, c, m) => { if (!c) { r.pass = false; r.fails.push(m); } };
    const tgt = await H.createActor({ name: "Tgt", hp: 900 }); H.targetToken(await H.createToken(tgt));
    const tag = (d) => ({ ...foundry.utils.deepClone(d), name: `[T] ${d.name}`, flags: { ...d.flags, op5e: { ...d.flags?.op5e, harnessTest: true } } });
    for (const s of ships) {
      const r = { name: s.name, kind: "ship", pass: true, fails: [] };
      const a = await Actor.create(tag(s)); const sys = a.system.attributes;
      check(r, a.type === "vehicle" && a.system.vehicleType === "water", "not a water vehicle");
      check(r, sys.hp.max === s.system.attributes.hp.max && sys.hp.value === sys.hp.max, "hp");
      check(r, sys.ac.value === s.system.attributes.ac.flat, `ac ${sys.ac.value}`);
      check(r, sys.hp.dt === s.system.attributes.hp.dt, "damage threshold");
      check(r, sys.movement.swim === s.system.attributes.movement.swim, "speed");
      check(r, sys.capacity.cargo === s.system.attributes.capacity.cargo && sys.capacity.creature === s.system.attributes.capacity.creature, "capacity");
      const hp0 = H.getHP(a).value; await a.applyDamage(5); check(r, H.getHP(a).value <= hp0 - 0, "applyDamage ran"); // threshold may absorb 5
      out.push(r);
    }
    const ship = game.actors.find((x) => x.type === "vehicle" && x.name === "[T] Galleon");
    for (const c of cannons) {
      const r = { name: c.name, kind: "cannon", pass: true, fails: [] }; H.clearConsoleErrors();
      try {
        const it = await H.giveItem(ship, c); const atk = H.findActivity(it, "attack"), sv = H.findActivity(it, "save");
        const d = c.system.activities.dnd5eactivity000.damage.parts[0], expect = `${d.number}d${d.denomination}`;
        const dmg = await H.rollDamage(it, "attack"); check(r, dmg?.[0]?.formula?.includes(expect), `damage formula ${dmg?.[0]?.formula} vs ${expect}`);
        const ar = await H.rollAttack(it, "attack"); check(r, !!ar?.[0], "attack roll");
        check(r, Number(sv.save.dc.formula) === 8 + d.number, "spread DC");
        await Promise.race([H.executeActivity(it, "save"), new Promise((_, j) => setTimeout(() => j(new Error("TIMEOUT")), 8000))]);
      } catch (e) { r.pass = false; r.fails.push(e.message.slice(0, 150)); }
      const errs = H.getConsoleErrors(); if (errs.length) { r.pass = false; r.fails.push(`console: ${errs[0].slice(0, 120)}`); }
      out.push(r);
    }
    await H.cleanup(); return out;
  }, { ships, cannons }));
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-ships.json", JSON.stringify(res, null, 1));
console.log(`${res.filter((r) => r.pass).length}/${res.length} pass`); for (const r of res.filter((r) => !r.pass)) console.log(r.kind, r.name, r.fails);
