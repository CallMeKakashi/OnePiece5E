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

  // ---- Full Beast Form: dnd5e transform, hit points = N x level + the beast's Con mod, back to the old hit points on revert
  {
    const a = game.actors.find((x) => x.name === "Roma" && x.flags?.op5e?.rebuiltFromOldSheet);
    const lvl = a.system.details.level, hp0 = a.system.attributes.hp.value, fb = a.items.getName("Zoan Full Beast Form");
    const fa = [...fb.system.activities].find((x) => /ancient/.test(x.name)), mult = 6;
    ok("Full Beast Form is a transform activity", fa.type === "transform" && [...fa.settings.other].includes(`op5e:hpmult:${mult}`));
    const pk = game.packs.get("op5e.monsters"), e = (await pk.getIndex()).find((x) => /Titan Ape/.test(x.name)) ?? (await pk.getIndex()).contents[0];
    const beastData = (await pk.getDocument(e._id)).toObject(); delete beastData._id; beastData.name = "[T] Beast"; beastData.flags = { op5e: { harnessTest: true } };
    const beast = await Actor.create(beastData);
    let form = null;
    try {
      await a.transformInto(beast, fa.settings, { renderSheet: false });
      form = game.actors.find((x) => x.flags?.dnd5e?.isPolymorphed && x.flags?.dnd5e?.originalActor === a.id);
      const want = mult * lvl + beast.system.abilities.con.mod;
      ok("Full Beast: hit points = 6 x level + beast Con mod", form?.system.attributes.hp.max === want, `${form?.system.attributes.hp.max} vs ${want}`);
      ok("Full Beast: uses the beast's Str", form?.system.abilities.str.value === beast.system.abilities.str.value, `${form?.system.abilities.str.value}`);
      ok("Full Beast: keeps Int/Wis/Cha", ["int", "wis", "cha"].every((k) => form?.system.abilities[k].value === a.system.abilities[k].value));
      await form?.revertOriginalForm({ renderSheet: false });
      const back = game.actors.get(a.id);
      ok("Full Beast: revert restores the original actor and hit points", !!back && back.system.attributes.hp.value === hp0, `${back?.system.attributes.hp.value} vs ${hp0}`);
    } catch (err) { ok("Full Beast transform ran", false, String(err.message).slice(0, 120)); }
    for (const x of game.actors.filter((x) => x.flags?.dnd5e?.isPolymorphed && x.flags?.dnd5e?.originalActor === a.id)) await x.delete().catch(() => {});
    await beast.delete().catch(() => {});
  }
  // ---- Sulong ends: one level of exhaustion
  {
    const a = game.actors.find((x) => x.name === "Roma" && x.flags?.op5e?.rebuiltFromOldSheet), ib = a.items.getName("Inner Beast");
    const ed = ib.effects.find((e) => e.name === "Sulong").toObject(); delete ed._id;
    const ex0 = a.system.attributes.exhaustion ?? 0;
    const [eff] = await a.createEmbeddedDocuments("ActiveEffect", [ed]); await eff.delete();
    await new Promise((r) => setTimeout(r, 800));
    ok("Sulong ending adds one level of exhaustion", (a.system.attributes.exhaustion ?? 0) === ex0 + 1, `${ex0} -> ${a.system.attributes.exhaustion}`);
    await a.update({ "system.attributes.exhaustion": ex0 });
  }
  // ---- Zoan Enhanced Form: one size category bigger while it lasts
  {
    const a = game.actors.find((x) => x.name === "Malphas" && x.flags?.op5e?.rebuiltFromOldSheet), pk = game.packs.get("op5e.feats");
    const f = await pk.getDocument((await pk.getIndex()).find((x) => x.name === "Zoan Enhanced Form")._id), size0 = a.system.traits.size;
    const ed = f.effects.contents[0].toObject(); delete ed._id;
    const [eff] = await a.createEmbeddedDocuments("ActiveEffect", [ed]);
    const order = ["tiny", "sm", "med", "lg", "huge", "grg"];
    ok("Enhanced Form raises size one category", a.system.traits.size === order[order.indexOf(size0) + 1], `${size0} -> ${a.system.traits.size}`);
    await eff.delete(); ok("size returns when it ends", a.system.traits.size === size0);
  }
  // ---- Import OP5e journals button/macro
  {
    const r1 = await game.op5eImportJournals(), r2 = await game.op5eImportJournals();
    ok("Import journals: copies the 14 journals", r1.made + r1.skipped === 14, JSON.stringify(r1));
    ok("Import journals: a second run skips them", r2.made === 0 && r2.skipped === 14, JSON.stringify(r2));
    for (const j of game.journal.filter((x) => x.getFlag("op5e", "importedFrom"))) await j.delete();
    for (const f of game.folders.filter((x) => x.type === "JournalEntry" && /^OP5e (Reference|Spell Lists)$/.test(x.name))) await f.delete();
  }
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
