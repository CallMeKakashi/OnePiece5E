// Extra compendium sources (#48): with an extra item compendium enabled, its feats, backgrounds and classes appear tagged with their source in Create OPC and a character can
// be built from them; the source is switched on in dnd5e's own browser (level-up choices) and off again; the shop search builds a resolvable uuid. Nothing is copied into op5e;
// the settings are restored afterwards.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  for (const x of game.actors.filter((y) => /^\[SRC\]/.test(y.name))) await x.delete();
  const before = game.settings.get("op5e", "extraSources"), appliedBefore = game.settings.get("op5e", "extraSourcesApplied"), browserBefore = foundry.utils.deepClone(game.settings.get("dnd5e", "packSourceConfiguration"));
  const made = [];
  try {
    const cands = game.op5eSources.candidatePacks();
    ok("op5e's own packs are not offered as extra sources", !cands.some((c) => c.collection.startsWith("op5e.") || c.collection.startsWith("dnd5e.")), `${cands.length} candidate pack(s)`);
    const packs = ["world.ddb-feats", "world.ddb-backgrounds", "world.ddb-classes", "world.ddb-items"].filter((p) => game.packs.get(p));
    if (!packs.length) { ok("no extra item compendium is installed, skipped", true, "skipped"); return out; }
    await game.settings.set("op5e", "extraSources", packs); await new Promise((r) => setTimeout(r, 1500));
    // dnd5e's own compendium browser (level-up choices) now offers them
    const cfg = game.settings.get("dnd5e", "packSourceConfiguration");
    ok("the extra sources are switched on in dnd5e's compendium browser", packs.every((p) => cfg[p] === true), packs.map((p) => `${p}=${cfg[p]}`).join(" "));

    const rows = await game.op5eSources.extraEntries(["type", "name", "system.type.value"], (e) => e.type === "feat" && e.system?.type?.value === "feat");
    ok("the extra source's feats are listed with their source label", rows.length > 0 && rows.every((r) => r.source && r._id.includes("|")), `${rows.length} feats, e.g. ${rows[0]?.name} (${rows[0]?.source})`);
    const gear = await game.op5eSources.extraEntries(["type", "name"], (e) => ["weapon", "equipment", "consumable", "tool", "loot"].includes(e.type));
    const g0 = gear[0]; const [coll, id] = g0 ? [g0._id.split("|")[0], g0._id.split("|")[1]] : [];
    ok("the shop search builds a uuid that resolves to the item", !!g0 && !!(await fromUuid(`Compendium.${coll}.Item.${id}`)), g0?.name ?? "no gear");

    const API = game.op5eCharacterCreator;
    const idx = (p, type) => game.packs.get(`op5e.${p}`).getIndex({ fields: ["type"] }).then((i) => i.filter((e) => e.type === type));
    const species = (await idx("races", "race"))[0], bg0 = (await idx("backgrounds", "background"))[0];
    const cls = (await game.packs.get("op5e.classes").getIndex({ fields: ["type", "system.identifier"] })).find((e) => e.system?.identifier === "fighter");
    const base = { actorKind: "pc", data: { speciesId: species._id, backgroundId: bg0._id, classId: cls._id, level: 3, subclassId: "", abilities: { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }, abilityMethod: "pointBuy", hpMode: "avg", dream: "test" } };
    const build = async (name, patch) => { const notes = []; const a = await API.createFromDraft({ ...base, data: { ...base.data, name, ...patch } }, { auto: true, notes, noSheet: true, haki: {} }); const actor = game.actors.get(a.id); made.push(actor); return { actor, notes }; };

    // a feat
    const feat = rows.find((r) => /^Alert$/.test(r.name)) ?? rows[0];
    { const { actor, notes } = await build("[SRC] Feat", { freeFeatId: feat._id });
      ok(`a character with the extra-source feat (${feat.name})`, actor.items.some((i) => i.type === "feat" && i.name === feat.name), notes.join(" | ").slice(0, 140)); }

    // a background
    const bgs = await game.op5eSources.extraEntries(["type", "name"], (e) => e.type === "background"); const bg = bgs[0];
    if (bg) { const { actor, notes } = await build("[SRC] Background", { backgroundId: bg._id });
      ok(`a character with the extra-source background (${bg.name})`, actor.items.some((i) => i.type === "background" && i.name === bg.name), notes.join(" | ").slice(0, 140)); }
    else ok("no extra-source background, skipped", true, "skipped");

    // a class (and its listing with the subclass choices)
    const classes = await game.op5eSources.extraEntries(["type", "name", "system.identifier"], (e) => e.type === "class"); const xc = classes.find((c) => /Barbarian|Rogue|Fighter/i.test(c.name)) ?? classes[0];
    if (xc) {
      const info = await game.op5eCharacterCreator.classInfo?.(xc._id);
      ok("a class from an extra source resolves with its identifier", !info || info.name === xc.name, info ? `${info.name} (${info.identifier}), ${info.subclasses?.length ?? 0} subclass choices` : "classInfo not exported");
      const { actor, notes } = await build("[SRC] Class", { classId: xc._id, level: 1 });
      ok(`a character with the extra-source class (${xc.name})`, actor.items.some((i) => i.type === "class" && i.name === xc.name), notes.join(" | ").slice(0, 140));
    } else ok("no extra-source class, skipped", true, "skipped");

    // removing a source switches it off in dnd5e's browser again
    await game.settings.set("op5e", "extraSources", []); await new Promise((r) => setTimeout(r, 1500));
    const cfg2 = game.settings.get("dnd5e", "packSourceConfiguration");
    ok("removing the sources switches them off in dnd5e's browser again", packs.every((p) => cfg2[p] === false || cfg2[p] === undefined), packs.map((p) => `${p}=${cfg2[p]}`).join(" "));
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await game.settings.set("op5e", "extraSources", before ?? []).catch(() => {}); await game.settings.set("op5e", "extraSourcesApplied", appliedBefore ?? []).catch(() => {});
  await game.settings.set("dnd5e", "packSourceConfiguration", browserBefore).catch(() => {});
  for (const a of made) await a?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
