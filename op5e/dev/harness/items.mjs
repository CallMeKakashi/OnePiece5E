// Equips every armor/shield and checks the resulting AC; rolls every weapon's damage and checks dice and type.
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const items = Object.values(BUILT.items).filter((d) => d.type === "weapon" || (d.type === "equipment" && d.system.armor?.value));

const probe = async ({ id }) => {
  const H = game.op5eHarness;
  const src = await fromUuid(`Compendium.op5e.items.${id}`);
  const actor = await H.createActor({ name: "Gear", abilities: { str: 16, dex: 14, con: 12, int: 10, wis: 10, cha: 10 } });
  const out = { name: src.name, type: src.type, fails: [] };
  const item = await H.giveItem(actor, src.toObject());
  if (src.type === "equipment") {
    const base = actor.system.attributes.ac.value;           // unarmored: 10 + dex
    await H.equipItem(item);
    const ac = actor.system.attributes.ac.value, v = src.system.armor.value, t = src.system.type.value;
    const dex = actor.system.abilities.dex.mod;
    const want = t === "shield" ? base + v : t === "light" ? v + dex : t === "medium" ? v + Math.min(dex, 2) : v;
    out.detail = { base, ac, want, t };
    if (ac !== want) out.fails.push(`AC ${ac}, expected ${want} (${t} ${v})`);
  } else {
    await H.equipItem(item);
    const act = H.findActivity(item, "attack");
    const first = [...item.system.activities][0];
    if (!act && first) {   // dial/special weapons use a save, damage or utility activity instead of an attack
      try { await Promise.race([H.executeActivity(item, first.id), new Promise((_, j) => setTimeout(() => j(new Error("TIMEOUT")), 8000))]); out.detail = { activity: first.type }; }
      catch (e) { out.fails.push(`${first.type} activity: ${e.message.slice(0, 100)}`); }
    } else if (!act) { out.fails.push("no activities"); }
    else {
      const parts = act.damage?.parts ?? [], p = parts[0];
      const rolls = await H.rollDamage(item, "attack");
      const f = rolls?.[0]?.formula ?? "";
      out.detail = { formula: f, parts: parts.length };
      if (p?.number && !f.includes(`${p.number}d${p.denomination}`)) out.fails.push(`damage "${f}" missing ${p.number}d${p.denomination}`);
      if (p?.types?.length && rolls?.[0]?.options?.type && !p.types.includes(rolls[0].options.type)) out.fails.push(`type ${rolls[0].options.type}`);
      const atk = await H.rollAttack(item, "attack");
      if (!atk?.[0]?.total) out.fails.push("attack roll failed");
    }
  }
  await H.cleanup();
  return out;
};

const results = [];
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(300000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    for (const d of items) {
      const r = await page.evaluate(`(${probe.toString()})(${JSON.stringify({ id: d._id })})`).catch((e) => ({ name: d.name, fails: [`error: ${e.message.slice(0, 160)}`] }));
      r.pass = r.fails.length === 0; results.push(r);
      if (!r.pass) console.log(`FAIL ${r.name}: ${r.fails.join("; ")} ${JSON.stringify(r.detail ?? "")}`);
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-gear.json", JSON.stringify(results, null, 1));
console.log(`${results.filter((r) => r.pass).length}/${results.length} weapons and armor behave`);
