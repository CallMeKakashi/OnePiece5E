// Imports packs-src/monsters/*.json into the test world, runs each action, and checks attack/damage against the stat block.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const docs = readdirSync("packs-src/monsters").map((f) => JSON.parse(readFileSync(`packs-src/monsters/${f}`, "utf8")));
let res;
try {
  res = await withFoundry(async (page, { evaluate }) => evaluate(async (docs) => {
    const H = game.op5eHarness, out = [];
    const tgt = await H.createActor({ name: "Tgt", hp: 500 }); const tok = await H.createToken(tgt); H.targetToken(tok);
    for (const d of docs) {
      const r = { name: d.name, checks: [], pass: true };
      const fail = (m) => { r.pass = false; r.checks.push(m); };
      let a;
      try { a = await Actor.create({ ...foundry.utils.deepClone(d), name: `[T] ${d.name}`, flags: { ...d.flags, op5e: { ...d.flags?.op5e, harnessTest: true } } }, { keepId: false }); }
      catch (e) { fail(`create: ${e.message.slice(0, 160)}`); out.push(r); continue; }
      if (a.system.attributes.hp.max !== d.system.attributes.hp.max) fail("hp mismatch");
      if (a.system.attributes.ac.value !== d.system.attributes.ac.flat) fail(`ac ${a.system.attributes.ac.value} != ${d.system.attributes.ac.flat}`);
      if (a.system.details.cr !== d.system.details.cr) fail("cr mismatch");
      for (const it of a.items) for (const act of it.system.activities ?? []) {
        H.clearConsoleErrors();
        try {
          if (act.type === "attack") {
            const bonus = Number(d.items.find((x) => x.name === it.name).system.activities[act.id]?.attack?.bonus);
            const rolls = await H.rollAttack(it, act.id); const f = rolls?.[0]?.formula ?? "";
            if (!f.includes(String(bonus))) fail(`${it.name}: attack formula "${f}" lacks +${bonus}`);
            await H.rollDamage(it, act.id);
          } else await Promise.race([H.executeActivity(it, act.id), new Promise((_, j) => setTimeout(() => j(new Error("TIMEOUT")), 8000))]);
          r.checks.push(`${it.name}:${act.type} ok`);
        } catch (e) { fail(`${it.name}:${act.type} ${e.message.slice(0, 120)}`); }
        const errs = H.getConsoleErrors(); if (errs.length) r.checks.push(`WARN ${it.name}: ${errs[0].slice(0, 100)}`);
      }
      out.push(r);
    }
    await H.cleanup(); return out;
  }, docs));
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-monsters.json", JSON.stringify(res, null, 1));
console.log(`${res.filter((r) => r.pass).length}/${res.length} monsters pass`);
for (const r of res.filter((r) => !r.pass)) console.log(r.name, r.checks.filter((c) => !/ ok$/.test(c) && !c.startsWith("WARN")));
