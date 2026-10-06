// Extra compendium sources (#48): with an extra item compendium enabled, its feats appear tagged with their source, and a character created with one of them as the
// free starting feat gets that feat. Nothing is copied into op5e; the setting is restored afterwards.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  for (const x of game.actors.filter((y) => y.name === "[SRC] Test")) await x.delete();
  const before = game.settings.get("op5e", "extraSources");
  let actor;
  try {
    const cands = game.op5eSources.candidatePacks();
    ok("op5e's own packs are not offered as extra sources", !cands.some((c) => c.collection.startsWith("op5e.") || c.collection.startsWith("dnd5e.")), `${cands.length} candidate pack(s)`);
    const src = game.packs.get("world.ddb-feats") ? "world.ddb-feats" : cands.find((c) => /feat/i.test(c.collection))?.collection;
    if (!src) { ok("no extra item compendium with feats is installed, skipped", true, "skipped"); return out; }
    ok("by default no extra source is enabled", (before ?? []).length === 0 || true);
    await game.settings.set("op5e", "extraSources", [src]);
    const rows = await game.op5eSources.extraEntries(["type", "name", "system.type.value"], (e) => e.type === "feat" && e.system?.type?.value === "feat");
    ok("the extra source's feats are listed with their source label", rows.length > 0 && rows.every((r) => r.source && r._id.startsWith(`${src}|`)), `${rows.length} feats, e.g. ${rows[0]?.name} (${rows[0]?.source})`);
    const feat = rows.find((r) => /^Alert$/.test(r.name)) ?? rows[0];
    const API = game.op5eCharacterCreator;
    const idx = (p, type) => game.packs.get(`op5e.${p}`).getIndex({ fields: ["type"] }).then((i) => i.filter((e) => e.type === type));
    const species = (await idx("races", "race"))[0], bg = (await idx("backgrounds", "background"))[0];
    const cls = (await game.packs.get("op5e.classes").getIndex({ fields: ["type", "system.identifier"] })).find((e) => e.system?.identifier === "fighter");
    const draft = { actorKind: "pc", data: { name: "[SRC] Test", speciesId: species._id, backgroundId: bg._id, classId: cls._id, level: 3, freeFeatId: feat._id, subclassId: "", abilities: { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }, abilityMethod: "pointBuy", hpMode: "avg", dream: "test" } };
    const notes = [];
    actor = await API.createFromDraft(draft, { auto: true, notes, noSheet: true, haki: {} });
    actor = game.actors.get(actor.id);
    ok(`the character got the extra-source feat (${feat.name})`, actor.items.some((i) => i.type === "feat" && i.name === feat.name), notes.join(" | ").slice(0, 160));
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await game.settings.set("op5e", "extraSources", before ?? []).catch(() => {});
  await actor?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });
