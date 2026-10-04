// Zoan Hybrid Form / Full Beast Form / Mink Sulong on the rebuilt campaign PCs (test world, Automation user).
// Usage: node dev/harness/transform.mjs      -> prints PASS/FAIL per check
import { withFoundry } from "./drive.mjs";

const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const mult = { "regular or carnivorous zoan": 2, "ancient zoan": 3, "mythical zoan": 4 };
  for (const name of ["Roma", "Hybrid", "Sulong", "Malphas"]) {
    const a = game.actors.find((x) => x.name === name && x.flags?.op5e?.rebuiltFromOldSheet);
    if (!a) { ok(`${name}: exists`, false); continue; }
    const lvl = a.system.details.level, prof = a.system.attributes.prof, fu = () => a.items.getName("Devil Fruit Uses");
    for (const e of a.effects) await e.delete(); await a.update({ "system.attributes.hp.temp": 0 }); await fu().update({ "system.uses.spent": 0 });
    const hf = a.items.getName("Zoan Hybrid Form"), act = [...hf.system.activities].find((x) => /regular/.test(x.name));
    const before = fu().system.uses.value;
    // the activity spends one Devil Fruit use, heals temp HP by formula; the effect is applied like the chat-card button does
    const spend = act.consumption.targets[0];
    ok(`${name}: Hybrid Form spends Devil Fruit Uses`, spend?.target === fu().id);
    await fu().update({ "system.uses.spent": 1 }); ok(`${name}: uses ${before} -> ${fu().system.uses.value}`, fu().system.uses.value === before - 1);
    const formula = act.healing.custom.formula, thp = await new Roll(formula, a.getRollData()).evaluate(); await a.applyTempHP(thp.total);
    ok(`${name}: temp HP = level x2`, a.system.attributes.hp.temp === 2 * lvl, `${a.system.attributes.hp.temp} (L${lvl})`);
    const ed = hf.effects.contents[0].toObject(); delete ed._id; ed.origin = hf.uuid; const [eff] = await a.createEmbeddedDocuments("ActiveEffect", [ed]);
    const hours = [[20, 8760], [15, 24], [10, 8], [5, 1]].find(([l]) => lvl >= l)?.[1] ?? 1 / 6;
    ok(`${name}: duration by level`, eff.duration.seconds === Math.round(hours * 3600), `${eff.duration.seconds}s at L${lvl}`);
    ok(`${name}: +proficiency weapon damage`, a.system.bonuses.mwak.damage.includes("@prof"), `prof ${prof}`);
    await eff.delete(); await a.update({ "system.attributes.hp.temp": 0 });
    const fb = a.items.getName("Zoan Full Beast Form"), fa = [...fb.system.activities].find((x) => /regular/.test(x.name));
    ok(`${name}: Full Beast spends Devil Fruit Uses`, fa.consumption.targets[0]?.target === fu().id);
    const ib = a.items.getName("Inner Beast");
    if (a.items.some((i) => i.type === "race" && /mink/i.test(i.name))) {
      ok(`${name}: Inner Beast has Sulong activity`, !!ib && [...ib.system.activities].some((x) => /Sulong/.test(x.name)));
      const str0 = a.system.abilities.str.value, dex0 = a.system.abilities.dex.value;
      const [s] = await a.createEmbeddedDocuments("ActiveEffect", [{ name: "Sulong", duration: { seconds: 60 }, changes: ib.effects.find((e) => e.name === "Sulong")?.changes.map((c) => ({ ...c })) ?? [] }]);
      ok(`${name}: Sulong +4 Str/Dex`, a.system.abilities.str.value === str0 + 4 && a.system.abilities.dex.value === dex0 + 4, `${str0}->${a.system.abilities.str.value}, ${dex0}->${a.system.abilities.dex.value}`);
      await s.delete();
    } else ok(`${name}: not a Mink, no Inner Beast expected`, !ib);
    await fu().update({ "system.uses.spent": 0 });
  }
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
